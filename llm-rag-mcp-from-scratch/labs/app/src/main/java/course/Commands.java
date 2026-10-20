package course;

import org.springframework.beans.factory.ObjectProvider;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

/** Runs the command of {@code docker compose run --rm app <command> ...} and exits. */
@Component
@Profile("!mcp")
class Commands implements CommandLineRunner {

    private final ObjectProvider<Basics> basics;
    private final ObjectProvider<Rag> rag;
    private final ObjectProvider<Eval> eval;
    private final ObjectProvider<Agent> agent;
    private final ObjectProvider<Incidents> incidents;

    Commands(ObjectProvider<Basics> basics, ObjectProvider<Rag> rag, ObjectProvider<Eval> eval, ObjectProvider<Agent> agent,
            ObjectProvider<Incidents> incidents) {
        this.basics = basics;
        this.rag = rag;
        this.eval = eval;
        this.agent = agent;
        this.incidents = incidents;
    }

    @Override
    public void run(String... argv) {
        Args a = Args.parse(argv);
        try {
            switch (a.command()) {
                case "chat" -> basics.getObject().chat(a);
                case "entity" -> basics.getObject().entity(a);
                case "tools" -> basics.getObject().tools(a);
                case "memory" -> basics.getObject().memory(a);
                case "ask" -> rag.getObject().ask(a);
                case "index" -> rag.getObject().index(a);
                case "search" -> rag.getObject().search(a);
                case "eval" -> eval.getObject().run(a);
                case "agent" -> agent.getObject().run(a);
                case "reset" -> {
                    int n = incidents.getObject().reset();
                    System.out.println(n == 1 ? "Reopened 1 incident closed during the labs." : "Reopened " + n + " incidents closed during the labs.");
                }
                case "help" -> help();
                default -> throw new CourseError("Unknown command " + a.command() + ". Run: docker compose run --rm app help");
            }
        } catch (CourseError e) {
            fail(e.getMessage());
        } catch (Exception e) {
            fail(explain(e));
        }
        // A command runs once: exit now instead of waiting for idle HTTP connections to time out.
        System.out.flush();
        System.exit(0);
    }

    /** One line that says which service is missing, instead of a stack trace. */
    static String explain(Exception e) {
        String line = Out.firstLine(e);
        for (Throwable t = e; t != null; t = t.getCause()) {
            String m = String.valueOf(t.getMessage());
            if (t instanceof java.net.ConnectException || m.contains("Connection refused") || m.contains("UnknownHost") || t instanceof java.nio.channels.UnresolvedAddressException) {
                return "Cannot reach a server of the kit (" + line + "). Start what the lesson uses, for example docker compose up -d --wait chat embed db";
            }
        }
        return line;
    }

    private static void fail(String message) {
        System.out.println("ERROR " + message);
        System.out.flush();
        Events.exit(1);
        System.exit(1);
    }

    static void help() {
        System.out.println("""
                App commands (from labs: docker compose run --rm app <command>):
                  chat "<text>"                              one answer through ChatClient
                  entity "<text>" [--native] [--validate]    the answer as a Java record
                  tools "<question>"                         @Tool methods the model can call
                  memory ["<first>" "<second>"]              two turns, without and with chat memory
                  ask "<question>" --no-context              the model alone
                  ask "<question>" --with-doc en/<file>.md   a whole runbook pasted into the prompt
                  index [--fixed --chunk 400 --overlap 80] [--extra]   chunks, embeddings and pgvector
                  search "<query>" [--k 5] [--keyword | --hybrid] [--rerank] [--trusted]
                  ask "<question>" [--k 4] [--hybrid] [--rerank] [--trusted] [--harden] [--show-prompt] [--tools [--approve]]
                  eval [--k 5] [--answers] [--judge]         retrieval and answers against labs/eval/questions.json
                  agent "<task>" [--servers cauce,poisoned] [--allow tool,tool] [--approve] [--max-steps 6] [--verbose]
                  reset                                      reopen the incidents closed during the labs
                """);
    }
}
