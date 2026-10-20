package course;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Stream;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

/** Tokens, next-token probabilities and sampling, straight from the llama.cpp endpoints. */
final class Tokens {
    private Tokens() {}

    static final Path CORPUS = Path.of("/course/corpus");

    static List<String> pieces(String text) throws Exception {
        ObjectNode req = Http.object().put("content", text).put("with_pieces", true).put("add_special", false);
        List<String> out = new ArrayList<>();
        for (JsonNode t : Http.post(Http.chat() + "/tokenize", req).path("tokens")) {
            JsonNode p = t.path("piece");
            out.add(p.isTextual() ? p.asText() : "<bytes " + p + ">");
        }
        return out;
    }

    static int count(String text) throws Exception {
        ObjectNode req = Http.object().put("content", text).put("add_special", false);
        return Http.post(Http.chat() + "/tokenize", req).path("tokens").size();
    }

    static String quote(String token) {
        try {
            return Http.JSON.writeValueAsString(token);
        } catch (Exception e) {
            return token;
        }
    }

    static String bar(double p) {
        return "#".repeat((int) Math.round(p * 30));
    }

    static void next(Lab.Args a) throws Exception {
        String text = a.text(0);
        int top = a.number("top", 5);
        ObjectNode req = Http.object().put("prompt", text).put("n_predict", 1).put("n_probs", top)
                .put("temperature", 0).put("cache_prompt", false);
        JsonNode r = Http.post(Http.chat() + "/completion", req);
        System.out.println("Text: " + quote(text) + " (" + count(text) + " tokens)");
        System.out.println("Most probable next tokens, as the model computes them:");
        int i = 1;
        for (JsonNode c : r.path("completion_probabilities").path(0).path("top_logprobs")) {
            double p = Math.exp(c.path("logprob").asDouble());
            System.out.printf("  %d  %-16s %6.1f %%  %s%n", i++, quote(c.path("token").asText()), p * 100, bar(p));
        }
        if (a.has("temperature")) {
            double temp = a.decimal("temperature", 0.8);
            ObjectNode s = req.deepCopy().put("temperature", temp).put("post_sampling_probs", true);
            JsonNode rs = Http.post(Http.chat() + "/completion", s);
            JsonNode params = Http.get(Http.chat() + "/props").path("default_generation_settings").path("params");
            System.out.println();
            System.out.printf("After the sampler at temperature %s (top_k %d, top_p %.2f, min_p %.2f), the chances of being chosen:%n",
                    temp, params.path("top_k").asInt(), params.path("top_p").asDouble(), params.path("min_p").asDouble());
            i = 1;
            for (JsonNode c : rs.path("completion_probabilities").path(0).path("top_probs")) {
                double p = c.path("prob").asDouble();
                System.out.printf("  %d  %-16s %6.1f %%  %s%n", i++, quote(c.path("token").asText()), p * 100, bar(p));
            }
        }
    }

    static void generate(Lab.Args a) throws Exception {
        String text = a.text(0);
        int n = a.number("tokens", 8);
        ObjectNode req = Http.object().put("prompt", text).put("n_predict", n).put("n_probs", 3)
                .put("temperature", 0).put("cache_prompt", false);
        JsonNode r = Http.post(Http.chat() + "/completion", req);
        System.out.println("Text: " + quote(text));
        System.out.println("Each step adds the most probable token and asks again:");
        int step = 1;
        for (JsonNode c : r.path("completion_probabilities")) {
            StringBuilder alt = new StringBuilder();
            for (JsonNode o : c.path("top_logprobs")) {
                if (o.path("token").asText().equals(c.path("token").asText())) continue;
                alt.append("  ").append(quote(o.path("token").asText())).append(String.format(" %.1f %%", Math.exp(o.path("logprob").asDouble()) * 100));
            }
            System.out.printf("  %2d  %-14s %5.1f %%   alternatives:%s%n", step++, quote(c.path("token").asText()), Math.exp(c.path("logprob").asDouble()) * 100, alt);
        }
        System.out.println("Result: " + quote(text + r.path("content").asText()));
    }

    static void tokens(Lab.Args a) throws Exception {
        if (a.has("corpus")) {
            corpus();
            return;
        }
        String text = a.text(0);
        List<String> ps = pieces(text);
        System.out.println(ps.size() + " tokens for " + text.length() + " characters");
        StringBuilder line = new StringBuilder("  ");
        for (String p : ps) line.append(quote(p)).append(' ');
        System.out.println(line.toString().stripTrailing());
    }

    private static void corpus() throws Exception {
        long[] chars = new long[2], toks = new long[2];
        String[] langs = {"en", "es"};
        for (int i = 0; i < 2; i++) {
            try (Stream<Path> files = Files.list(CORPUS.resolve(langs[i]))) {
                for (Path f : files.sorted().toList()) {
                    String s = Files.readString(f);
                    int c = count(s);
                    chars[i] += s.length();
                    toks[i] += c;
                    System.out.printf("  %s/%-24s %6d characters %6d tokens%n", langs[i], f.getFileName(), s.length(), c);
                }
            }
        }
        System.out.printf("English: %d tokens for %d characters, %.2f characters per token%n", toks[0], chars[0], (double) chars[0] / toks[0]);
        System.out.printf("Spanish: %d tokens for %d characters, %.2f characters per token%n", toks[1], chars[1], (double) chars[1] / toks[1]);
        System.out.printf("The same content takes %.0f %% more tokens in Spanish.%n", (toks[1] - toks[0]) * 100.0 / toks[0]);
    }

    /** The same prefix continued several times: each run draws its tokens from the distribution. */
    static void sample(Lab.Args a) throws Exception {
        String text = a.text(0);
        int times = a.number("times", 5);
        double temp = a.decimal("temperature", 0.8);
        System.out.println("Text: " + quote(text) + ", temperature " + temp + (a.has("seed") ? ", seed " + a.get("seed", "") : ", no seed") + ":");
        for (int i = 1; i <= times; i++) {
            ObjectNode req = Http.object().put("prompt", text).put("n_predict", a.number("tokens", 6))
                    .put("temperature", temp).put("cache_prompt", false);
            if (a.has("seed")) req.put("seed", a.number("seed", 42));
            JsonNode r = Http.post(Http.chat() + "/completion", req);
            System.out.printf("  %d  %s%n", i, quote(text + r.path("content").asText()));
        }
    }
}
