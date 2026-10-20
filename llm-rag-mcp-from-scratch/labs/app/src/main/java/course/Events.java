package course;

import java.io.ByteArrayOutputStream;
import java.io.OutputStream;
import java.io.PrintStream;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.nio.file.StandardOpenOption;
import java.util.List;
import java.util.Map;
import java.util.Set;

import tools.jackson.databind.JsonNode;
import tools.jackson.databind.json.JsonMapper;
import tools.jackson.databind.node.ArrayNode;
import tools.jackson.databind.node.ObjectNode;

/**
 * Events for the live viewer. A command of the app writes one JSON file when it ends: its command
 * line, every HTTP exchange with the model servers (through WireProxy), the retrieval, the tool
 * calls and what it printed. The MCP server appends one line per message it receives and sends.
 * The viewer only reads the events volume; keys and passwords never reach it.
 */
final class Events {
    private Events() {}

    static final JsonMapper JSON = JsonMapper.builder().build();
    private static final Path DIR = Path.of(env("EVENTS_DIR", "/events"));
    private static final Set<String> SECRET = Set.of("authorization", "proxy-authorization", "x-api-key", "api-key", "cookie", "set-cookie");
    private static final int MAX_BODY = 64 * 1024;
    private static final int MAX_OUTPUT = 32 * 1024;
    private static final int MAX_CALLS = 120;
    private static final int MAX_LIST = 60;

    private static final ObjectNode EVENT = JSON.createObjectNode();
    private static final ArrayNode CALLS = JSON.createArrayNode();
    private static final ObjectNode DATA = JSON.createObjectNode();
    private static final ByteArrayOutputStream OUT = new ByteArrayOutputStream();
    private static int skipped;
    private static boolean started;
    private static boolean written;
    private static int exit;
    private static Path serverLog;

    static String env(String name, String fallback) {
        String v = System.getenv(name);
        return v == null || v.isBlank() ? fallback : v;
    }

    static ObjectNode object() {
        return JSON.createObjectNode();
    }

    // ------------------------------------------------------------------------- one command

    /** Starts the event of a command and copies what it prints, as the terminal shows it. */
    static void start(String[] argv) {
        started = true;
        EVENT.put("v", 1).put("type", "command").put("source", "app").put("start", System.currentTimeMillis());
        ArrayNode a = EVENT.putArray("argv");
        for (String w : argv) a.add(w);
        PrintStream terminal = System.out;
        System.setOut(new PrintStream(new OutputStream() {
            @Override
            public void write(int b) {
                terminal.write(b);
                synchronized (OUT) {
                    if (OUT.size() < MAX_OUTPUT) OUT.write(b);
                }
            }

            @Override
            public void write(byte[] b, int off, int len) {
                terminal.write(b, off, len);
                synchronized (OUT) {
                    int room = MAX_OUTPUT - OUT.size();
                    if (room > 0) OUT.write(b, off, Math.min(room, len));
                }
            }

            @Override
            public void flush() {
                terminal.flush();
            }
        }, true, StandardCharsets.UTF_8));
        Runtime.getRuntime().addShutdownHook(new Thread(Events::finish));
    }

    /** The exit code the command ends with; the event is written when the process exits. */
    static void exit(int code) {
        exit = code;
    }

    /** One request and its response, as they went on the wire. */
    static synchronized void exchange(long at, String method, String url, Map<String, List<String>> requestHeaders, String requestBody,
            int status, Map<String, List<String>> responseHeaders, String responseBody) {
        if (!started) return;
        if (CALLS.size() >= MAX_CALLS) {
            skipped++;
            return;
        }
        ObjectNode c = CALLS.addObject().put("at", at).put("ms", System.currentTimeMillis() - at).put("method", method).put("url", url);
        c.set("requestHeaders", headers(requestHeaders));
        if (requestBody != null && !requestBody.isEmpty()) c.put("requestBody", body(requestBody));
        c.put("status", status);
        c.set("responseHeaders", headers(responseHeaders));
        if (responseBody != null && !responseBody.isEmpty()) c.put("responseBody", body(responseBody));
    }

    /** A result for the viewer to draw, under a name. */
    static synchronized void put(String name, JsonNode value) {
        if (started) DATA.set(name, value);
    }

