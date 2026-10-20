package course;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.Map;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.node.ObjectNode;

/** Plain HTTP with JSON bodies, to the servers of the kit. */
final class Http {
    static final ObjectMapper JSON = new ObjectMapper();
    static final ObjectMapper PRETTY = new ObjectMapper().enable(SerializationFeature.INDENT_OUTPUT);
    private static final HttpClient CLIENT = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(5)).build();

    static String chat() {
        return env("CHAT_URL", "http://chat:8080");
    }

    static String embed() {
        return env("EMBED_URL", "http://embed:8080");
    }

    static String env(String name, String fallback) {
        String v = System.getenv(name);
        return v == null || v.isBlank() ? fallback : v;
    }

    static ObjectNode object() {
        return JSON.createObjectNode();
    }

    static String pretty(JsonNode n) {
        try {
            return PRETTY.writeValueAsString(n);
        } catch (Exception e) {
            return String.valueOf(n);
        }
    }

    static JsonNode get(String url) throws Exception {
        HttpResponse<String> r = CLIENT.send(HttpRequest.newBuilder(URI.create(url)).timeout(Duration.ofSeconds(30)).GET().build(), HttpResponse.BodyHandlers.ofString());
        return check(url, r);
    }

    static JsonNode post(String url, JsonNode body) throws Exception {
        return post(url, body, Map.of());
    }

    static JsonNode post(String url, JsonNode body, Map<String, String> headers) throws Exception {
        return check(url, send(url, body, headers));
    }

    /** The raw response, for the commands that show status, headers or an error as the result. */
    static HttpResponse<String> send(String url, JsonNode body, Map<String, String> headers) throws Exception {
        HttpRequest.Builder b = HttpRequest.newBuilder(URI.create(url)).timeout(Duration.ofMinutes(10))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(JSON.writeValueAsString(body)));
        headers.forEach(b::header);
        try {
            return CLIENT.send(b.build(), HttpResponse.BodyHandlers.ofString());
        } catch (java.net.ConnectException e) {
            throw new LabError("Cannot reach " + URI.create(url).getHost() + ". Is it running? Start it with docker compose up -d --wait " + URI.create(url).getHost());
        }
    }

    private static JsonNode check(String url, HttpResponse<String> r) throws Exception {
        if (r.statusCode() / 100 != 2) {
            String msg = r.body();
            try {
                JsonNode n = JSON.readTree(msg);
                if (n.path("error").path("message").isTextual()) msg = n.path("error").path("message").asText();
            } catch (Exception ignored) {
                // Not JSON: keep the body as it came.
            }
            throw new LabError("HTTP " + r.statusCode() + " from " + URI.create(url).getHost() + ": " + msg);
        }
        return JSON.readTree(r.body());
    }
}
