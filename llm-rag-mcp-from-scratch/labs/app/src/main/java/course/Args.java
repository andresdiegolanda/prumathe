package course;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/** The words of a command line: positional texts and --options, with or without a value. */
record Args(String command, List<String> texts, Map<String, String> options) {

    /** Options that take no value. */
    private static final List<String> FLAGS = List.of("native", "validate", "no-context", "fixed", "extra", "keyword", "hybrid",
            "rerank", "trusted", "harden", "show-prompt", "tools", "answers", "judge", "approve", "verbose");

    static Args parse(String[] words) {
        List<String> texts = new ArrayList<>();
        Map<String, String> options = new HashMap<>();
        String command = null;
        for (int i = 0; i < words.length; i++) {
            String w = words[i];
            if (w.startsWith("--spring.")) continue;
            if (w.startsWith("--")) {
                String name = w.substring(2);
                if (FLAGS.contains(name) || i + 1 == words.length) options.put(name, "");
                else options.put(name, words[++i]);
            } else if (command == null) {
                command = w;
            } else {
                texts.add(w);
            }
        }
        return new Args(command == null ? "help" : command, texts, options);
    }

    boolean has(String name) {
        return options.containsKey(name);
    }

    String get(String name, String fallback) {
        String v = options.get(name);
        return v == null || v.isEmpty() ? fallback : v;
    }

    int number(String name, int fallback) {
        return Integer.parseInt(get(name, String.valueOf(fallback)));
    }

    List<String> list(String name) {
        return has(name) ? List.of(get(name, "").split(",")).stream().map(String::strip).filter(s -> !s.isEmpty()).toList() : List.of();
    }

    String text(int i) {
        if (i >= texts.size()) throw new CourseError("Missing text argument. Run: docker compose run --rm app help");
        return texts.get(i);
    }
}
