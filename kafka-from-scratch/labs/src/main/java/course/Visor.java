package course;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.Executors;

/**
 * The live viewer: a small web page at http://localhost:18090 that shows topics, partitions,
 * replicas, records and consumer groups of the course cluster while the lessons run.
 *
 * <p>It reads the cluster every half second through {@link ClusterWatch} and serves the result as
 * JSON at /api/state; the page asks for it and redraws only when something changed. It never
 * writes to the cluster. Run it with: docker compose up -d visor
 */
final class Visor {
  private static final long EVERY_MS = 500;
  private static final Map<String, String> TYPES =
      Map.of(
          "index.html", "text/html; charset=utf-8",
          "visor.css", "text/css; charset=utf-8",
          "visor.js", "text/javascript; charset=utf-8",
          "favicon.svg", "image/svg+xml");
  private static final String CSP =
      "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self'; connect-src 'self';"
          + " object-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'none'";

  private static volatile String state = "{\"version\":0,\"ok\":false,\"error\":\"Starting\",\"readAt\":0}";
  private static volatile long version;
  private static volatile String head = "";

  private Visor() {}

  static void run() throws Exception {
    int port = Integer.parseInt(System.getenv().getOrDefault("VISOR_PORT", "18090"));
    ClusterWatch watch = new ClusterWatch(Kafka.BOOT);
    HttpServer server = HttpServer.create(new InetSocketAddress(port), 0);
    server.createContext("/", Visor::handle);
    server.setExecutor(Executors.newFixedThreadPool(4));
    server.start();
    CountDownLatch stop = new CountDownLatch(1);
    Thread loop = new Thread(() -> poll(watch, stop), "visor-poll");
    loop.setDaemon(true);
    loop.start();
    Runtime.getRuntime()
        .addShutdownHook(
            new Thread(
                () -> {
                  stop.countDown();
                  server.stop(0);
                  watch.close();
                }));
    System.out.println("VISOR http://localhost:" + port + "  (Ctrl+C or docker compose stop visor)");
    stop.await();
  }

  private static void poll(ClusterWatch watch, CountDownLatch stop) {
    String last = null;
    while (stop.getCount() > 0) {
      long started = System.currentTimeMillis();
      try {
        String json = watch.read(0);
        // The reading time changes every cycle; the version changes only with the content.
        String content = json.replaceFirst("\"readAt\":\\d+", "");
        if (!content.equals(last)) {
          last = content;
          version++;
        }
        state = json.replaceFirst("^\\{\"version\":0", "{\"version\":" + version);
        head = json.replaceFirst("^\\{\"version\":0,(\"ok\":[a-z]+,\"error\":(null|\"[^\"]*\"),\"readAt\":\\d+).*$", "{\"version\":" + version + ",\"same\":true,$1}");
      } catch (RuntimeException e) {
        System.err.println("VISOR: " + e);
      }
      long wait = EVERY_MS - (System.currentTimeMillis() - started);
      if (wait > 0) {
        try {
          Thread.sleep(wait);
        } catch (InterruptedException e) {
          return;
        }
      }
    }
  }

  private static void handle(HttpExchange x) throws IOException {
    try (x) {
      var h = x.getResponseHeaders();
      h.set("X-Content-Type-Options", "nosniff");
      h.set("Referrer-Policy", "no-referrer");
      h.set("Content-Security-Policy", CSP);
      h.set("Cache-Control", "no-store");
      String method = x.getRequestMethod();
      if (!method.equals("GET") && !method.equals("HEAD")) {
        send(x, 405, "text/plain; charset=utf-8", "Read only / Solo lectura".getBytes(StandardCharsets.UTF_8));
        return;
      }
      URI uri = x.getRequestURI();
      String path = uri.getPath();
      if (path.equals("/api/state")) {
        String query = uri.getRawQuery() == null ? "" : uri.getRawQuery();
        String asked = query.startsWith("v=") ? query.substring(2) : "";
        String body = asked.equals(String.valueOf(version)) ? head : state;
        send(x, 200, "application/json; charset=utf-8", body.getBytes(StandardCharsets.UTF_8));
        return;
      }
      String name = path.equals("/") ? "index.html" : path.substring(1);
      String type = TYPES.get(name);
      if (type == null) {
        send(x, 404, "text/plain; charset=utf-8", "Not found / No encontrado".getBytes(StandardCharsets.UTF_8));
        return;
      }
      try (InputStream in = Visor.class.getResourceAsStream("/visor/" + name)) {
        if (in == null) {
          send(x, 404, "text/plain; charset=utf-8", "Not found / No encontrado".getBytes(StandardCharsets.UTF_8));
          return;
        }
        send(x, 200, type, in.readAllBytes());
      }
    }
  }

  private static void send(HttpExchange x, int status, String type, byte[] body) throws IOException {
    x.getResponseHeaders().set("Content-Type", type);
    boolean head = x.getRequestMethod().equals("HEAD");
    x.sendResponseHeaders(status, head ? -1 : body.length);
    if (!head) {
      try (OutputStream out = x.getResponseBody()) {
        out.write(body);
      }
    }
  }
}
