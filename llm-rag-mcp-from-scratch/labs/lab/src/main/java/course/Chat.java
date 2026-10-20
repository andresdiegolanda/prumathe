package course;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Stream;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

/** The chat API of the OpenAI format, as llama.cpp serves it: messages, streaming, JSON and tools. */
final class Chat {
    private Chat() {}

    static final String MODEL = Http.env("CHAT_MODEL", "granite-4.2-3b");
    static final Path HISTORY = Path.of("/state/history.json");

    /** Where a chat request goes: the course server, or the hosted provider of the optional .env file. */
    record Endpoint(String url, String model, Map<String, String> headers, boolean remote) {}

    static Endpoint endpoint(Lab.Args a) {
        if (!a.has("remote")) return new Endpoint(Http.chat() + "/v1/chat/completions", MODEL, Map.of(), false);
        String base = Http.env("LLM_BASE_URL", "");
        String key = Http.env("LLM_API_KEY", "");
        String model = Http.env("LLM_MODEL", "");
        if (base.isEmpty() || model.isEmpty()) {
            throw new LabError("--remote needs LLM_BASE_URL and LLM_MODEL (and usually LLM_API_KEY) in labs/.env. See .env.example.");
        }
        Map<String, String> h = new HashMap<>();
        if (!key.isEmpty()) h.put("Authorization", "Bearer " + key);
        return new Endpoint(base.replaceAll("/+$", "") + "/chat/completions", model, h, true);
    }

    static ArrayNode messages(String system, String user) {
        ArrayNode m = Http.JSON.createArrayNode();
        if (system != null) m.addObject().put("role", "system").put("content", system);
        m.addObject().put("role", "user").put("content", user);
        return m;
    }

    /**
     * The request every command starts from: temperature 0, a fixed seed and no reuse of an earlier
     * prompt (cache_prompt, a llama.cpp extension), so the same command gives the same answer.
     */
    static ObjectNode request(ArrayNode messages, Lab.Args a) {
        ObjectNode req = Http.object().put("model", MODEL);
        req.set("messages", messages);
        req.put("temperature", a.decimal("temperature", 0));
        req.put("seed", a.number("seed", 42));
        req.put("max_tokens", a.number("max", 400));
        req.put("cache_prompt", false);
        return req;
    }

    /** A hosted provider gets only standard fields: it may reject the llama.cpp extensions. */
    static ObjectNode forEndpoint(ObjectNode req, Endpoint ep) {
        req.put("model", ep.model());
        if (ep.remote()) {
            req.remove("seed");
            req.remove("cache_prompt");
            req.remove("chat_template_kwargs");
        }
        return req;
    }

    static String usage(JsonNode r, long t0) {
        JsonNode u = r.path("usage");
        return String.format("(prompt %d tokens, answer %d tokens, %.1f s)", u.path("prompt_tokens").asInt(), u.path("completion_tokens").asInt(), (System.nanoTime() - t0) / 1e9);
    }

    static String content(JsonNode r) {
        return r.path("choices").path(0).path("message").path("content").asText().strip();
    }

    static void chat(Lab.Args a) throws Exception {
        if (a.has("forget")) {
            Files.deleteIfExists(HISTORY);
            System.out.println("History deleted. The next chat starts from nothing.");
            if (a.texts().isEmpty()) return;
        }
        ArrayNode msgs = Http.JSON.createArrayNode();
        if (a.has("remember") && Files.exists(HISTORY)) msgs = (ArrayNode) Http.JSON.readTree(Files.readString(HISTORY));
        if (msgs.isEmpty() && a.has("system")) msgs.addObject().put("role", "system").put("content", a.get("system", ""));
        msgs.addObject().put("role", "user").put("content", a.text(0));
        Endpoint ep = endpoint(a);
        ObjectNode req = request(msgs, a);
        if (a.has("think")) {
            req.putObject("chat_template_kwargs").put("enable_thinking", true);
            req.put("max_tokens", a.number("max", 1500));
        }
        forEndpoint(req, ep);
        if (a.has("remember")) {
            System.out.println(msgs.size() == 1 ? "Sending 1 message: the history is empty."
                    : "Sending " + msgs.size() + " messages: the " + (msgs.size() - 1) + " this client kept, plus the new one.");
        }
        if (a.has("raw")) System.out.println("REQUEST  POST " + URI.create(ep.url()).getPath() + "\n" + Http.pretty(req));
        if (a.has("stream")) {
            stream(ep, req);
            return;
        }
        long t0 = System.nanoTime();
        JsonNode r = Http.post(ep.url(), req, ep.headers());
        if (a.has("raw")) {
            System.out.println("RESPONSE\n" + Http.pretty(r));
            return;
        }
        JsonNode msg = r.path("choices").path(0).path("message");
        if (a.has("think")) {
            String thought = msg.path("reasoning_content").asText("");
            System.out.println("Reasoning, " + Tokens.count(thought) + " tokens; its first lines:");
            thought.lines().limit(6).forEach(l -> System.out.println("  | " + l));
            System.out.println("Answer:");
        }
        System.out.println(msg.path("content").asText().strip());
        System.out.println(usage(r, t0));
        if (a.has("timings")) timings(r.path("timings"));
        if (a.has("remember")) {
            msgs.addObject().put("role", "assistant").put("content", msg.path("content").asText());
            Files.writeString(HISTORY, Http.JSON.writeValueAsString(msgs));
        }
    }

