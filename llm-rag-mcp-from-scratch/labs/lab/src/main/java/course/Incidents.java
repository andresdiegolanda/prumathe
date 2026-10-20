package course;

import java.nio.file.Files;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

/** The tools the lab runs on behalf of the model: plain Java over the incidents file of Cauce. */
final class Incidents {
    private Incidents() {}

    static JsonNode all() throws Exception {
        return Http.JSON.readTree(Files.readString(Tokens.CORPUS.resolve("incidents.json")));
    }

    static String run(String name, JsonNode args) throws Exception {
        return switch (name) {
            case "get_incident_status" -> status(args.path("id").asText(""));
            case "list_open_incidents" -> open();
            default -> "{\"error\":\"unknown tool " + name + "\"}";
        };
    }

    private static String status(String id) throws Exception {
        for (JsonNode i : all()) {
            if (i.path("id").asText().equalsIgnoreCase(id.strip())) {
                ObjectNode out = Http.object().put("id", i.path("id").asText()).put("status", i.path("status").asText())
                        .put("owner", i.path("owner").asText()).put("updated", i.path("updated").asText());
                return Http.JSON.writeValueAsString(out);
            }
        }
        return "{\"error\":\"no incident " + id.replace("\"", "") + "\"}";
    }

    private static String open() throws Exception {
        ArrayNode list = Http.JSON.createArrayNode();
        for (JsonNode i : all()) {
            String s = i.path("status").asText();
            if (s.equals("open") || s.equals("mitigated")) {
                list.addObject().put("id", i.path("id").asText()).put("code", i.path("code").asText())
                        .put("severity", i.path("severity").asText()).put("status", s);
            }
        }
        ObjectNode out = Http.object();
        out.set("incidents", list);
        return Http.JSON.writeValueAsString(out);
    }
}
