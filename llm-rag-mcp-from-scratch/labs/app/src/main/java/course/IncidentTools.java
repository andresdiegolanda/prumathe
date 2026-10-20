package course;

import java.util.ArrayList;
import java.util.List;

import org.springframework.ai.support.ToolCallbacks;
import org.springframework.ai.tool.ToolCallback;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.ai.tool.annotation.ToolParam;

/**
 * Java methods the model may ask to run (lesson 12). Spring AI turns each @Tool into a tool
 * definition for the request, runs the method when the model asks for it, and sends the result
 * back to the model.
 */
class IncidentTools {

    private final Incidents incidents;

    IncidentTools(Incidents incidents) {
        this.incidents = incidents;
    }

    @Tool(name = "get_incident_status", description = "Returns the current status of an incident of the Cauce platform, by its id (for example INC-2041).")
    Incidents.Status getIncidentStatus(@ToolParam(description = "Incident id, like INC-2041") String id) {
        return incidents.status(id);
    }

    @Tool(name = "list_open_incidents", description = "Lists the incidents of the Cauce platform that are not resolved or closed.")
    List<Incidents.Summary> listOpenIncidents() {
        return incidents.open();
    }

    /** The one tool that changes something. Offered only with --tools (lesson 19). */
    static class Close {
        private final Incidents incidents;

        Close(Incidents incidents) {
            this.incidents = incidents;
        }

        @Tool(name = "close_incident", description = "Closes an incident of the Cauce platform, by its id.")
        String closeIncident(@ToolParam(description = "Incident id, like INC-2041") String id) {
            return incidents.close(id);
        }
    }

    /** The read-only tools, and close_incident when asked, each one printed and guarded. */
    static ToolCallback[] callbacks(Incidents incidents, boolean withClose, boolean approve) {
        List<ToolCallback> out = new ArrayList<>();
        for (ToolCallback c : ToolCallbacks.from(new IncidentTools(incidents))) out.add(new Guard(c, true, approve));
        if (withClose) {
            for (ToolCallback c : ToolCallbacks.from(new Close(incidents))) out.add(new Guard(c, false, approve));
        }
        return out.toArray(ToolCallback[]::new);
    }
}
