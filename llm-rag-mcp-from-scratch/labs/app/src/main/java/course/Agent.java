package course;

import java.time.Duration;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.model.ChatResponse;
import org.springframework.ai.mcp.SyncMcpToolCallback;
import org.springframework.ai.tool.ToolCallback;
import org.springframework.stereotype.Component;

import io.modelcontextprotocol.client.McpClient;
import io.modelcontextprotocol.client.McpSyncClient;
import io.modelcontextprotocol.client.transport.HttpClientStreamableHttpTransport;
import io.modelcontextprotocol.spec.McpSchema;

/**
 * Lessons 23 and 24: an agent whose tools come from MCP servers. It connects to each server,
 * lists its tools with their annotations, offers the allowed ones to the model and runs what the
 * model asks for, through the same guard as the local tools.
 */
@Component
class Agent {

    /** The MCP servers of the kit, by the name --servers uses. */
    static final Map<String, String[]> SERVERS = new LinkedHashMap<>();

    static {
        SERVERS.put("cauce", new String[] {"http://mcp:8081", "mcp"});
        SERVERS.put("modern", new String[] {"http://mcp-modern:8080", "mcp-modern"});
        SERVERS.put("poisoned", new String[] {"http://mcp-poisoned:8080", "mcp-poisoned"});
    }

    private final ChatClient chat;
    private final Incidents incidents;

    Agent(ChatClient.Builder builder, Incidents incidents) {
        this.chat = builder.build();
        this.incidents = incidents;
    }

    void run(Args a) {
        String task = a.text(0);
        List<String> names = a.list("servers").isEmpty() ? List.of("cauce") : a.list("servers");
        List<String> allow = a.list("allow");
        boolean approve = a.has("approve");
        Guard.max = a.number("max-steps", 6);
        List<McpSyncClient> clients = new ArrayList<>();
        List<ToolCallback> tools = new ArrayList<>();
        long closedBefore = closed();
        tools.jackson.databind.node.ObjectNode ev = Events.object().put("task", task).put("approve", approve).put("maxSteps", Guard.max);
        Events.put("agent", ev);
        try {
            for (String name : names) {
                String[] server = SERVERS.get(name);
                if (server == null) throw new CourseError("Unknown server " + name + ". The servers are " + String.join(", ", SERVERS.keySet()) + ".");
                McpSyncClient client = connect(server);
                clients.add(client);
                McpSchema.InitializeResult init;
                try {
                    init = client.initialize();
                } catch (RuntimeException e) {
                    throw new CourseError("Cannot reach " + server[1] + " at " + server[0] + "/mcp (" + Out.firstLine(e) + "). Start it with docker compose up -d --wait " + server[1]);
                }
                System.out.println("Server " + init.serverInfo().name() + " " + init.serverInfo().version() + " (" + name + "), protocol " + init.protocolVersion());
                ev.withArray("servers").addObject().put("name", name).put("url", server[0] + "/mcp").put("serverName", init.serverInfo().name()).put("protocol", init.protocolVersion());
                for (McpSchema.Tool t : client.listTools().tools()) {
                    boolean readOnly = t.annotations() != null && Boolean.TRUE.equals(t.annotations().readOnlyHint());
                    boolean offered = allow.isEmpty() || allow.contains(t.name());
                    System.out.printf("  %-22s %-13s %s%n", t.name(), readOnly ? "read-only" : "changes data", offered ? "offered to the model" : "not offered (not in --allow)");
                    String d = t.description() == null ? "" : t.description();
                    ev.withArray("tools").addObject().put("server", name).put("name", t.name()).put("readOnly", readOnly).put("offered", offered).put("description", d);
                    System.out.println("    " + (a.has("verbose") ? d : Out.snippet(d, 110)));
                    if (offered) {
                        ToolCallback c = SyncMcpToolCallback.builder().mcpClient(client).tool(t).prefixedToolName(t.name()).build();
                        tools.add(new Guard(c, readOnly, approve));
                    }
                }
            }
            if (approve) System.out.println("With --approve, a tool that changes data runs only if you type yes.");
            System.out.println();
            System.out.println("Task: " + task);
            long t0 = System.nanoTime();
            ChatResponse r = chat.prompt().system(Basics.ASSISTANT).user(task).tools(tools.toArray()).call().chatResponse();
            ev.put("answer", Out.text(r));
            System.out.println("Answer:");
            System.out.println("  " + Out.text(r).replace("\n", "\n  "));
            System.out.println(Out.usage(r, t0));
            System.out.println("Tool calls: " + (Guard.CALLS.isEmpty() ? "none" : String.join(", ", Guard.CALLS)));
            long closedNow = closed() - closedBefore;
            if (closedNow > 0) System.out.println("Incidents closed in this run: " + closedNow + ". Undo with: docker compose run --rm app reset");
        } catch (CourseError e) {
            throw e;
        } catch (RuntimeException e) {
            if (!Guard.spent(e)) throw new CourseError(Out.firstLine(e));
            ev.put("stopped", true);
            System.out.println("Answer: none. The host stopped the run after " + Guard.max + " tool calls (--max-steps).");
            System.out.println("Tool calls: " + String.join(", ", Guard.CALLS));
            long closedNow = closed() - closedBefore;
            if (closedNow > 0) System.out.println("Incidents closed in this run: " + closedNow + ". Undo with: docker compose run --rm app reset");
        } finally {
            clients.forEach(McpSyncClient::closeGracefully);
        }
    }

    private static McpSyncClient connect(String[] server) {
        HttpClientStreamableHttpTransport transport = HttpClientStreamableHttpTransport.builder(server[0])
                .connectTimeout(Duration.ofSeconds(5)).build();
        return McpClient.sync(transport)
                .clientInfo(new McpSchema.Implementation("course-agent", "1.0.0"))
                .requestTimeout(Duration.ofSeconds(60))
                .initializationTimeout(Duration.ofSeconds(10))
                .build();
    }

    private long closed() {
        return incidents.all().stream().filter(i -> i.status().equals("closed")).count();
    }
}
