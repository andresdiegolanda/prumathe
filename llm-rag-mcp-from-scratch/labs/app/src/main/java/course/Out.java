package course;

import org.springframework.ai.chat.metadata.Usage;
import org.springframework.ai.chat.model.ChatResponse;

/** How the commands print: the answer, then what it cost. */
final class Out {
    private Out() {}

    static String text(ChatResponse r) {
        if (r == null || r.getResult() == null || r.getResult().getOutput().getText() == null) return "(no text)";
        return r.getResult().getOutput().getText().strip();
    }

    static String usage(ChatResponse r, long t0) {
        double s = (System.nanoTime() - t0) / 1e9;
        Usage u = r == null ? null : r.getMetadata().getUsage();
        if (u == null || u.getPromptTokens() == null) return String.format("(%.1f s)", s);
        return String.format("(prompt %d tokens, answer %d tokens, %.1f s)", u.getPromptTokens(), u.getCompletionTokens(), s);
    }

    /** One line, to show instead of a stack trace. */
    static String firstLine(Throwable e) {
        Throwable root = e;
        while (root.getCause() != null && root.getCause() != root) root = root.getCause();
        String m = root.getMessage() == null ? root.getClass().getSimpleName() : root.getMessage();
        String line = m.lines().findFirst().orElse(m);
        return line.length() > 300 ? line.substring(0, 300) + "..." : line;
    }

    static String snippet(String text, int max) {
        String one = text.replaceAll("\\s+", " ").strip();
        return one.length() > max ? one.substring(0, max - 3) + "..." : one;
    }
}
