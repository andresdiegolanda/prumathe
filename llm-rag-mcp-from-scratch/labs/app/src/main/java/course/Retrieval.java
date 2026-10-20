package course;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Lazy;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.json.JsonMapper;

/**
 * Lessons 15 and 17: three ways to find the chunks for a question, over the table Spring AI
 * filled. Vector search compares meanings; keyword search (PostgreSQL full text) matches exact
 * words and codes; hybrid fuses both rankings; the reranker reads each candidate with the
 * question and scores it again.
 */
@Component
@Lazy
class Retrieval {

    /** One retrieved chunk, with how it got its place. */
    record Hit(String id, String content, Map<String, Object> metadata, double score, String why) {
        String source() {
            return String.valueOf(metadata.get("source"));
        }

        String section() {
            return String.valueOf(metadata.get("section"));
        }

        String label() {
            return source() + " > " + section();
        }

        Document document() {
            Map<String, Object> m = new HashMap<>(metadata);
            m.put("why", why);
            return Document.builder().id(id).text(content).metadata(m).score(score).build();
        }

        Hit with(double newScore, String newWhy) {
            return new Hit(id, content, metadata, newScore, newWhy);
        }
    }

    /**
     * The settings a question is answered with, as the eval command names them. trusted keeps only
     * the chunks whose metadata says they come from the runbooks (lessons 17 and 19).
     */
    record Mode(boolean keyword, boolean hybrid, boolean rerank, boolean trusted, int k) {
        static Mode of(Args a, int defaultK) {
            return new Mode(a.has("keyword"), a.has("hybrid"), a.has("rerank"), a.has("trusted"), a.number("k", defaultK));
        }

        static Mode of(String name, int k) {
            return new Mode(name.startsWith("keyword"), name.startsWith("hybrid"), name.endsWith("+rerank"), false, k);
        }

        String name() {
            return (hybrid ? "hybrid" : keyword ? "keyword" : "vector") + (rerank ? "+rerank" : "");
        }
    }

    static final int RRF_K = 60;
    static final int POOL = 20;

    /**
     * The model card of Qwen3-Embedding asks for a one-sentence task instruction before each query
     * (not before the documents): Instruct: {task}, a line break, Query:{query}.
     */
    static final String INSTRUCT = "Instruct: Given a question about the Cauce integration platform, retrieve the runbook passages that answer it\nQuery:";

