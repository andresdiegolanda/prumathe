package course;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.MessageChatMemoryAdvisor;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.ai.chat.memory.MessageWindowChatMemory;
import org.springframework.ai.chat.model.ChatResponse;
import org.springframework.ai.converter.BeanOutputConverter;
import org.springframework.stereotype.Component;

/** Lesson 12: the same model as before, now through Spring AI's ChatClient. */
@Component
class Basics {

    /** What lesson 10 extracted by hand, now as a Java type. */
    enum Severity { low, medium, high }

    record ErrorSummary(String code, Severity severity, boolean retry) {}

    static final String ASSISTANT = "You are the operations assistant of Cauce, an integration platform. Use the tools to answer questions about incidents. Be brief.";

    static final String BRIEF = "You are the operations assistant of Cauce, an integration platform. Answer in one or two sentences.";

    private final ChatClient chat;
    private final Incidents incidents;

    Basics(ChatClient.Builder builder, Incidents incidents) {
        this.chat = builder.build();
        this.incidents = incidents;
    }

    void chat(Args a) {
        long t0 = System.nanoTime();
        ChatResponse r = chat.prompt().user(a.text(0)).call().chatResponse();
        System.out.println(Out.text(r));
        System.out.println(Out.usage(r, t0));
    }

    void entity(Args a) {
        String text = a.text(0);
        long t0 = System.nanoTime();
        if (a.has("native")) {
            System.out.println("useProviderStructuredOutput: the JSON schema goes to the server as response_format, which constrains what the model can write.");
        } else {
            String format = new BeanOutputConverter<>(ErrorSummary.class).getFormat();
            System.out.println("entity() appends these instructions to the prompt (first lines):");
            format.lines().limit(4).forEach(l -> System.out.println("  | " + l));
            System.out.println("  | ... (" + format.lines().count() + " lines, with the JSON schema of ErrorSummary)");
        }
        if (a.has("validate")) System.out.println("validateSchema: if the JSON does not fit the schema, Spring AI asks again with the error.");
        String prompt = "Extract the error the user describes: its code, its severity and whether to retry.\n\n" + text;
        try {
            ErrorSummary s = chat.prompt().user(prompt).call().entity(ErrorSummary.class, spec -> {
                if (a.has("native")) spec.useProviderStructuredOutput();
                if (a.has("validate")) spec.validateSchema();
            });
            System.out.println("Result: " + s);
        } catch (RuntimeException e) {
            System.out.println("FAILED to build an ErrorSummary: " + Out.firstLine(e));
        }
        System.out.printf("(%.1f s)%n", (System.nanoTime() - t0) / 1e9);
    }

    void tools(Args a) {
        long t0 = System.nanoTime();
        ChatResponse r = chat.prompt().system(ASSISTANT).user(a.text(0))
                .tools((Object[]) IncidentTools.callbacks(incidents, false, false)).call().chatResponse();
        System.out.println(Out.text(r));
        System.out.println(Out.usage(r, t0));
    }

    void memory(Args a) {
        String first = a.texts().size() > 0 ? a.text(0) : "I am on call today and I am working on incident INC-2041.";
        String second = a.texts().size() > 1 ? a.text(1) : "Which incident am I working on?";
        System.out.println("System prompt: " + BRIEF);
        System.out.println("Without memory: each call sends only its own message.");
        talk(chat, null, first, second);
        ChatMemory memory = MessageWindowChatMemory.builder().maxMessages(10).build();
        ChatClient remembering = chat.mutate().defaultAdvisors(MessageChatMemoryAdvisor.builder(memory).build()).build();
        System.out.println();
        System.out.println("With MessageChatMemoryAdvisor: the advisor keeps the conversation and sends it again each time.");
        talk(remembering, "on-call", first, second);
        System.out.println("The memory of conversation on-call holds " + memory.get("on-call").size() + " messages.");
    }

    private static void talk(ChatClient client, String conversation, String first, String second) {
        for (String m : new String[] {first, second}) {
            long t0 = System.nanoTime();
            ChatClient.ChatClientRequestSpec spec = client.prompt().system(BRIEF).user(m);
            if (conversation != null) spec = spec.advisors(p -> p.param(ChatMemory.CONVERSATION_ID, conversation));
            ChatResponse r = spec.call().chatResponse();
            System.out.println("  > " + m);
            System.out.println("  < " + Out.text(r).replace("\n", "\n    ") + "  " + Out.usage(r, t0));
        }
    }
}
