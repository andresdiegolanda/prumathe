package course;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * The lab client of the course, without a framework: every command sends plain HTTP to the model
 * servers of the kit and prints what came back. Run it from labs as
 * {@code docker compose run --rm lab <command> ...}.
 */
public final class Lab {

    /** The words of a command line: positional texts and --options, with or without a value. */
    record Args(List<String> texts, Map<String, String> options) {
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

        double decimal(String name, double fallback) {
            return Double.parseDouble(get(name, String.valueOf(fallback)));
        }

        String text(int i) {
            if (i >= texts.size()) throw new LabError("Missing text argument. Run: docker compose run --rm lab help");
            return texts.get(i);
        }
    }

    /** Options that take no value. */
    private static final List<String> FLAGS = List.of("raw", "stream", "timings", "think", "remember", "forget", "schema", "guide", "corpus", "remote", "mismatch");

    static Args parse(String[] words) {
        List<String> texts = new ArrayList<>();
        Map<String, String> options = new HashMap<>();
        for (int i = 0; i < words.length; i++) {
            String w = words[i];
            if (w.startsWith("--")) {
                String name = w.substring(2);
                if (FLAGS.contains(name) || i + 1 == words.length) options.put(name, "");
                else options.put(name, words[++i]);
            } else {
                texts.add(w);
            }
        }
        return new Args(texts, options);
    }

    public static void main(String[] argv) {
        String command = argv.length == 0 ? "help" : argv[0];
        Args a = parse(java.util.Arrays.copyOfRange(argv, Math.min(1, argv.length), argv.length));
        try {
            switch (command) {
                case "hello" -> Basics.hello(a);
                case "props" -> Basics.props(a);
                case "next" -> Tokens.next(a);
                case "generate" -> Tokens.generate(a);
                case "tokens" -> Tokens.tokens(a);
                case "sample" -> Tokens.sample(a);
                case "chat" -> Chat.chat(a);
                case "template" -> Chat.template(a);
                case "context" -> Chat.context(a);
                case "extract" -> Chat.extract(a);
                case "tools" -> Chat.tools(a);
                case "embed" -> Vectors.embed(a);
                case "similar" -> Vectors.similar(a);
                case "mcp-wire" -> McpWire.run(a);
                case "help" -> help();
                default -> throw new LabError("Unknown command " + command + ". Run: docker compose run --rm lab help");
            }
        } catch (LabError e) {
            System.out.println("ERROR " + e.getMessage());
            System.exit(1);
        } catch (Exception e) {
            System.out.println("ERROR " + e);
            System.exit(1);
        }
    }

    static void help() {
        System.out.println("""
                Lab commands (from labs: docker compose run --rm lab <command>):
                  hello                        the model, its server and a first answer
                  props                        model, parameters, size and context of the chat server
                  next "<text>" [--top 5] [--temperature T]   probabilities of the next token
                  generate "<text>" [--tokens 8]              greedy generation, one token at a time
                  tokens "<text>" | --corpus   how a text is split into tokens
                  sample "<text>" --temperature T [--seed S] [--times 5] [--tokens 6]   the same text continued several times
                  chat "<text>" [--system "<text>"] [--remember] [--forget] [--raw] [--stream] [--timings] [--think] [--remote]
                  template "<text>" [--system "<text>"]       the prompt the chat template builds
                  context --tokens N           a prompt of about N tokens: speed, or the context limit
                  extract "<text>" [--schema]  JSON with and without a schema
                  tools "<question>" [--guide]                one tool call, round by round
                  embed "<text>"               an embedding vector
                  similar "<text>" "<text>" ...               cosine similarity between texts
                  mcp-wire legacy|modern <url> [--call <tool> --arg key=value] [--mismatch] [--version V] [--origin URL]
                                               MCP messages on the wire, revision 2025-11-25 or 2026-07-28
                """);
    }
}
