package course;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.json.JsonMapper;

/**
 * The incidents of Cauce: read from the course corpus, plus the closures made during the labs,
 * kept apart in the state volume so that {@code reset} can undo them.
 */
@Component
class Incidents {

    record Incident(String id, String title, String code, String severity, String status, String owner,
            String opened, String updated, String note) {}

    record Status(String id, String status, String owner, String updated) {}

    record Summary(String id, String code, String severity, String status) {}

    private final JsonMapper json = JsonMapper.builder().build();
    private final Path file;
    private final Path closures;

    Incidents(@Value("${course.corpus}") Path corpus, @Value("${course.state}") Path state) {
        this.file = corpus.resolve("incidents.json");
        this.closures = state.resolve("closed.json");
    }

    List<Incident> all() {
        List<Incident> base = json.readValue(file.toFile(), new TypeReference<List<Incident>>() {});
        Map<String, String> closed = closed();
        return base.stream().map(i -> closed.containsKey(i.id())
                ? new Incident(i.id(), i.title(), i.code(), i.severity(), "closed", i.owner(), i.opened(), closed.get(i.id()), i.note())
                : i).toList();
    }

    Status status(String id) {
        return all().stream().filter(i -> i.id().equalsIgnoreCase(id.strip()))
                .map(i -> new Status(i.id(), i.status(), i.owner(), i.updated()))
                .findFirst().orElseThrow(() -> new CourseError("No incident " + id + "."));
    }

    List<Summary> open() {
        return all().stream().filter(i -> i.status().equals("open") || i.status().equals("mitigated"))
                .map(i -> new Summary(i.id(), i.code(), i.severity(), i.status())).toList();
    }

    /** Closes an incident in the state volume; the corpus file is never written. */
    String close(String id) {
        Status s = status(id);
        if (s.status().equals("closed")) return s.id() + " was already closed.";
        Map<String, String> closed = new LinkedHashMap<>(closed());
        closed.put(s.id(), Instant.now().truncatedTo(ChronoUnit.SECONDS).toString());
        try {
            Files.writeString(closures, json.writeValueAsString(closed));
        } catch (IOException e) {
            throw new CourseError("Cannot write " + closures + ": " + e.getMessage());
        }
        return s.id() + " is now closed.";
    }

    /** Reopens what the labs closed. */
    int reset() throws IOException {
        int n = closed().size();
        Files.deleteIfExists(closures);
        return n;
    }

    private Map<String, String> closed() {
        if (!Files.exists(closures)) return Map.of();
        return json.readValue(closures.toFile(), new TypeReference<Map<String, String>>() {});
    }
}
