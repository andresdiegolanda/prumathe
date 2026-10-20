package course;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.stream.Stream;

import org.springframework.ai.mcp.annotation.McpArg;
import org.springframework.ai.mcp.annotation.McpPrompt;
import org.springframework.ai.mcp.annotation.McpResource;
import org.springframework.ai.mcp.annotation.McpTool;
import org.springframework.ai.mcp.annotation.McpToolParam;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import io.modelcontextprotocol.spec.McpSchema;

/**
 * Lesson 22: the MCP server of the course. The same incidents as the local tools of lesson 12,
 * published with Spring AI's MCP annotations: four tools with their annotations, the runbooks as
 * resources and one prompt. Active only with the mcp profile.
 */
@Component
@Profile("mcp")
class McpTools {

    /** A list wrapped in an object, so the tool can declare an output schema. */
    record OpenIncidents(List<Incidents.Summary> incidents) {}

    record Passage(String source, String section, String text) {}

    record Passages(List<Passage> passages) {}

    private final Incidents incidents;
    private final ObjectProvider<Retrieval> retrieval;
    private final Path runbooks;

    McpTools(Incidents incidents, ObjectProvider<Retrieval> retrieval, @Value("${course.corpus}") Path corpus) {
        this.incidents = incidents;
        this.retrieval = retrieval;
        this.runbooks = corpus.resolve("en");
    }

    /**
     * Lesson 25: retrieval behind a tool. The best configuration of lesson 18 (hybrid search and
     * the reranker) over the runbooks only. It needs db, embed and rerank; the other tools do not.
     */
    @McpTool(name = "search_runbooks", title = "Search the runbooks",
            description = "Searches the runbooks of the Cauce platform and returns the four passages that best answer the query. Cite the source and section of each passage you use.",
            annotations = @McpTool.McpAnnotations(readOnlyHint = true, destructiveHint = false, idempotentHint = true, openWorldHint = false),
            generateOutputSchema = true)
    Passages searchRunbooks(@McpToolParam(description = "A question or an error code, like CAU-4021", required = true) String query) {
        List<Passage> out = retrieval.getObject().retrieve(query, new Retrieval.Mode(false, true, true, true, 4)).stream()
                .map(h -> new Passage(h.source(), h.section(), h.content())).toList();
        return new Passages(out);
    }

    @McpTool(name = "get_incident_status", title = "Incident status",
            description = "Returns the current status of an incident of the Cauce platform, by its id (for example INC-2041).",
            annotations = @McpTool.McpAnnotations(readOnlyHint = true, destructiveHint = false, idempotentHint = true, openWorldHint = false),
            generateOutputSchema = true)
    Incidents.Status getIncidentStatus(@McpToolParam(description = "Incident id, like INC-2041", required = true) String id) {
        return incidents.status(id);
    }

    @McpTool(name = "list_open_incidents", title = "Open incidents",
            description = "Lists the incidents of the Cauce platform that are not resolved or closed.",
            annotations = @McpTool.McpAnnotations(readOnlyHint = true, destructiveHint = false, idempotentHint = true, openWorldHint = false),
            generateOutputSchema = true)
    OpenIncidents listOpenIncidents() {
        return new OpenIncidents(incidents.open());
    }

    @McpTool(name = "close_incident", title = "Close incident",
            description = "Closes an incident of the Cauce platform, by its id. Only the owner closes an incident, after the review.",
            annotations = @McpTool.McpAnnotations(readOnlyHint = false, destructiveHint = true, idempotentHint = true, openWorldHint = false))
    String closeIncident(@McpToolParam(description = "Incident id, like INC-2041", required = true) String id) {
        return incidents.close(id);
    }

    @McpResource(uri = "cauce://runbooks", name = "runbooks", title = "Runbook index",
            description = "The names of the runbooks of Cauce; read one with cauce://runbooks/{name}.", mimeType = "text/plain")
    String index() throws IOException {
        try (Stream<Path> s = Files.list(runbooks)) {
            return String.join("\n", s.map(p -> p.getFileName().toString().replace(".md", "")).sorted().toList());
        }
    }

    @McpResource(uri = "cauce://runbooks/{name}", name = "runbook", title = "Runbook",
            description = "A runbook of Cauce in English, by name: errors-4xxx, retry-policy, on-call and the others in cauce://runbooks.",
            mimeType = "text/markdown")
    String runbook(String name) throws IOException {
        Path file = runbooks.resolve(name + ".md").normalize();
        if (!file.startsWith(runbooks) || !Files.exists(file)) throw new IllegalArgumentException("No runbook " + name);
        return Files.readString(file, StandardCharsets.UTF_8);
    }

    /** A prompt is a message for the person to send, so its role is user; a plain String would become an assistant message. */
    @McpPrompt(name = "triage", title = "Triage an error code",
            description = "A request to triage a Cauce error code: what it means, what to do and whether to retry.")
    McpSchema.GetPromptResult triage(@McpArg(name = "code", description = "Error code, like CAU-4021", required = true) String code) {
        String text = "Triage the Cauce error " + code + ". Read its runbook section, then say in three short lines what it means, "
                + "what the on-call engineer should do and whether Cauce retries it. Do not close or change any incident.";
        return new McpSchema.GetPromptResult("Triage " + code,
                List.of(new McpSchema.PromptMessage(McpSchema.Role.USER, new McpSchema.TextContent(text))));
    }
}
