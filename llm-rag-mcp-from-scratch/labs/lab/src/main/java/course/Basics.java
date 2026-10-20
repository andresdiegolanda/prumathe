package course;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

/** The first contact with the chat server: what it serves, and one answer. */
final class Basics {
    private Basics() {}

    static void hello(Lab.Args a) throws Exception {
        JsonNode props = Http.get(Http.chat() + "/props");
        System.out.println("Model     " + props.path("model_alias").asText(props.path("model_path").asText()));
        System.out.println("Server    llama.cpp " + props.path("build_info").asText());
        System.out.println("Context   " + props.path("default_generation_settings").path("n_ctx").asInt() + " tokens");
        ObjectNode req = Chat.request(Chat.messages(null, "In one short sentence: what are you?"), a);
        long t0 = System.nanoTime();
        JsonNode r = Http.post(Http.chat() + "/v1/chat/completions", req);
        System.out.println();
        System.out.println(r.path("choices").path(0).path("message").path("content").asText().strip());
        System.out.println(Chat.usage(r, t0));
    }

    static void props(Lab.Args a) throws Exception {
        JsonNode props = Http.get(Http.chat() + "/props");
        JsonNode model = Http.get(Http.chat() + "/v1/models").path("data").path(0);
        JsonNode meta = model.path("meta");
        JsonNode gen = props.path("default_generation_settings");
        System.out.println("Model        " + model.path("id").asText());
        System.out.println("File         " + props.path("model_path").asText());
        if (meta.has("n_params")) System.out.printf("Parameters   %.2f billion%n", meta.path("n_params").asDouble() / 1e9);
        if (meta.has("size")) System.out.printf("Weights      %.2f GB on disk and in memory%n", meta.path("size").asDouble() / 1e9);
        if (meta.has("n_ctx_train")) System.out.println("Trained for  " + meta.path("n_ctx_train").asInt() + " tokens of context");
        if (meta.has("n_vocab")) System.out.println("Vocabulary   " + meta.path("n_vocab").asInt() + " tokens");
        System.out.println("Context      " + gen.path("n_ctx").asInt() + " tokens, shared by " + props.path("total_slots").asInt() + " slots");
        System.out.println("Server       llama.cpp " + props.path("build_info").asText());
        JsonNode p = gen.path("params");
        if (!p.isMissingNode()) {
            System.out.printf("Sampling     temperature %.1f, top_k %d, top_p %.2f, min_p %.2f (defaults; each request can change them)%n",
                    p.path("temperature").asDouble(), p.path("top_k").asInt(), p.path("top_p").asDouble(), p.path("min_p").asDouble());
        }
    }
}
