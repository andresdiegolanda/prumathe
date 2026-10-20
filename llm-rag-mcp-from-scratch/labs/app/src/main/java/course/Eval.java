package course;

import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Component;

import tools.jackson.databind.json.JsonMapper;

/**
 * Lesson 18: measure instead of guess. Retrieval is checked against the chunks each question
 * needs; answers are checked for citations, for the facts they must contain and for saying
 * "I don't know" when the runbooks do not cover the question.
 */
@Component
@Lazy
class Eval {

    record Expected(String source, String text) {}

    record Question(String id, String question, List<Expected> expected, List<String> keywords) {}

    record Questions(String about, List<Question> questions) {}

    static final List<String> MODES = List.of("vector", "keyword", "hybrid", "hybrid+rerank");

    private final Retrieval retrieval;
    private final Rag rag;
    private final ChatClient chat;
    private final Path file;

    Eval(Retrieval retrieval, Rag rag, ChatClient.Builder builder, @Value("${course.eval}") Path eval) {
        this.retrieval = retrieval;
        this.rag = rag;
        this.chat = builder.build();
        this.file = eval.resolve("questions.json");
    }

    List<Question> questions() {
        return JsonMapper.builder().build().readValue(file.toFile(), Questions.class).questions();
    }

    /** Position (1-based) of the first right chunk, or 0 when none of the k is right. */
    static int rank(Question q, List<Retrieval.Hit> hits) {
        for (int i = 0; i < hits.size(); i++) {
            Retrieval.Hit h = hits.get(i);
            for (Expected e : q.expected()) {
                if (h.source().equals(e.source()) && h.content().toLowerCase(Locale.ROOT).contains(e.text().toLowerCase(Locale.ROOT))) return i + 1;
            }
        }
        return 0;
    }

    void run(Args a) {
        List<Question> qs = questions();
        int k = a.number("k", 5);
        List<Retrieval.Mode> modes = MODES.stream().map(m -> Retrieval.Mode.of(m, k)).toList();
        System.out.println("Retrieval, top " + k + ": the position of the first right chunk (- when none of the " + k + " is right).");
        StringBuilder head = new StringBuilder(String.format("  %-6s %-58s", "id", "question"));
        for (Retrieval.Mode m : modes) head.append(String.format("%15s", m.name()));
        System.out.println(head);
        int[] hits = new int[modes.size()];
        double[] mrr = new double[modes.size()];
        int answerable = 0;
        for (Question q : qs) {
            if (q.expected().isEmpty()) continue;
            answerable++;
            StringBuilder row = new StringBuilder(String.format("  %-6s %-58s", q.id(), Out.snippet(q.question(), 58)));
            for (int i = 0; i < modes.size(); i++) {
                int r = rank(q, retrieval.retrieve(q.question(), modes.get(i)));
                if (r > 0) {
                    hits[i]++;
                    mrr[i] += 1.0 / r;
                }
                row.append(String.format("%15s", r == 0 ? "-" : String.valueOf(r)));
            }
            System.out.println(row);
        }
        StringBuilder hitRow = new StringBuilder(String.format("  %-65s", "hit rate (a right chunk in the top " + k + ")"));
        StringBuilder mrrRow = new StringBuilder(String.format("  %-65s", "MRR (1 when it is always first)"));
        for (int i = 0; i < modes.size(); i++) {
            hitRow.append(String.format("%15s", hits[i] + "/" + answerable));
            mrrRow.append(String.format("%15.2f", mrr[i] / answerable));
        }
        System.out.println(hitRow);
        System.out.println(mrrRow);
        if (a.has("answers") || a.has("judge")) answers(a, qs);
    }

    /** Each question answered with hybrid search and the reranker, then checked. */
    private void answers(Args a, List<Question> qs) {
        Args settings = Args.parse(new String[] {"ask", "--hybrid", "--rerank", "--k", "4"});
        System.out.println();
        System.out.println("Answers with hybrid+rerank, k 4. cites: the answer cites a right chunk; facts: it has every expected fact; ok: both, or I don't know when it should.");
        int ok = 0, judgedYes = 0, agree = 0;
        for (Question q : qs) {
            Rag.Answer ans = rag.grounded(settings, q.question(), false);
            boolean declined = Rag.declined(ans.text());
            boolean pass;
            String detail;
            if (q.expected().isEmpty()) {
                pass = declined;
                detail = declined ? "said it does not know" : "answered something the runbooks do not say";
            } else {
                boolean cites = ans.cited().stream().anyMatch(n -> n >= 1 && n <= ans.sources().size() && rank(q, List.of(ans.sources().get(n - 1))) == 1);
                List<String> missing = new ArrayList<>();
                for (String group : q.keywords()) {
                    boolean found = false;
                    for (String alt : group.split("\\|")) if (ans.text().toLowerCase(Locale.ROOT).contains(alt.strip().toLowerCase(Locale.ROOT))) found = true;
                    if (!found) missing.add(group);
                }
                pass = cites && missing.isEmpty() && !declined;
                detail = (cites ? "cites" : "no right citation") + ", " + (missing.isEmpty() ? "facts" : "missing " + String.join(", ", missing));
            }
            if (pass) ok++;
            System.out.printf("  %-6s %-4s %s%n", q.id(), pass ? "ok" : "FAIL", detail);
            System.out.println("         " + Out.snippet(ans.text(), 150));
            if (a.has("judge")) {
                boolean yes = judge(q.question(), ans);
                if (yes) judgedYes++;
                if (yes == pass) agree++;
                System.out.println("         judge: " + (yes ? "supported" : "not supported") + (yes == pass ? "" : "   <- disagrees with the checks"));
            }
        }
        System.out.println("Answers ok: " + ok + "/" + qs.size());
        if (a.has("judge")) System.out.println("Judge: " + judgedYes + "/" + qs.size() + " judged supported; it agrees with the checks on " + agree + "/" + qs.size() + ".");
    }

    /** The same small model, asked to grade: cheap, and wrong in ways worth measuring. */
    private boolean judge(String question, Rag.Answer ans) {
        String prompt = "Sources:\n" + Rag.numbered(ans.sources().stream().map(Retrieval.Hit::document).toList())
                + "\n\nQuestion: " + question + "\nAnswer: " + ans.text()
                + "\n\nIs the answer fully supported by the sources, or a correct statement that the sources do not cover the question? Reply with one word: yes or no.";
        String verdict = chat.prompt().user(prompt).call().content();
        return verdict != null && verdict.strip().toLowerCase(Locale.ROOT).startsWith("yes");
    }
}
