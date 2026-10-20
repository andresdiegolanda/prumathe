package course;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

/**
 * MCP over Streamable HTTP with nothing in between: the JSON-RPC messages of the two revisions
 * the course compares, as they travel. legacy is 2025-11-25 (handshake, optional session);
 * modern is 2026-07-28 (no handshake, metadata and headers in every request).
 */
final class McpWire {
    private McpWire() {}

    static final String LEGACY = "2025-11-25";
    static final String MODERN = "2026-07-28";
    private static final HttpClient CLIENT = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(5)).build();
    private static int nextId = 1;
    /** With --origin, every POST carries this Origin header, as a web page would send it (lesson 24). */
    private static String origin;

    record Exchange(int status, String contentType, String session, List<JsonNode> messages) {}

    static void run(Lab.Args a) throws Exception {
        String era = a.text(0);
        String url = a.text(1);
        origin = a.has("origin") ? a.get("origin", "") : null;
        switch (era) {
            case "legacy" -> legacy(url, a);
            case "modern" -> modern(url, a);
            default -> throw new LabError("mcp-wire takes legacy or modern, then the URL of the server.");
        }
    }

    /** The request of the step: tools/list, or tools/call when --call names a tool. */
    static ObjectNode step(Lab.Args a) {
        ObjectNode params = Http.object();
        if (!a.has("call")) return message("tools/list", params);
        params.put("name", a.get("call", ""));
        ObjectNode args = params.putObject("arguments");
        if (a.has("arg")) {
            for (String pair : a.get("arg", "").split(",")) {
                int eq = pair.indexOf('=');
                if (eq < 1) throw new LabError("--arg takes key=value (several separated by commas).");
                args.put(pair.substring(0, eq).strip(), pair.substring(eq + 1).strip());
            }
        }
        return message("tools/call", params);
    }

    static ObjectNode message(String method, ObjectNode params) {
        ObjectNode m = Http.object().put("jsonrpc", "2.0").put("id", nextId++).put("method", method);
        m.set("params", params);
        return m;
    }

    private static void legacy(String url, Lab.Args a) throws Exception {
        System.out.println("Revision " + LEGACY + ": first the handshake, then the requests.\n");
        ObjectNode init = Http.object().put("protocolVersion", LEGACY);
        init.putObject("capabilities");
        init.putObject("clientInfo").put("name", "course-lab").put("version", "1.0.0");
        Exchange first = post(url, message("initialize", init), Map.of());
        if (first.status() >= 400) {
            System.out.println("The server refused initialize: the conversation stops here.");
            return;
        }
        String session = first.session();
        Map<String, String> h = new LinkedHashMap<>();
        h.put("MCP-Protocol-Version", LEGACY);
        if (session != null) h.put("Mcp-Session-Id", session);
        ObjectNode initialized = Http.object().put("jsonrpc", "2.0").put("method", "notifications/initialized");
        post(url, initialized, h);
        post(url, step(a), h);
        if (session != null) {
            System.out.println(">>> DELETE " + URI.create(url).getPath() + "   Mcp-Session-Id: " + session);
            HttpResponse<String> r = CLIENT.send(HttpRequest.newBuilder(URI.create(url)).timeout(Duration.ofSeconds(30))
                    .header("Mcp-Session-Id", session).header("MCP-Protocol-Version", LEGACY).DELETE().build(), HttpResponse.BodyHandlers.ofString());
            System.out.println("<<< " + r.statusCode() + "   the session is closed\n");
        } else {
            System.out.println("The server gave no Mcp-Session-Id: it serves this revision without sessions.");
        }
    }

    private static void modern(String url, Lab.Args a) throws Exception {
        String version = a.get("version", MODERN);
        System.out.println("Revision " + MODERN + ": no handshake; every request carries the version and who asks.\n");
        if (!a.has("call")) {
            Exchange d = post(url, modernMessage("server/discover", Http.object(), version), headers("server/discover", null, version));
            if (d.status() == 403) {
                System.out.println("The server refused the request: nothing else is sent.");
                return;
            }
        }
        ObjectNode s = step(a);
        ObjectNode m = modernMessage(s.path("method").asText(), (ObjectNode) s.path("params"), version);
        m.put("id", s.path("id").asInt());
        String name = s.path("params").path("name").asText(null);
        Map<String, String> h = headers(s.path("method").asText(), name, version);
        if (a.has("mismatch")) {
            h.put("Mcp-Method", s.path("method").asText().equals("tools/list") ? "tools/call" : "tools/list");
            System.out.println("With --mismatch the Mcp-Method header disagrees with the body, on purpose.\n");
        }
        post(url, m, h);
    }

    static ObjectNode modernMessage(String method, ObjectNode params, String version) {
        ObjectNode meta = params.putObject("_meta");
        meta.put("io.modelcontextprotocol/protocolVersion", version);
        meta.putObject("io.modelcontextprotocol/clientInfo").put("name", "course-lab").put("version", "1.0.0");
        meta.putObject("io.modelcontextprotocol/clientCapabilities");
        return message(method, params);
    }

    /** Long bodies (a stack trace in an error, for example) keep their first lines. */
    static String shorten(String text) {
        List<String> lines = text.lines().toList();
        if (lines.size() <= 60) return text;
        return String.join("\n", lines.subList(0, 40)) + "\n... (" + (lines.size() - 40) + " more lines)";
    }

    static Map<String, String> headers(String method, String name, String version) {
        Map<String, String> h = new LinkedHashMap<>();
        h.put("MCP-Protocol-Version", version);
        h.put("Mcp-Method", method);
        if (name != null) h.put("Mcp-Name", name);
        return h;
    }

    static Exchange post(String url, ObjectNode body, Map<String, String> headers) throws Exception {
        StringBuilder line = new StringBuilder(">>> POST " + URI.create(url).getPath());
        if (origin != null) line.append("   Origin: ").append(origin);
        headers.forEach((k, v) -> line.append("   ").append(k).append(": ").append(v));
        System.out.println(line);
        System.out.println(Http.pretty(body));
        HttpRequest.Builder b = HttpRequest.newBuilder(URI.create(url)).timeout(Duration.ofSeconds(60))
                .header("Content-Type", "application/json").header("Accept", "application/json, text/event-stream")
                .POST(HttpRequest.BodyPublishers.ofString(Http.JSON.writeValueAsString(body)));
        if (origin != null) b.header("Origin", origin);
        headers.forEach(b::header);
        HttpResponse<String> r;
        try {
            r = CLIENT.send(b.build(), HttpResponse.BodyHandlers.ofString());
        } catch (java.net.ConnectException e) {
            throw new LabError("Cannot reach " + URI.create(url).getHost() + ". Start it with docker compose up -d --wait " + URI.create(url).getHost());
        }
        String type = r.headers().firstValue("Content-Type").orElse("");
        String session = r.headers().firstValue("Mcp-Session-Id").orElse(null);
        List<JsonNode> messages = new ArrayList<>();
        String text = r.body() == null ? "" : r.body();
        if (type.startsWith("text/event-stream")) {
            for (String l : text.split("\n")) if (l.startsWith("data:")) messages.add(Http.JSON.readTree(l.substring(5).strip()));
        } else if (!text.isBlank()) {
            messages.add(Http.JSON.readTree(text));
        }
        StringBuilder head = new StringBuilder("<<< " + r.statusCode() + (type.isEmpty() ? "" : "   " + type.split(";")[0]));
        if (session != null) head.append("   Mcp-Session-Id: ").append(session);
        if (type.startsWith("text/event-stream")) head.append("   (").append(messages.size()).append(" event").append(messages.size() == 1 ? ")" : "s)");
        System.out.println(head);
        for (JsonNode m : messages) System.out.println(shorten(Http.pretty(m)));
        System.out.println();
        return new Exchange(r.statusCode(), type, session, messages);
    }
}