    static void timings(JsonNode t) {
        System.out.printf("Reading the prompt: %d tokens in %.1f s, %.0f tokens per second%n", t.path("prompt_n").asInt(), t.path("prompt_ms").asDouble() / 1000, t.path("prompt_per_second").asDouble());
        System.out.printf("Writing the answer: %d tokens in %.1f s, %.1f tokens per second%n", t.path("predicted_n").asInt(), t.path("predicted_ms").asDouble() / 1000, t.path("predicted_per_second").asDouble());
    }

    private static void stream(Endpoint ep, ObjectNode req) throws Exception {
        req.put("stream", true);
        String text = Http.JSON.writeValueAsString(req);
        HttpRequest.Builder b = HttpRequest.newBuilder(URI.create(ep.url())).header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(text));
        ep.headers().forEach(b::header);
        long at = System.currentTimeMillis();
        HttpResponse<java.io.InputStream> r = HttpClient.newHttpClient().send(b.build(), HttpResponse.BodyHandlers.ofInputStream());
        StringBuilder answer = new StringBuilder();
        java.util.List<String> events = new java.util.ArrayList<>();
        int chunks = 0;
        try (BufferedReader in = new BufferedReader(new InputStreamReader(r.body(), StandardCharsets.UTF_8))) {
            String line;
            while ((line = in.readLine()) != null) {
                if (!line.startsWith("data: ")) continue;
                String data = line.substring(6);
                events.add(data);
                if (chunks < 4 || data.equals("[DONE]")) System.out.println("  " + (data.length() > 150 ? data.substring(0, 150) + "..." : data));
                else if (chunks == 4) System.out.println("  ...");
                chunks++;
                if (data.equals("[DONE]")) break;
                JsonNode d = Http.JSON.readTree(data);
                answer.append(d.path("choices").path(0).path("delta").path("content").asText(""));
            }
        }
        Map<String, String> sent = new HashMap<>(ep.headers());
        sent.put("Content-Type", "application/json");
        Events.exchange(at, "POST", ep.url(), sent, text, r.statusCode(), r.headers().map(), null, events);
        System.out.println(chunks + " server-sent events. The pieces, put together:");
        System.out.println(answer.toString().strip());
    }

    static void template(Lab.Args a) throws Exception {
        ArrayNode msgs = messages(a.has("system") ? a.get("system", "") : null, a.text(0));
        ObjectNode req = Http.object();
        req.set("messages", msgs);
        if (a.has("think")) req.putObject("chat_template_kwargs").put("enable_thinking", true);
        String prompt = Http.post(Http.chat() + "/apply-template", req).path("prompt").asText();
        System.out.println("The text the model receives, " + Tokens.count(prompt) + " tokens (special tokens included):");
        System.out.println(prompt);
    }

    static void context(Lab.Args a) throws Exception {
        int target = a.number("tokens", 1500);
        StringBuilder text = new StringBuilder();
        java.util.List<String> parts = new java.util.ArrayList<>();
        try (Stream<Path> files = Files.list(Tokens.CORPUS.resolve("en"))) {
            for (Path f : files.sorted().toList()) parts.add(Files.readString(f));
        }
        int tokens = 0;
        for (int i = 0; tokens < target - 40; i++) {
            text.append(parts.get(i % parts.size())).append("\n\n");
            if (i % 3 == 2 || tokens > target * 0.8) tokens = Tokens.count(text.toString());
        }
        text.append("Question: in one sentence, what is Cauce?");
        ObjectNode req = request(messages(null, text.toString()), a).put("max_tokens", 40);
        long t0 = System.nanoTime();
        HttpResponse<String> r = Http.send(Http.chat() + "/v1/chat/completions", req, Map.of());
        JsonNode body = Http.JSON.readTree(r.body());
        if (r.statusCode() == 400 && body.path("error").path("type").asText().equals("exceed_context_size_error")) {
            System.out.println("REJECTED in " + (System.nanoTime() - t0) / 1_000_000 + " ms: " + body.path("error").path("message").asText());
            System.out.println("Prompt " + body.path("error").path("n_prompt_tokens").asInt() + " tokens, context " + body.path("error").path("n_ctx").asInt() + " tokens.");
            return;
        }
        if (r.statusCode() != 200) throw new LabError("HTTP " + r.statusCode() + ": " + r.body());
        System.out.println(content(body));
        System.out.println(usage(body, t0));
        timings(body.path("timings"));
    }

    static final String EXTRACT = "Extract the error the user describes as JSON with three fields: code, severity (low, medium or high) and retry (true or false). Answer with the JSON only.";

    static ObjectNode errorSchema() {
        ObjectNode s = Http.object().put("type", "object").put("additionalProperties", false);
        ObjectNode p = s.putObject("properties");
        p.putObject("code").put("type", "string").put("pattern", "^CAU-[0-9]{4}$");
        p.putObject("severity").put("type", "string").putArray("enum").add("low").add("medium").add("high");
        p.putObject("retry").put("type", "boolean");
        s.putArray("required").add("code").add("severity").add("retry");
        return s;
    }

    static void extract(Lab.Args a) throws Exception {
        Endpoint ep = endpoint(a);
        ObjectNode req = forEndpoint(request(messages(EXTRACT, a.text(0)), a), ep);
        if (a.has("schema")) {
            ObjectNode rf = req.putObject("response_format").put("type", "json_schema");
            rf.putObject("json_schema").put("name", "error").put("strict", true).set("schema", errorSchema());
            System.out.println("With a JSON schema: the server only lets the model write text that fits it.");
        } else {
            System.out.println("Without a schema: the instruction asks for JSON, nothing enforces it.");
        }
        long t0 = System.nanoTime();
        JsonNode r = Http.post(ep.url(), req, ep.headers());
        String out = content(r);
        String verdict = validate(out);
        Events.put("extract", Http.object().put("schema", a.has("schema")).put("answer", out).put("verdict", verdict));
        System.out.println(out);
        System.out.println(verdict);
        System.out.println(usage(r, t0));
    }

    /** Checks the answer against the error schema, field by field, and says what is wrong. */
    static String validate(String text) {
        String t = text.replaceAll("(?s)^```(json)?\\s*", "").replaceAll("(?s)\\s*```$", "");
        JsonNode n;
        try {
            n = Http.JSON.readTree(t);
        } catch (Exception e) {
            return "INVALID: the answer is not JSON.";
        }
        java.util.List<String> errors = new java.util.ArrayList<>();
        for (String f : new String[] {"code", "severity", "retry"}) if (!n.has(f)) errors.add("missing " + f);
        if (n.has("code") && !n.path("code").asText().matches("^CAU-[0-9]{4}$")) errors.add("code " + n.get("code") + " does not look like CAU-0000");
        if (n.has("severity") && !java.util.List.of("low", "medium", "high").contains(n.path("severity").asText())) errors.add("severity " + n.get("severity") + " is not low, medium or high");
        if (n.has("retry") && !n.path("retry").isBoolean()) errors.add("retry " + n.get("retry") + " is not true or false");
        n.fieldNames().forEachRemaining(f -> {
            if (!java.util.List.of("code", "severity", "retry").contains(f)) errors.add("unexpected field " + f);
        });
        return errors.isEmpty() ? "VALID against the schema." : "INVALID: " + String.join("; ", errors) + ".";
    }

    static final String GUIDE = "You are the operations assistant of Cauce. For the status of an incident, always call get_incident_status.";

    static void tools(Lab.Args a) throws Exception {
        ArrayNode msgs = messages(a.has("guide") ? GUIDE : null, a.text(0));
        ArrayNode tools = Http.JSON.createArrayNode();
        ObjectNode f = tools.addObject().put("type", "function").putObject("function");
        f.put("name", "get_incident_status").put("description", "Returns the current status of an incident of the Cauce platform, by its id (for example INC-2041).");
        ObjectNode params = f.putObject("parameters").put("type", "object");
        params.putObject("properties").putObject("id").put("type", "string").put("description", "Incident id, like INC-2041");
        params.putArray("required").add("id");
        if (a.has("guide")) System.out.println("System prompt: " + GUIDE);
        for (int round = 1; round <= 4; round++) {
            ObjectNode req = request(msgs, a);
            req.set("tools", tools);
            long t0 = System.nanoTime();
            JsonNode r = Http.post(Http.chat() + "/v1/chat/completions", req);
            JsonNode msg = r.path("choices").path(0).path("message");
            JsonNode calls = msg.path("tool_calls");
            if (!calls.isArray() || calls.isEmpty()) {
                System.out.println("Round " + round + ", the model answers " + usage(r, t0) + ":");
                System.out.println("  " + msg.path("content").asText().strip().replace("\n", "\n  "));
                return;
            }
            System.out.println("Round " + round + ", the model asks for a tool " + usage(r, t0) + ":");
            ObjectNode assistant = msgs.addObject().put("role", "assistant");
            assistant.putNull("content");
            assistant.set("tool_calls", calls);
            for (JsonNode c : calls) {
                String name = c.path("function").path("name").asText();
                String args = c.path("function").path("arguments").asText();
                System.out.println("  call " + name + " " + args);
                String result = Incidents.run(name, Http.JSON.readTree(args));
                System.out.println("  the lab runs it and sends back: " + result);
                msgs.addObject().put("role", "tool").put("tool_call_id", c.path("id").asText()).put("content", result);
            }
        }
        System.out.println("The model kept asking for tools; the lab stops after 4 rounds.");
    }
}
