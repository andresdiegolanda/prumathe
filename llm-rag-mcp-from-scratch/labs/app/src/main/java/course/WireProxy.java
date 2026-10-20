package course;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.InetAddress;
import java.net.InetSocketAddress;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.Executors;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;

/**
 * For the live viewer: the app does not call the model servers directly. A command starts this
 * proxy on 127.0.0.1, inside its own container, and points CHAT_URL, EMBED_URL and RERANK_URL at
 * it; every request Spring AI and the app build goes through it unchanged, and it records the
 * request and the response as they went on the wire. The MCP server profiles do not use it.
 */
final class WireProxy {
    private WireProxy() {}

    /** Headers the client of this JDK sets itself, or that only mean something on one hop. */
    private static final Set<String> HOP = Set.of("host", "connection", "content-length", "transfer-encoding", "keep-alive", "upgrade",
            "expect", "te", "trailer", "proxy-connection", "http2-settings", "accept-encoding");

    private static final HttpClient CLIENT = HttpClient.newBuilder().version(HttpClient.Version.HTTP_1_1)
            .connectTimeout(Duration.ofSeconds(5)).build();

    /** Starts the proxy and returns its port; each route forwards to the address the kit gives it. */
    static void start() throws IOException {
        Map<String, String> routes = new LinkedHashMap<>();
        routes.put("chat", Events.env("CHAT_URL", "http://chat:8080/v1"));
        routes.put("embed", Events.env("EMBED_URL", "http://embed:8080/v1"));
        routes.put("rerank", Events.env("RERANK_URL", "http://rerank:8080"));
        HttpServer server = HttpServer.create(new InetSocketAddress(InetAddress.getLoopbackAddress(), 0), 0);
        server.setExecutor(Executors.newCachedThreadPool(r -> {
            Thread t = new Thread(r, "wire-proxy");
            t.setDaemon(true);
            return t;
        }));
        for (Map.Entry<String, String> route : routes.entrySet()) {
            String target = route.getValue().replaceAll("/+$", "");
            server.createContext("/" + route.getKey(), ex -> forward(ex, "/" + route.getKey(), target));
        }
        server.start();
        String base = "http://127.0.0.1:" + server.getAddress().getPort();
        routes.keySet().forEach(name -> System.setProperty(name.toUpperCase() + "_URL", base + "/" + name));
    }

    private static void forward(HttpExchange ex, String prefix, String target) throws IOException {
        long at = System.currentTimeMillis();
        String path = ex.getRequestURI().getRawPath().substring(prefix.length());
        String query = ex.getRequestURI().getRawQuery();
        String url = target + path + (query == null ? "" : "?" + query);
        byte[] in;
        try (InputStream body = ex.getRequestBody()) {
            in = body.readAllBytes();
        }
        Map<String, List<String>> sent = new LinkedHashMap<>();
        HttpRequest.Builder b = HttpRequest.newBuilder(URI.create(url)).timeout(Duration.ofMinutes(15))
                .method(ex.getRequestMethod(), in.length == 0 ? HttpRequest.BodyPublishers.noBody() : HttpRequest.BodyPublishers.ofByteArray(in));
        ex.getRequestHeaders().forEach((k, v) -> {
            if (HOP.contains(k.toLowerCase())) return;
            sent.put(k, v);
            v.forEach(value -> b.header(k, value));
        });
        String requestText = new String(in, java.nio.charset.StandardCharsets.UTF_8);
        HttpResponse<byte[]> r;
        try {
            r = CLIENT.send(b.build(), HttpResponse.BodyHandlers.ofByteArray());
        } catch (IOException e) {
            // The same advice the app gives when it cannot reach a server, as the body of the error.
            String host = URI.create(target).getHost();
            String message = "Cannot reach " + host + ". Start it with docker compose up -d --wait " + host;
            byte[] error = ("{\"error\":{\"message\":\"" + message + "\",\"type\":\"unavailable\"}}").getBytes(java.nio.charset.StandardCharsets.UTF_8);
            Events.exchange(at, ex.getRequestMethod(), url, sent, requestText, 502, Map.of(), message);
            ex.getResponseHeaders().add("Content-Type", "application/json");
            ex.sendResponseHeaders(502, error.length);
            try (OutputStream os = ex.getResponseBody()) {
                os.write(error);
            }
            ex.close();
            return;
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            ex.sendResponseHeaders(502, -1);
            ex.close();
            return;
        }
        byte[] out = r.body();
        r.headers().map().forEach((k, v) -> {
            if (!HOP.contains(k.toLowerCase()) && !k.startsWith(":")) v.forEach(value -> ex.getResponseHeaders().add(k, value));
        });
        Events.exchange(at, ex.getRequestMethod(), url, sent, requestText, r.statusCode(), r.headers().map(),
                new String(out, java.nio.charset.StandardCharsets.UTF_8));
        ex.sendResponseHeaders(r.statusCode(), out.length == 0 ? -1 : out.length);
        if (out.length > 0) {
            try (OutputStream os = ex.getResponseBody()) {
                os.write(out);
            }
        }
        ex.close();
    }
}