    /** Adds to a list of results (retrievals, tool calls), up to 60 per command. */
    static synchronized void add(String name, JsonNode value) {
        if (!started) return;
        JsonNode list = DATA.get(name);
        ArrayNode a = list instanceof ArrayNode existing ? existing : DATA.putArray(name);
        if (a.size() < MAX_LIST) a.add(value);
        else DATA.put(name + "NotRecorded", DATA.path(name + "NotRecorded").asInt() + 1);
    }

    static synchronized void finish() {
        if (!started || written) return;
        written = true;
        System.out.flush();
        try {
            if (!Files.isDirectory(DIR) || !Files.isWritable(DIR)) return;
            long start = EVENT.path("start").asLong();
            EVENT.put("end", System.currentTimeMillis()).put("exit", exit);
            synchronized (OUT) {
                EVENT.put("output", OUT.toString(StandardCharsets.UTF_8));
            }
            EVENT.set("calls", CALLS);
            if (skipped > 0) EVENT.put("callsNotRecorded", skipped);
            EVENT.set("data", DATA);
            String name = "app-" + start + "-" + ProcessHandle.current().pid();
            Path tmp = DIR.resolve(name + ".tmp");
            Files.writeString(tmp, JSON.writeValueAsString(EVENT), StandardCharsets.UTF_8);
            Files.move(tmp, DIR.resolve(name + ".json"), StandardCopyOption.ATOMIC_MOVE);
        } catch (Exception e) {
            // The viewer is optional: a command never fails because its event could not be written.
        }
    }

    // ------------------------------------------------------------------------- the MCP server

    /** One message the MCP server received or sent, as a line of its log in the events volume. */
    static synchronized void serverLine(ObjectNode line) {
        try {
            if (!Files.isDirectory(DIR) || !Files.isWritable(DIR)) return;
            if (serverLog == null) serverLog = DIR.resolve("mcp-" + System.currentTimeMillis() + "-" + ProcessHandle.current().pid() + ".jsonl");
            line.put("v", 1).put("type", "rpc").put("source", "mcp");
            Files.writeString(serverLog, JSON.writeValueAsString(line) + "\n", StandardCharsets.UTF_8, StandardOpenOption.CREATE, StandardOpenOption.APPEND);
        } catch (Exception e) {
            // Same: the server answers whether or not the viewer can follow it.
        }
    }

    static ObjectNode headers(Map<String, List<String>> map) {
        ObjectNode h = JSON.createObjectNode();
        if (map != null) map.forEach((k, v) -> {
            if (k != null && !k.startsWith(":")) h.put(k, SECRET.contains(k.toLowerCase()) ? "[not recorded]" : String.join(", ", v));
        });
        return h;
    }

    /**
     * A body as text, cut at 64 KB. Long lists of numbers (embedding vectors) keep their first
     * eight numbers and their length, so a vector of 1024 numbers does not fill the file.
     */
    static String body(String text) {
        String t = text;
        try {
            JsonNode n = JSON.readTree(text);
            if (n != null && (n.isObject() || n.isArray())) t = JSON.writeValueAsString(shorten(n));
        } catch (Exception ignored) {
            // Not JSON: keep it as it came.
        }
        return t.length() > MAX_BODY ? t.substring(0, MAX_BODY) + "\n[... cut at 64 KB]" : t;
    }

    private static JsonNode shorten(JsonNode n) {
        if (n.isArray()) {
            boolean numbers = n.size() > 32;
            for (JsonNode x : n) if (!x.isNumber()) numbers = false;
            if (numbers) {
                ObjectNode o = JSON.createObjectNode().put("vectorLength", n.size());
                ArrayNode first = o.putArray("first");
                for (int i = 0; i < 8; i++) first.add(n.get(i));
                return o;
            }
            ArrayNode a = JSON.createArrayNode();
            for (JsonNode x : n) a.add(shorten(x));
            return a;
        }
        if (n.isObject()) {
            ObjectNode o = JSON.createObjectNode();
            for (Map.Entry<String, JsonNode> e : n.properties()) o.set(e.getKey(), shorten(e.getValue()));
            return o;
        }
        return n;
    }
}
