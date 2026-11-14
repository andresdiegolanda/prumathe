package rumbo;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.web.bind.annotation.*;

/** The API of Rumbo: shipments, the movements the carriers report, and a public tracking page. */
@RestController
public class ShipmentsController {
    private static final Set<String> STATUSES = Set.of("in transit", "at the depot", "out for delivery", "delivered", "returned");
    private final JdbcClient db;
    private final java.nio.file.Path caCertificate;

    ShipmentsController(JdbcClient db, @org.springframework.beans.factory.annotation.Value("${rumbo.tls.keystore}") String keystore) {
        this.db = db;
        this.caCertificate = java.nio.file.Path.of(keystore).resolveSibling("ca.pem");
    }

    @GetMapping("/status")
    Map<String, Object> status() {
        return Json.of("service", "rumbo-origin", "shipments", db.sql("SELECT count(*) FROM shipments").query(Integer.class).single());
    }

    @GetMapping("/api/shipments/{id}")
    ResponseEntity<Map<String, Object>> shipment(@PathVariable String id) {
        return db.sql("SELECT id, destination, status, updated FROM shipments WHERE id = ?").param(id)
                .query((rs, n) -> {
                    Map<String, Object> m = new LinkedHashMap<>();
                    m.put("id", rs.getString("id"));
                    m.put("destination", rs.getString("destination"));
                    m.put("status", rs.getString("status"));
                    m.put("updated", rs.getObject("updated", java.time.OffsetDateTime.class).toString());
                    m.put("servedBy", "rumbo-origin");
                    return m;
                })
                .optional()
                .map(m -> ResponseEntity.ok().cacheControl(CacheControl.noStore()).body(m))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body(Json.of("error", "unknown shipment", "id", id)));
    }

    /** Saves a movement once: the event id is the primary key, so a repeated delivery changes nothing. */
    @PostMapping("/api/movements")
    ResponseEntity<Map<String, Object>> movement(@RequestBody Map<String, String> body) {
        String event = body.get("event"), shipment = body.get("shipment"), status = body.get("status");
        if (event == null || shipment == null || status == null) return ResponseEntity.badRequest().body(Json.of("error", "event, shipment and status are required"));
        if (!STATUSES.contains(status)) return ResponseEntity.unprocessableContent().body(Json.of("error", "unknown status", "status", status));
        int inserted = db.sql("INSERT INTO movements (event_id, shipment_id, status) VALUES (?, ?, ?) ON CONFLICT (event_id) DO NOTHING")
                .params(event, shipment, status).update();
        if (inserted == 1) db.sql("UPDATE shipments SET status = ?, updated = now() WHERE id = ?").params(status, shipment).update();
        return ResponseEntity.ok(Json.of("event", event, "saved", inserted == 1));
    }

    @GetMapping("/api/movements/{shipment}")
    Map<String, Object> movements(@PathVariable String shipment) {
        List<Map<String, Object>> rows = db.sql("SELECT event_id, status FROM movements WHERE shipment_id = ? ORDER BY received").param(shipment)
                .query((rs, n) -> Json.of("event", rs.getString("event_id"), "status", rs.getString("status"))).list();
        return Json.of("shipment", shipment, "movements", rows, "count", rows.size());
    }

    /** The public tracking page: the same for everyone, so it may be kept by a shared cache. */
    @GetMapping(value = "/track/{id}", produces = MediaType.TEXT_HTML_VALUE)
    ResponseEntity<String> track(@PathVariable String id) {
        String status = db.sql("SELECT status FROM shipments WHERE id = ?").param(id).query(String.class).optional().orElse("unknown");
        String html = "<!doctype html><html lang=\"en\"><meta charset=\"utf-8\"><title>Rumbo " + id + "</title><h1>Shipment " + id + "</h1><p>Status: " + status + "</p></html>\n";
        return ResponseEntity.ok().cacheControl(CacheControl.maxAge(java.time.Duration.ofSeconds(60)).cachePublic()).body(html);
    }

    /** What reached the origin. Addresses of clients are reported as present, never printed. */
    @GetMapping("/echo")
    Map<String, Object> echo(@RequestHeader org.springframework.http.HttpHeaders headers) {
        Map<String, Object> seen = new LinkedHashMap<>();
        for (String name : List.of("host", "x-rumbo-edge", "x-rumbo-request-id", "cf-ray", "cf-visitor", "x-forwarded-proto", "cf-connecting-ip", "x-forwarded-for")) {
            String value = headers.getFirst(name);
            if (value == null) continue;
            seen.put(name, name.endsWith("-ip") || name.equals("x-forwarded-for") ? "present (an address, not printed)" : value);
        }
        return Json.of("origin", "rumbo-origin", "headers", seen);
    }

    @GetMapping(value = "/ca.pem", produces = MediaType.TEXT_PLAIN_VALUE)
    String ca() throws java.io.IOException {
        return java.nio.file.Files.readString(caCertificate);
    }
}