    private final VectorStore store;
    private final JdbcTemplate jdbc;
    private final String rerankUrl;
    private final JsonMapper json = JsonMapper.builder().build();
    private final HttpClient http = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(5)).build();

    Retrieval(VectorStore store, JdbcTemplate jdbc, @Value("${course.rerank-url}") String rerankUrl) {
        this.store = store;
        this.jdbc = jdbc;
        this.rerankUrl = rerankUrl;
    }

    List<Hit> retrieve(String query, Mode mode) {
        int pool = mode.rerank() ? POOL : mode.k();
        List<Hit> candidates = mode.hybrid() ? hybrid(query, pool, mode.trusted()) : mode.keyword() ? keyword(query, pool, mode.trusted()) : vector(query, pool, mode.trusted());
        List<Hit> out = mode.rerank() ? rerank(query, candidates, mode.k()) : candidates;
        record(query, mode, mode.rerank() ? candidates : null, out);
        return out;
    }

    /** Off while the evaluation fills its table: the table already says where each right chunk came. */
    static volatile boolean recording = true;

    /** For the live viewer: the query, its mode, the pool before the reranker and the chunks found. */
    static void record(String query, Mode mode, List<Hit> pool, List<Hit> hits) {
        if (!recording) return;
        tools.jackson.databind.node.ObjectNode r = Events.object().put("query", query).put("mode", mode.name()).put("k", mode.k()).put("trusted", mode.trusted());
        if (pool != null) {
            tools.jackson.databind.node.ArrayNode p = r.putArray("pool");
            for (Hit h : pool) p.addObject().put("label", h.label()).put("why", h.why());
        }
        tools.jackson.databind.node.ArrayNode a = r.putArray("hits");
        for (Hit h : hits) {
            String text = h.content();
            a.addObject().put("label", h.label()).put("trust", String.valueOf(h.metadata().getOrDefault("trust", ""))).put("score", h.score()).put("why", h.why())
                    .put("text", text.length() > 700 ? text.substring(0, 700) + "..." : text);
        }
        Events.add("retrievals", r);
    }

    /** Nearest vectors by cosine distance; Spring AI reports similarity, 1 minus the distance. */
    List<Hit> vector(String query, int k, boolean trusted) {
        SearchRequest.Builder request = SearchRequest.builder().query(INSTRUCT + query).topK(k);
        if (trusted) request = request.filterExpression("trust == 'runbook'");
        List<Hit> out = new ArrayList<>();
        for (Document d : store.similaritySearch(request.build())) {
            double s = d.getScore() == null ? 0 : d.getScore();
            out.add(new Hit(d.getId(), d.getText(), d.getMetadata(), s, String.format("vector %.3f", s)));
        }
        return out;
    }

    /**
     * PostgreSQL full text search over the words column (see ensureTextIndex): the question is
     * reduced to its words twice, with the English and the Spanish configurations, and any word
     * counts (OR). ts_rank_cd ranks first the chunks with more and closer matches. A code like
     * CAU-4021 becomes the words cau and -4021, and only its own section has -4021.
     */
    List<Hit> keyword(String query, int k, boolean trusted) {
        String sql = """
                WITH q AS (SELECT replace(plainto_tsquery('english', ?)::text, '&', '|')::tsquery
                               || replace(plainto_tsquery('spanish', ?)::text, '&', '|')::tsquery AS words)
                SELECT id::text AS id, content, metadata::text AS metadata, ts_rank_cd(vector_store.words, q.words) AS rank
                FROM vector_store, q
                WHERE vector_store.words @@ q.words%s
                ORDER BY rank DESC, id
                LIMIT ?""".formatted(trusted ? " AND metadata->>'trust' = 'runbook'" : "");
        return jdbc.query(sql, (rs, i) -> {
            double rank = rs.getDouble("rank");
            Map<String, Object> meta = json.readValue(rs.getString("metadata"), new TypeReference<Map<String, Object>>() {});
            return new Hit(rs.getString("id"), rs.getString("content"), meta, rank, String.format("keyword %.3f", rank));
        }, query, query, k);
    }

    /** Reciprocal rank fusion: each list adds 1 / (60 + rank); only positions matter, not scores. */
    List<Hit> hybrid(String query, int k, boolean trusted) {
        List<Hit> v = vector(query, POOL, trusted);
        List<Hit> w = keyword(query, POOL, trusted);
        Map<String, Hit> byId = new LinkedHashMap<>();
        Map<String, Double> fused = new HashMap<>();
        Map<String, String> why = new HashMap<>();
        for (int pass = 0; pass < 2; pass++) {
            List<Hit> list = pass == 0 ? v : w;
            String name = pass == 0 ? "vector" : "keyword";
            for (int i = 0; i < list.size(); i++) {
                Hit h = list.get(i);
                byId.putIfAbsent(h.id(), h);
                fused.merge(h.id(), 1.0 / (RRF_K + i + 1), Double::sum);
                why.merge(h.id(), name + " #" + (i + 1), (x, y) -> x + ", " + y);
            }
        }
        return byId.values().stream()
                .map(h -> h.with(fused.get(h.id()), String.format("rrf %.4f (%s)", fused.get(h.id()), why.get(h.id()))))
                .sorted(Comparator.comparingDouble(Hit::score).reversed())
                .limit(k).toList();
    }

    /** The reranker scores each question and chunk pair together; the best k come first. */
    List<Hit> rerank(String query, List<Hit> candidates, int k) {
        if (candidates.isEmpty()) return candidates;
        Map<String, Object> body = Map.of("model", "qwen3-reranker-0.6b", "query", query,
                "documents", candidates.stream().map(Hit::content).toList(), "top_n", candidates.size());
        JsonNode r;
        try {
            HttpRequest req = HttpRequest.newBuilder(URI.create(rerankUrl + "/v1/rerank")).timeout(Duration.ofMinutes(5))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(json.writeValueAsString(body))).build();
            HttpResponse<String> res = http.send(req, HttpResponse.BodyHandlers.ofString());
            if (res.statusCode() != 200) throw new CourseError("HTTP " + res.statusCode() + " from rerank: " + res.body());
            r = json.readTree(res.body());
        } catch (java.net.ConnectException e) {
            throw new CourseError("Cannot reach rerank. Start it with docker compose up -d --wait rerank");
        } catch (java.io.IOException e) {
            throw new CourseError("rerank: " + e.getMessage());
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new CourseError("Interrupted.");
        }
        List<Hit> out = new ArrayList<>();
        for (JsonNode n : r.path("results")) {
            Hit h = candidates.get(n.path("index").asInt());
            double s = n.path("relevance_score").asDouble();
            out.add(h.with(s, String.format("rerank %.3f, was %s", s, h.why())));
        }
        out.sort(Comparator.comparingDouble(Hit::score).reversed());
        return out.subList(0, Math.min(k, out.size()));
    }

    /**
     * Lesson 14: the words of each chunk for the keyword search, next to the vector Spring AI
     * stores. A generated column keeps them up to date, with the configuration of the chunk's
     * language (stop words out, words reduced to their stem), and a GIN index finds them.
     */
    void ensureTextIndex() {
        jdbc.execute("""
                ALTER TABLE vector_store ADD COLUMN IF NOT EXISTS words tsvector GENERATED ALWAYS AS (
                  to_tsvector(CASE WHEN metadata->>'lang' = 'es' THEN 'spanish'::regconfig ELSE 'english'::regconfig END, content)
                ) STORED""");
        jdbc.execute("CREATE INDEX IF NOT EXISTS vector_store_words_idx ON vector_store USING gin (words)");
    }

    void truncate() {
        jdbc.execute("TRUNCATE vector_store");
    }

    VectorStore store() {
        return store;
    }
}
