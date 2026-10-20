package course;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

import org.jspecify.annotations.Nullable;
import org.springframework.ai.chat.model.ToolContext;
import org.springframework.ai.tool.ToolCallback;
import org.springframework.ai.tool.definition.ToolDefinition;

/**
 * Wraps a tool so that each call is printed and, with --approve, a call that changes data waits
 * for a person to type yes (lessons 19, 23 and 24). The model only proposes the call; this code
 * decides whether it runs. A run has a budget of tool calls: when the model asks for one more,
 * the host stops the run instead of looping.
 */
final class Guard implements ToolCallback {

    /** Thrown when the model asks for a call beyond the budget; the command ends the run. */
    static final class BudgetSpent extends RuntimeException {
        BudgetSpent(int max) {
            super("The budget of " + max + " tool calls is spent.");
        }
    }

    /** Whether e, or what caused it, is the end of the budget. */
    static boolean spent(Throwable e) {
        for (Throwable t = e; t != null; t = t.getCause()) if (t instanceof BudgetSpent) return true;
        return false;
    }

    /** Every call of the run, in order, for the summary at the end. */
    static final List<String> CALLS = new ArrayList<>();

    /** The most tool calls of one run; --max-steps changes it. */
    static int max = 6;

    private static final BufferedReader IN = new BufferedReader(new InputStreamReader(System.in, StandardCharsets.UTF_8));

    private final ToolCallback delegate;
    private final boolean readOnly;
    private final boolean approve;

    Guard(ToolCallback delegate, boolean readOnly, boolean approve) {
        this.delegate = delegate;
        this.readOnly = readOnly;
        this.approve = approve;
    }

    @Override
    public ToolDefinition getToolDefinition() {
        return delegate.getToolDefinition();
    }

    @Override
    public String call(String input) {
        return call(input, null);
    }

    @Override
    public String call(String input, @Nullable ToolContext context) {
        long at = System.currentTimeMillis();
        String name = delegate.getToolDefinition().name();
        if (CALLS.size() >= max) {
            Events.add("toolCalls", Events.object().put("at", at).put("name", name).put("input", input).put("readOnly", readOnly).put("status", "stopped"));
            System.out.println("  [stopped] the model asked for " + name + ", but the budget of " + max + " tool calls is spent.");
            throw new BudgetSpent(max);
        }
        System.out.println("  [tool] " + name + " " + input + (readOnly ? "" : "   <- changes data"));
        if (approve && !readOnly) {
            System.out.print("  Allow this call? Type yes to run it: ");
            System.out.flush();
            String answer = readLine();
            if (!"yes".equalsIgnoreCase(answer == null ? "" : answer.strip())) {
                Events.add("toolCalls", Events.object().put("at", at).put("name", name).put("input", input).put("readOnly", readOnly).put("status", "denied"));
                System.out.println("  [denied] " + name + " did not run.");
                CALLS.add(name + " denied");
                return "{\"error\":\"The user did not allow this call. Do not try it again; tell the user what you wanted to do.\"}";
            }
        }
        String result = delegate.call(input, context);
        Events.add("toolCalls", Events.object().put("at", at).put("name", name).put("input", input).put("readOnly", readOnly).put("status", readOnly ? "read" : approve ? "approved" : "ran")
                .put("result", result.length() > 4000 ? result.substring(0, 4000) + "..." : result));
        System.out.println("  [result] " + Out.snippet(result, 160));
        CALLS.add(name + (readOnly ? "" : " ran"));
        return result;
    }

    private static String readLine() {
        try {
            String line = IN.readLine();
            if (line != null) System.out.println();
            return line;
        } catch (IOException e) {
            return null;
        }
    }
}
