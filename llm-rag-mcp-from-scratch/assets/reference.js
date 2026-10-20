window.LLM_REFERENCE = {
  "sources": {
    "kit": [
      "llama.cpp: the HTTP server",
      "https://github.com/ggml-org/llama.cpp/blob/master/tools/server/README.md"
    ],
    "server": [
      "llama.cpp server: /completion and n_probs",
      "https://github.com/ggml-org/llama.cpp/blob/master/tools/server/README.md"
    ],
    "tokenizer": [
      "Hugging Face Transformers: summary of the tokenizers",
      "https://huggingface.co/docs/transformers/tokenizer_summary"
    ],
    "sampling": [
      "Hugging Face Transformers: text generation parameters",
      "https://huggingface.co/docs/transformers/v5.13.0/main_classes/text_generation"
    ],
    "granite": [
      "IBM Granite 4.2 models",
      "https://www.ibm.com/granite/docs/models/granite4-2"
    ],
    "embedding": [
      "Qwen3-Embedding-0.6B model card",
      "https://huggingface.co/Qwen/Qwen3-Embedding-0.6B"
    ],
    "transformer": [
      "Vaswani et al., Attention Is All You Need (2017)",
      "https://arxiv.org/abs/1706.03762"
    ],
    "chattemplate": [
      "Hugging Face Transformers: chat templates",
      "https://huggingface.co/docs/transformers/en/chat_templating"
    ],
    "quantize": [
      "llama.cpp: quantization types",
      "https://github.com/ggml-org/llama.cpp/blob/master/tools/quantize/README.md"
    ],
    "chatapi": [
      "llama.cpp server: OpenAI-compatible endpoints",
      "https://github.com/ggml-org/llama.cpp/blob/master/tools/server/README.md"
    ],
    "grammars": [
      "llama.cpp: grammars and JSON schema",
      "https://github.com/ggml-org/llama.cpp/blob/master/grammars/README.md"
    ],
    "functioncalling": [
      "llama.cpp: function calling",
      "https://github.com/ggml-org/llama.cpp/blob/master/docs/function-calling.md"
    ],
    "chatclient": [
      "Spring AI 2.0: Chat Client API",
      "https://docs.spring.io/spring-ai/reference/2.0/api/chatclient.html"
    ],
    "ragpaper": [
      "Lewis et al., Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks (2020)",
      "https://arxiv.org/abs/2005.11401v4"
    ],
    "pgvectorspring": [
      "Spring AI 2.0: PGvector",
      "https://docs.spring.io/spring-ai/reference/2.0/api/vectordbs/pgvector.html"
    ],
    "pgvector": [
      "pgvector: exact and approximate search",
      "https://github.com/pgvector/pgvector/blob/master/README.md"
    ],
    "springrag": [
      "Spring AI: Retrieval Augmented Generation",
      "https://docs.spring.io/spring-ai/reference/api/retrieval-augmented-generation.html"
    ],
    "reranker": [
      "Qwen3-Reranker-0.6B, the GGUF the kit uses",
      "https://huggingface.co/ggml-org/Qwen3-Reranker-0.6B-Q8_0-GGUF"
    ],
    "evaluation": [
      "Spring AI 2.0: evaluation testing",
      "https://docs.spring.io/spring-ai/reference/2.0/api/testing.html"
    ],
    "owasp": [
      "OWASP: LLM01:2025 Prompt Injection",
      "https://genai.owasp.org/llmrisk/llm01-prompt-injection/"
    ],
    "mcpspec": [
      "Model Context Protocol specification, 2026-07-28",
      "https://modelcontextprotocol.io/specification/2026-07-28"
    ],
    "changelog": [
      "MCP 2026-07-28: changes from the previous revision",
      "https://modelcontextprotocol.io/specification/2026-07-28/changelog"
    ],
    "mcpannotations": [
      "Spring AI: MCP annotations",
      "https://docs.spring.io/spring-ai/reference/api/mcp/mcp-annotations-overview.html"
    ],
    "mcptools": [
      "MCP 2026-07-28: tools, human in the loop and annotations",
      "https://modelcontextprotocol.io/specification/2026-07-28/server/tools"
    ],
    "mcpsecurity": [
      "MCP 2026-07-28: security best practices",
      "https://modelcontextprotocol.io/specification/2026-07-28/basic/security_best_practices"
    ],
    "owasptop10": [
      "OWASP Top 10 for LLM applications",
      "https://genai.owasp.org/llm-top-10/"
    ]
  },
  "glossary": [
    ["LLM", "LLM", "A large language model: a neural network trained to predict the next token of a text.", "Un modelo de lenguaje grande: una red neuronal entrenada para predecir el próximo token de un texto.", 1],
    ["Next-token distribution", "Distribución del próximo token", "The probability the model gives to each token of its vocabulary as the next one.", "La probabilidad que el modelo le da a cada token de su vocabulario como el siguiente.", 1],
    ["Logit", "Logit", "The raw score of a token before softmax turns all the scores into probabilities.", "El puntaje crudo de un token antes de que softmax convierta todos los puntajes en probabilidades.", 1],
    ["Greedy decoding", "Decodificación greedy", "Always choosing the most probable token; the same prompt then gives the same text.", "Elegir siempre el token más probable; el mismo prompt da entonces el mismo texto.", 1],
    ["Token", "Token", "The unit a model reads and writes: a word, a piece of a word, a symbol or a byte.", "La unidad que un modelo lee y escribe: una palabra, un pedazo de palabra, un símbolo o un byte.", 2],
    ["Tokenizer", "Tokenizador", "The fixed rules that split text into tokens of a vocabulary, each with its number.", "Las reglas fijas que parten el texto en tokens de un vocabulario, cada uno con su número.", 2],
    ["Temperature", "Temperatura", "Scales the scores before sampling: below 1 the distribution sharpens, above 1 it flattens.", "Escala los puntajes antes de muestrear: debajo de 1 la distribución se afila, arriba de 1 se aplana.", 3],
    ["Top-k, top-p, min-p", "Top-k, top-p, min-p", "Filters that keep only the most probable candidates before one is drawn.", "Filtros que dejan solo los candidatos más probables antes de sortear uno.", 3],
    ["Seed", "Semilla", "The start of the random generator; same seed, settings and server repeat a sample.", "El inicio del generador aleatorio; misma semilla, parámetros y servidor repiten una muestra.", 3],
    ["Context window", "Ventana de contexto", "The most tokens, prompt plus answer, a request can hold.", "La mayor cantidad de tokens, prompt más respuesta, que entra en un pedido.", 4],
    ["Conversation history", "Historial de la conversación", "The earlier messages the client sends again with each request; the model keeps nothing between requests.", "Los mensajes anteriores que el cliente vuelve a mandar en cada pedido; el modelo no guarda nada entre pedidos.", 4],
    ["Embedding", "Embedding", "A vector of numbers that stands for the meaning of a text.", "Un vector de números que representa el significado de un texto.", 5],
    ["Cosine similarity", "Similitud coseno", "How closely two vectors point the same way, from -1 to 1.", "Cuánto apuntan dos vectores hacia el mismo lado, de -1 a 1.", 5],
    ["Attention", "Atención", "The mechanism that computes each token's representation from the other tokens of the context.", "El mecanismo que calcula la representación de cada token a partir de los otros tokens del contexto.", 6],
    ["Transformer", "Transformer", "The architecture of current language models: layers of attention and feed-forward networks.", "La arquitectura de los modelos de lenguaje actuales: capas de atención y redes feed-forward.", 6],
    ["Base model", "Modelo base", "A model trained only to continue text, before it learns to follow instructions.", "Un modelo entrenado solo para continuar texto, antes de aprender a seguir instrucciones.", 7],
    ["Chat template", "Plantilla de chat", "The format, with special tokens, that turns a list of messages into one prompt.", "El formato, con tokens especiales, que convierte una lista de mensajes en un solo prompt.", 7],
    ["Special token", "Token especial", "A token with a role in the format, such as the start of a message, not a piece of text.", "Un token con un papel en el formato, como el comienzo de un mensaje, no un pedazo de texto.", 7],
    ["Reasoning tokens", "Tokens de razonamiento", "Text the model writes before its answer; it costs tokens and time like any other output.", "Texto que el modelo escribe antes de su respuesta; cuesta tokens y tiempo como cualquier salida.", 7],
    ["Parameter", "Parámetro", "A number learned in training; the size of a model is counted in parameters.", "Un número aprendido en el entrenamiento; el tamaño de un modelo se cuenta en parámetros.", 8],
    ["Quantization", "Cuantización", "Storing parameters in fewer bits, such as 4 instead of 16, to cut memory at some cost in quality.", "Guardar los parámetros con menos bits, como 4 en vez de 16, para usar menos memoria a cambio de algo de calidad.", 8],
    ["GGUF", "GGUF", "The file format of llama.cpp: weights, tokenizer and chat template in one file.", "El formato de archivo de llama.cpp: pesos, tokenizador y plantilla de chat en un solo archivo.", 8],
    ["KV cache", "Caché KV", "The keys and values of the tokens already processed, kept so they are not computed again.", "Las claves y valores de los tokens ya procesados, guardados para no calcularlos de nuevo.", 8],
    ["Prefill and decode", "Prefill y decode", "Reading the prompt, many tokens at once, then writing the answer one token at a time.", "Leer el prompt, muchos tokens a la vez, y después escribir la respuesta de a un token.", 8],
    ["Chat completions API", "API de chat completions", "The HTTP format, messages in and one message out, that many servers and providers share.", "El formato HTTP, mensajes de entrada y un mensaje de salida, que comparten muchos servidores y proveedores.", 9],
    ["Streaming", "Streaming", "Receiving the answer in pieces, as server-sent events, while it is generated.", "Recibir la respuesta en pedazos, como eventos del servidor, mientras se genera.", 9],
    ["JSON Schema", "JSON Schema", "A description of the shape a JSON document must have: fields, types and allowed values.", "Una descripción de la forma que tiene que tener un JSON: campos, tipos y valores permitidos.", 10],
    ["Constrained decoding", "Decodificación restringida", "Sampling only tokens that keep the output valid for a grammar or a schema.", "Muestrear solo tokens que mantienen la salida válida para una gramática o un schema.", 10],
    ["Tool calling", "Tool calling", "The model answers with a request to run a named function with arguments; the application decides whether to run it.", "El modelo responde pidiendo ejecutar una función con nombre y argumentos; la aplicación decide si la ejecuta.", 11],
    ["ChatClient", "ChatClient", "Spring AI's fluent API to build a prompt, call a model and read the answer.", "La API fluida de Spring AI para armar un prompt, llamar a un modelo y leer la respuesta.", 12],
    ["Advisor", "Advisor", "A Spring AI component that changes a request or its response around the call, such as memory or retrieval.", "Un componente de Spring AI que cambia un pedido o su respuesta alrededor de la llamada, como la memoria o la recuperación.", 12],
    ["RAG", "RAG", "Retrieval-augmented generation: find the passages that answer a question and give them to the model with it.", "Generación aumentada por recuperación: encontrar los pasajes que responden una pregunta y dárselos al modelo con ella.", 13],
    ["Hallucination", "Alucinación", "A fluent statement that no source supports.", "Una afirmación fluida que ninguna fuente respalda.", 13],
    ["Chunk", "Chunk", "A piece of a document, small enough to embed and to fit in a prompt with others.", "Un pedazo de documento, lo bastante chico para su embedding y para entrar en un prompt con otros.", 14],
    ["Overlap", "Solapamiento", "Characters two neighboring chunks share, so a sentence cut at the border is whole in one of them.", "Caracteres que comparten dos chunks vecinos, para que una oración cortada en el borde quede entera en uno.", 14],
    ["Vector store", "Base vectorial", "A store of chunks with their vectors that returns the nearest ones to a query vector.", "Un almacén de chunks con sus vectores que devuelve los más cercanos al vector de una consulta.", 14],
    ["HNSW", "HNSW", "An approximate nearest-neighbor index: fast, but it can miss the exact nearest vector.", "Un índice aproximado de vecinos cercanos: rápido, pero puede perderse el vector más cercano exacto.", 15],
    ["Full-text search", "Búsqueda de texto completo", "Search by words: the text is reduced to normalized words and matched against the query's.", "Búsqueda por palabras: el texto se reduce a palabras normalizadas y se compara con las de la consulta.", 15],
    ["Hybrid search", "Búsqueda híbrida", "Running keyword and vector search for the same query and fusing both rankings.", "Correr búsqueda por palabras y por vectores para la misma consulta y fusionar los dos rankings.", 15],
    ["Reciprocal rank fusion", "Fusión por rango recíproco", "Fusing rankings by adding 1 / (60 + position) from each list; scores are ignored.", "Fusionar rankings sumando 1 / (60 + posición) de cada lista; los puntajes se ignoran.", 15],
    ["Citation", "Cita", "A reference in the answer to the source that supports each statement.", "Una referencia en la respuesta a la fuente que respalda cada afirmación.", 16],
    ["Reranker", "Reranker", "A model that reads the question with each candidate passage and scores the pair.", "Un modelo que lee la pregunta junto con cada pasaje candidato y puntúa el par.", 17],
    ["Metadata filter", "Filtro por metadata", "A condition on the metadata of chunks, such as language or source, applied with the search.", "Una condición sobre la metadata de los chunks, como el idioma o la fuente, aplicada junto con la búsqueda.", 17],
    ["Hit rate", "Tasa de acierto", "The share of questions with a right chunk among the first k retrieved.", "La proporción de preguntas con un chunk correcto entre los primeros k recuperados.", 18],
    ["MRR", "MRR", "Mean reciprocal rank: the average of 1 / position of the first right chunk.", "Rango recíproco medio: el promedio de 1 / posición del primer chunk correcto.", 18],
    ["Model as a judge", "Modelo como juez", "Asking a model to grade answers; useful at scale, wrong in ways that must be measured.", "Pedirle a un modelo que califique respuestas; útil en volumen, equivocado de maneras que hay que medir.", 18],
    ["Prompt injection", "Prompt injection", "Instructions placed in data that the model then treats as orders.", "Instrucciones puestas en los datos que el modelo después toma como órdenes.", 19],
    ["MCP", "MCP", "Model Context Protocol: an open protocol by which an application offers a model tools, resources and prompts from servers.", "Model Context Protocol: un protocolo abierto con el que una aplicación le ofrece a un modelo tools, resources y prompts de servidores.", 20],
    ["Host, client, server (MCP)", "Host, cliente, servidor (MCP)", "The application with the model, the connector it keeps for each server, and the program that exposes capabilities.", "La aplicación con el modelo, el conector que mantiene con cada servidor y el programa que expone capacidades.", 20],
    ["Tool, resource, prompt (MCP)", "Tool, resource, prompt (MCP)", "What a server offers: actions the model can call, data the application can read, templates the user can pick.", "Lo que ofrece un servidor: acciones que el modelo puede llamar, datos que la aplicación puede leer, plantillas que el usuario puede elegir.", 20],
    ["JSON-RPC", "JSON-RPC", "The message format of MCP: requests with an id and a method, responses with a result or an error.", "El formato de mensajes de MCP: pedidos con id y método, respuestas con resultado o error.", 20],
    ["Streamable HTTP", "Streamable HTTP", "The MCP transport over HTTP: each message is a POST, answered with JSON or a stream of events.", "El transporte de MCP sobre HTTP: cada mensaje es un POST, respondido con JSON o con un stream de eventos.", 21],
    ["Protocol revision", "Revisión del protocolo", "A dated version of the MCP specification; client and server must agree on one.", "Una versión con fecha de la especificación de MCP; cliente y servidor tienen que coincidir en una.", 21],
    ["MCP session", "Sesión MCP", "In 2025-11-25, the state a server can keep after the handshake, named by Mcp-Session-Id; 2026-07-28 removed it.", "En 2025-11-25, el estado que un servidor puede guardar después del handshake, con nombre Mcp-Session-Id; 2026-07-28 lo eliminó.", 21],
    ["Tool annotations", "Anotaciones de tools", "Hints such as readOnlyHint that describe a tool; a client trusts them only from servers it trusts.", "Indicaciones como readOnlyHint que describen una tool; un cliente las cree solo de servidores en los que confía.", 22],
    ["stdio transport", "Transporte stdio", "MCP over the standard input and output of a process the client starts, one JSON-RPC message per line.", "MCP sobre la entrada y salida estándar de un proceso que arranca el cliente, un mensaje JSON-RPC por línea.", 22],
    ["Agent loop", "Bucle de agente", "The model chooses a tool, the application runs it and returns the result, until the model answers or the host stops it.", "El modelo elige una tool, la aplicación la ejecuta y devuelve el resultado, hasta que el modelo responde o el host lo frena.", 23],
    ["Human in the loop", "Persona en el circuito", "A person who sees a proposed action and can deny it before it runs.", "Una persona que ve una acción propuesta y puede negarla antes de que se ejecute.", 23],
    ["Tool poisoning", "Tool poisoning", "Hiding instructions for the model in a tool's description or result.", "Esconder instrucciones para el modelo en la descripción o el resultado de una tool.", 24],
    ["Least privilege", "Mínimo privilegio", "Offering only the tools and permissions a task needs.", "Ofrecer solo las tools y los permisos que una tarea necesita.", 24],
    ["Origin validation", "Validación de Origin", "Rejecting HTTP requests from unexpected web origins, a defense against DNS rebinding of a local server.", "Rechazar pedidos HTTP de orígenes web inesperados, una defensa contra el DNS rebinding de un servidor local.", 24]
  ]
};
