/* The "What LLMs, RAG and MCP are" page: what they are, where they came from, where they fit and
   where they do not. Read once, before lesson 00. Bilingual like the curriculum; scripts/build.mjs
   puts it in what-llms-rag-and-mcp-are.html and in the course notes, scripts/check.mjs verifies it.
   Facts come from the sources listed at the end; the "where they do not fit" part is the course's
   own judgment and says so. */
window.LLM_ABOUT = (() => {
  const B = (en, es) => ({ en, es });
  return {
    eyebrow: B('A FIVE MINUTE READ', 'CINCO MINUTOS DE LECTURA'),
    title: B('What LLMs, RAG and MCP are', 'Qué son los LLMs, RAG y MCP'),
    lead: B(
      'What they are, where they came from, where they fit and where they do not. Read it once; the lessons do the rest.',
      'Qué son, de dónde salieron, dónde encajan y dónde no. Se lee una vez; el resto lo hacen las lecciones.',
    ),
    what: {
      title: B('A next-token predictor, its sources and its tools', 'Un predictor del próximo token, sus fuentes y sus herramientas'),
      text: [
        B(
          'A large language model is a neural network trained on a large amount of text to do one thing: given the tokens so far, give a probability to every possible next token. Generating an answer is choosing one, appending it and asking again. A chat assistant is the same model further trained on conversations, with a template that marks who says what. It writes what is probable, not what is verified: it has no memory between requests, no access to your systems and no notion of which of its statements are true.',
          'Un modelo de lenguaje grande es una red neuronal entrenada con mucho texto para hacer una sola cosa: dados los tokens hasta acá, darle una probabilidad a cada token siguiente posible. Generar una respuesta es elegir uno, agregarlo y preguntar de nuevo. Un asistente de chat es el mismo modelo entrenado además con conversaciones, con una plantilla que marca quién dice qué. Escribe lo probable, no lo verificado: no tiene memoria entre pedidos, no tiene acceso a tus sistemas ni noción de cuáles de sus afirmaciones son ciertas.',
        ),
        B(
          'Retrieval-augmented generation, RAG, is an application pattern around the model: search your documents for the question, put the passages found in the prompt and ask the model to answer only from them, citing them. The Model Context Protocol, MCP, is an open protocol for the other half: an application connects to servers that offer tools, resources and prompts, and lets the model ask for a tool call that the application decides whether to run. The model proposes; the application retrieves, runs, checks and decides.',
          'La generación aumentada por recuperación, RAG, es un patrón de aplicación alrededor del modelo: buscar en tus documentos para la pregunta, poner los pasajes encontrados en el prompt y pedirle al modelo que responda solo con ellos, citándolos. El Model Context Protocol, MCP, es un protocolo abierto para la otra mitad: una aplicación se conecta a servidores que ofrecen tools, resources y prompts, y deja que el modelo pida una llamada a una tool que la aplicación decide si ejecuta. El modelo propone; la aplicación recupera, ejecuta, verifica y decide.',
        ),
      ],
      rule: B('The model predicts text; the application is responsible for what it does with it.', 'El modelo predice texto; la aplicación es responsable de lo que hace con él.'),
      modelNote: B(
        'The model from lesson 01. Change the prefix and the temperature: the bars are the probabilities of the next token, and generating is choosing one of them, again and again.',
        'El modelo de la lección 01. Cambiá el prefijo y la temperatura: las barras son las probabilidades del próximo token, y generar es elegir una, una y otra vez.',
      ),
    },
    origin: {
      title: B('Where they came from', 'De dónde salieron'),
      text: [
        B(
          'The architecture of current models is the Transformer, published in June 2017 by a team at Google in a paper titled Attention Is All You Need: layers of attention that compute each token from all the others. Scaled up and trained on more text, these models learned to continue any text; in March 2022 a paper by OpenAI described how to train them further with human feedback so that they follow instructions, the step that turned text predictors into assistants and that reached the public at the end of that year.',
          'La arquitectura de los modelos actuales es el Transformer, publicado en junio de 2017 por un equipo de Google en un paper titulado Attention Is All You Need: capas de atención que calculan cada token a partir de todos los demás. Más grandes y entrenados con más texto, esos modelos aprendieron a continuar cualquier texto; en marzo de 2022 un paper de OpenAI describió cómo entrenarlos además con feedback humano para que sigan instrucciones, el paso que convirtió predictores de texto en asistentes y que llegó al público a fin de ese año.',
        ),
        B(
          'RAG was named in a 2020 paper from Facebook AI Research, University College London and New York University that joined a retriever and a generator so that answers could rest on documents the model never memorized. In March 2023 llama.cpp showed that these models could run on an ordinary CPU, and in August 2023 the project introduced GGUF, the file format the course uses. MCP was announced by Anthropic in November 2024 and donated in December 2025 to the Agentic AI Foundation, under the Linux Foundation. Its revision of July 28, 2026 removed protocol sessions: every request carries its own version and capabilities.',
          'RAG recibió su nombre en un paper de 2020 de Facebook AI Research, University College London y New York University que unió un buscador y un generador para que las respuestas se apoyaran en documentos que el modelo nunca memorizó. En marzo de 2023 llama.cpp mostró que estos modelos podían correr en una CPU común, y en agosto de 2023 el proyecto presentó GGUF, el formato de archivo que usa el curso. Anthropic anunció MCP en noviembre de 2024 y lo donó en diciembre de 2025 a la Agentic AI Foundation, bajo la Linux Foundation. Su revisión del 28 de julio de 2026 eliminó las sesiones del protocolo: cada pedido lleva su propia versión y sus capacidades.',
        ),
      ],
      timeline: [
        {
          year: '2017',
          label: B('Transformer', 'Transformer'),
          text: B('June: Attention Is All You Need describes the architecture of current language models.', 'Junio: Attention Is All You Need describe la arquitectura de los modelos de lenguaje actuales.'),
        },
        {
          year: '2020',
          label: B('RAG', 'RAG'),
          text: B('May: Lewis and others name retrieval-augmented generation, a retriever joined to a generator.', 'Mayo: Lewis y otros le ponen nombre a la generación aumentada por recuperación, un buscador unido a un generador.'),
        },
        {
          year: '2022',
          label: B('Assistants', 'Asistentes'),
          text: B('March: a paper describes training with human feedback to follow instructions; at the end of the year chat assistants reach the public.', 'Marzo: un paper describe el entrenamiento con feedback humano para seguir instrucciones; a fin de año los asistentes de chat llegan al público.'),
        },
        {
          year: '2023',
          label: B('llama.cpp', 'llama.cpp'),
          text: B('March: llama.cpp runs a large model on a CPU. August: the project introduces the GGUF format.', 'Marzo: llama.cpp corre un modelo grande en una CPU. Agosto: el proyecto presenta el formato GGUF.'),
        },
        {
          year: '2024',
          label: B('MCP', 'MCP'),
          text: B('November: Anthropic announces the Model Context Protocol as an open standard.', 'Noviembre: Anthropic anuncia el Model Context Protocol como estándar abierto.'),
        },
        {
          year: '2026',
          label: B('Stateless MCP', 'MCP sin estado'),
          text: B('After its donation to the Agentic AI Foundation in December 2025, the revision of July 28 removes protocol sessions.', 'Después de su donación a la Agentic AI Foundation en diciembre de 2025, la revisión del 28 de julio elimina las sesiones del protocolo.'),
        },
      ],
    },
    fits: {
      title: B('Where they fit', 'Dónde encajan'),
      intro: B(
        'These are the cases you will meet in event-driven systems and enterprise integration, where the text is technical and the answers can be checked.',
        'Estos son los casos que vas a encontrar en sistemas orientados a eventos e integración empresarial, donde el texto es técnico y las respuestas se pueden verificar.',
      ),
      items: [
        {
          title: B('Answers from runbooks and documentation', 'Respuestas desde runbooks y documentación'),
          text: B('What an error code means and what to do about it, answered from your own documents and citing the section, so that a person can check it in seconds.', 'Qué significa un código de error y qué hacer, respondido desde tus propios documentos y citando la sección, para que una persona lo verifique en segundos.'),
        },
        {
          title: B('Text into structured data', 'Texto a datos estructurados'),
          text: B('An incident report, an email or a log line turned into JSON that fits a schema, validated by code before anything uses it.', 'Un reporte de incidente, un mail o una línea de log convertidos en un JSON que cumple un schema, validado por código antes de que algo lo use.'),
        },
        {
          title: B('Read-only questions over your systems', 'Preguntas de solo lectura sobre tus sistemas'),
          text: B('The status of an incident, the lag of a consumer, the open items of a queue: tools that read, offered through MCP, with every call logged.', 'El estado de un incidente, el lag de un consumidor, los pendientes de una cola: tools que leen, ofrecidas por MCP, con cada llamada registrada.'),
        },
        {
          title: B('Drafts that a person reviews', 'Borradores que revisa una persona'),
          text: B('A summary of an incident for the handover, a first version of a runbook section, the reply to a ticket: work that a person reads before it counts.', 'El resumen de un incidente para el traspaso de guardia, una primera versión de una sección de runbook, la respuesta a un ticket: trabajo que una persona lee antes de que valga.'),
        },
        {
          title: B('Search that understands the question', 'Búsqueda que entiende la pregunta'),
          text: B('Finding the right passage when the question uses other words, or another language, than the document, with keyword search next to it for exact codes.', 'Encontrar el pasaje correcto cuando la pregunta usa otras palabras, u otro idioma, que el documento, con búsqueda por palabras al lado para los códigos exactos.'),
        },
      ],
    },
    misfits: {
      title: B('Where they do not fit', 'Dónde no encajan'),
      intro: B(
        'This part is the course\'s judgment, not official documentation. Each row says what to use instead.',
        'Esta parte es criterio del curso, no documentación oficial. Cada fila dice qué usar en su lugar.',
      ),
      headers: [B('The case', 'El caso'), B('Why not', 'Por qué no'), B('Use instead', 'Usá en su lugar')],
      items: [
        {
          title: B('A decision that must be exact every time', 'Una decisión que tiene que ser exacta siempre'),
          why: B('The output is a sample from a distribution: right most of the time is not right every time, and the wrong answer reads as well as the right one.', 'La salida es una muestra de una distribución: bien casi siempre no es bien siempre, y la respuesta equivocada se lee tan bien como la correcta.'),
          instead: B('Rules or code; a model can propose, a deterministic check decides.', 'Reglas o código; un modelo puede proponer, una verificación determinista decide.'),
        },
        {
          title: B('Calculations and lookups by key', 'Cálculos y búsquedas por clave'),
          why: B('Arithmetic, counting and fetching a record by id are what a model does worst and a program does best.', 'La aritmética, contar y traer un registro por id son lo que un modelo hace peor y un programa hace mejor.'),
          instead: B('The program, or a tool the model calls and whose result it reports.', 'El programa, o una tool que el modelo llama y cuyo resultado informa.'),
        },
        {
          title: B('Actions without a person in the loop', 'Acciones sin una persona en el circuito'),
          why: B('Instructions hidden in a document or a tool result can steer the model; no prompt removes that risk.', 'Instrucciones escondidas en un documento o en el resultado de una tool pueden dirigir al modelo; ningún prompt elimina ese riesgo.'),
          instead: B('Read-only tools by default, and approval before anything that changes data.', 'Tools de solo lectura por defecto, y aprobación antes de cualquier cosa que cambie datos.'),
        },
        {
          title: B('Facts that change every minute', 'Datos que cambian a cada minuto'),
          why: B('The model knows only what it saw in training, and an index is as old as its last load.', 'El modelo sabe solo lo que vio en el entrenamiento, y un índice tiene la edad de su última carga.'),
          instead: B('A tool that reads the live system at the time of the question.', 'Una tool que lee el sistema vivo en el momento de la pregunta.'),
        },
        {
          title: B('Secrets and personal data in the prompt', 'Secretos y datos personales en el prompt'),
          why: B('Whatever is in the context can come out in the answer, in a log or at a hosted provider.', 'Lo que está en el contexto puede salir en la respuesta, en un log o en un proveedor alojado.'),
          instead: B('Keep them out of the context; a local model when the data cannot leave your network.', 'Dejarlos fuera del contexto; un modelo local cuando los datos no pueden salir de tu red.'),
        },
      ],
    },
    decide: {
      title: B('How to decide', 'Cómo decidir'),
      questions: [
        B('Can a person check each answer quickly against a source?', '¿Una persona puede verificar cada respuesta rápido contra una fuente?'),
        B('Is a wrong answer now and then acceptable, or caught before it does harm?', '¿Una respuesta equivocada de vez en cuando es aceptable, o se detecta antes de que haga daño?'),
        B('Are the documents the model needs written down, current and yours to use?', '¿Los documentos que el modelo necesita están escritos, al día y son tuyos para usar?'),
        B('Can every action be read-only, or approved by a person before it runs?', '¿Cada acción puede ser de solo lectura, o aprobada por una persona antes de ejecutarse?'),
        B('Do you have a set of questions with known answers to measure the result?', '¿Tenés un conjunto de preguntas con respuestas conocidas para medir el resultado?'),
      ],
      closing: B(
        'Four yes answers and an assistant over your systems is worth building with evidence; fewer, and a search page or a script may serve better. Lesson 00 shows how the course works and leaves the model running.',
        'Cuatro síes y un asistente sobre tus sistemas vale la pena construirlo con evidencia; menos, y una página de búsqueda o un script pueden servir mejor. La lección 00 muestra cómo funciona el curso y deja el modelo corriendo.',
      ),
      start: B('Start with lesson 00', 'Empezá por la lección 00'),
      back: B('Back to the course', 'Volver al curso'),
    },
    sources: {
      title: B('Sources', 'Fuentes'),
      intro: B('Papers and official pages, checked on', 'Papers y páginas oficiales, contrastados el'),
      items: [
        ['Vaswani et al. · Attention Is All You Need (June 2017)', 'https://arxiv.org/abs/1706.03762'],
        ['Lewis et al. · Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks (2020)', 'https://arxiv.org/abs/2005.11401v4'],
        ['Ouyang et al. · Training language models to follow instructions with human feedback (March 2022)', 'https://arxiv.org/pdf/2203.02155'],
        ['llama.cpp · Wikipedia, with the first release and the GGUF format', 'https://en.wikipedia.org/wiki/Llama.cpp'],
        ['Anthropic · Donating the Model Context Protocol and establishing the Agentic AI Foundation (December 2025)', 'https://anthropic.com/news/donating-the-model-context-protocol-and-establishing-of-the-agentic-ai-foundation'],
        ['Model Context Protocol · Specification 2026-07-28', 'https://modelcontextprotocol.io/specification/2026-07-28'],
        ['Model Context Protocol · Changes in 2026-07-28', 'https://modelcontextprotocol.io/specification/2026-07-28/changelog'],
        ['OWASP · Top 10 for LLM applications', 'https://genai.owasp.org/llm-top-10/'],
      ],
    },
  };
})();
