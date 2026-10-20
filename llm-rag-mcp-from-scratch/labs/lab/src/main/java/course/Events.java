package course;

import java.io.ByteArrayOutputStream;
import java.io.OutputStream;
import java.io.PrintStream;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Map;
import java.util.Set;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

/**
 * The event of one command for the live viewer: the command line, every HTTP exchange with the
 * servers of the kit, a few results the viewer draws, and what the command printed. It is written
 * once, as one JSON file in the events volume, when the command ends; the viewer only reads that
 * folder. Keys and passwords never reach the file.
 */
final class Events {
    private Events() {}

    private static final Path DIR = Path.of(Http.env("EVENTS_DIR", "/events"));
    private static final Set<String> SECRET = Set.of("authorization", "proxy-authorization", "x-api-key", "api-key", "cookie", "set-cookie");
    private static final int MAX_BODY = 64 * 1024;
    private static final int MAX_OUTPUT = 32 * 1024;
    private static final int MAX_CALLS = 120;

    private static final ObjectNode EVENT = Http.JSON.createObjectNode();
    private static final ArrayNode CALLS = Http.JSON.createArrayNode();
    private static final ObjectNode DATA = Http.JSON.createObjectNode();
    private static final ByteArrayOutputStream OUT = new ByteArrayOutputStream();
    private static int skipped;
    private static boolean started;
    private static boolean written;

    /** Starts the event and copies what the command prints, as the terminal shows it. */
    static void start(String[] argv) {
        started = true;
        EVENT.put("v", 1).put("type", "command").put("source", "lab").put("start", System.currentTimeMillis());
        ArrayNode a = EVENT.putArray("argv");
        for (String w : argv) a.add(w);
        PrintStream terminal = System.out;
        System.setOut(new PrintStream(new OutputStream() {
            @Override
            public void write(int b) {
                terminal.write(b);
                if (OUT.size() < MAX_OUTPUT) OUT.write(b);
            }

            @Override
            public void write(byte[] b, int off, int len) {
                terminal.write(b, off, len);
                int room = MAX_OUTPUT - OUT.size();
                if (room > 0) OUT.write(b, off, Math.min(room, len));
            }

            @Override
            public void flush() {
                terminal.flush();
            }
        }, true, StandardCharsets.UTF_8));
    }

    /** One request and its response, as they went on the wire. */
    static synchronized void exchange(long at, String method, String url, Map<String, String> requestHeaders, String requestBody,
            int status, Map<String, List<String>> responseHeaders, String responseBody, List<String> stream) {
        if (!started) return;
        if (CALLS.size() >= MAX_CALLS) {
            skipped++;
            return;
        }
        ObjectNode c = CALLS.addObject().put("at", at).put("ms", System.currentTimeMillis() - at).put("method", method).put("url", url);
        ObjectNode rh = c.putObject("requestHeaders");
        requestHeaders.forEach((k, v) -> rh.put(k, SECRET.contains(k.toLowerCase()) ? "[not recorded]" : v));
        if (requestBody != null) c.put("requestBody", body(requestBody));
        c.put("status", status);
        ObjectNode sh = c.putObject("responseHeaders");
        if (responseHeaders != null) responseHeaders.forEach((k, v) -> {
            if (!k.startsWith(":")) sh.put(k, SECRET.contains(k.toLowerCase()) ? "[not recorded]" : String.join(", ", v));
        });
        if (responseBody != null) c.put("responseBody", body(responseBody));
        if (stream != null) {
            ArrayNode s = c.putArray("stream");
            for (String line : stream) if (s.size() < 400) s.add(line.length() > 2000 ? line.substring(0, 2000) : line);
        }
    }

    /** A result for the viewer to draw, under a name. */
    static synchronized void put(String name, JsonNode value) {
        DATA.set(name, value);
    }

    /** Writes the event; called once, when the command ends, with its exit code. */
    static synchronized void finish(int exit) {
        if (!started || written) return;
        written = true;
        System.out.flush();
        try {
            if (!Files.isDirectory(DIR) || !Files.isWritable(DIR)) return;
            long start = EVENT.path("start").asLong();
            EVENT.put("end", System.currentTimeMillis()).put("exit", exit);
            EVENT.put("output", OUT.toString(StandardCharsets.UTF_8));
            EVENT.set("calls", CALLS);
            if (skipped > 0) EVENT.put("callsNotRecorded", skipped);
            EVENT.set("data", DATA);
            String name = "lab-" + start + "-" + ProcessHandle.current().pid();
            Path tmp = DIR.resolve(name + ".tmp");
            Files.writeString(tmp, Http.JSON.writeValueAsString(EVENT), StandardCharsets.UTF_8);
            Files.move(tmp, DIR.resolve(name + ".json"), StandardCopyOption.ATOMIC_MOVE);
        } catch (Exception e) {
            // The viewer is optional: a command never fails because its event could not be written.
        }
    }

    /**
     * A body as text, cut at 64 KB. Long lists of numbers (embedding vectors) keep their first
     * eight numbers and their length, so a vector of 1024 numbers does not fill the file.
     */
    static String body(String text) {
        String t = text;
        try {
            JsonNode n = Http.JSON.readTree(text);
            if (n != null && (n.isObject() || n.isArray())) t = Http.JSON.writeValueAsString(shorten(n));
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
                ObjectNode o = Http.JSON.createObjectNode().put("vectorLength", n.size());
                ArrayNode first = o.putArray("first");
                for (int i = 0; i < 8; i++) first.add(n.get(i));
                return o;
            }
            ArrayNode a = Http.JSON.createArrayNode();
            for (JsonNode x : n) a.add(shorten(x));
            return a;
        }
        if (n.isObject()) {
            ObjectNode o = Http.JSON.createObjectNode();
            n.fields().forEachRemaining(e -> o.set(e.getKey(), shorten(e.getValue())));
            return o;
        }
        return n;
    }
}
