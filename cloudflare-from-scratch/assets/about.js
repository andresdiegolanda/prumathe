/* The "What Cloudflare is" page: what it is, where it came from, where it fits and where it does
   not. Read once, before lesson 00. Bilingual like the curriculum; scripts/build.mjs puts it in
   what-cloudflare-is.html and in the course notes, scripts/check.mjs verifies it. Facts come from the
   sources listed at the end; the "where it does not fit" part is the course's own judgment and says so. */
window.CF_ABOUT = (() => {
  const B = (en, es) => ({ en, es });
  return {
    eyebrow: B('A FIVE MINUTE READ', 'CINCO MINUTOS DE LECTURA'),
    title: B('What Cloudflare is', 'Qué es Cloudflare'),
    lead: B(
      'What it is, where it came from, where it fits and where it does not. Read it once; the lessons and the map do the rest.',
      'Qué es, de dónde salió, dónde encaja y dónde no. Se lee una vez; el resto lo hacen las lecciones y el mapa.',
    ),
    what: {
      title: B('A network in front of your application, and a place to run code in it', 'Una red delante de tu aplicación, y un lugar donde correr código en ella'),
      text: [
        B(
          'Cloudflare runs a global network of data centers, 348 cities on its network map when this course was checked. For a domain you add to it, its DNS answers with addresses of that network, so requests from your users reach a nearby data center first. There the edge ends TLS, applies your rules, serves what it has cached and forwards the rest to your server, the origin. Your origin keeps doing its work; the edge decides what reaches it.',
          'Cloudflare opera una red global de data centers, 348 ciudades en su mapa de red cuando se verificó este curso. Para un dominio que le agregás, su DNS responde con direcciones de esa red, así los pedidos de tus usuarios llegan primero a un data center cercano. Ahí el borde termina TLS, aplica tus reglas, sirve lo que tiene en cache y reenvía el resto a tu servidor, el origen. Tu origen sigue haciendo su trabajo; el borde decide qué le llega.',
        ),
        B(
          'The same network runs your code. A Worker is JavaScript or TypeScript, or Python, Rust and other languages through WebAssembly, that runs in a V8 isolate in each data center, with bindings to storage of its own: KV, D1, R2, Durable Objects, Queues, Workflows, and Hyperdrive to reach your own database. Java does not run in Workers, so in this course Java stays where it belongs: in the origin.',
          'La misma red corre tu código. Un Worker es JavaScript o TypeScript, o Python, Rust y otros lenguajes por WebAssembly, que corre en un isolate de V8 en cada data center, con bindings a almacenamiento propio: KV, D1, R2, Durable Objects, Queues, Workflows, e Hyperdrive para llegar a tu propia base. Java no corre en Workers, así que en este curso Java queda donde corresponde: en el origen.',
        ),
      ],
      rule: B('The edge decides what reaches your origin; Workers decide what the edge does.', 'El borde decide qué llega a tu origen; los Workers deciden qué hace el borde.'),
      modelNote: B('The model of lesson 01: one address, many data centers. Move the client.', 'El modelo de la lección 01: una dirección, muchos data centers. Mové al cliente.'),
    },
    origin: {
      title: B('From a spam trap to a platform', 'De una trampa para spam a una plataforma'),
      text: [
        B(
          'Cloudflare grew out of Project Honey Pot, started in 2004 by Matthew Prince and Lee Holloway to find out where email spam came from. With Michelle Zatlyn they founded Cloudflare in 2009 and launched it in public in 2010. The first product protected and sped up websites by standing in front of them; running code in that same position came seven years later.',
          'Cloudflare salió de Project Honey Pot, que Matthew Prince y Lee Holloway arrancaron en 2004 para averiguar de dónde venía el spam. Con Michelle Zatlyn fundaron Cloudflare en 2009 y lo lanzaron en público en 2010. El primer producto protegía y aceleraba sitios poniéndose delante de ellos; correr código en esa misma posición llegó siete años después.',
        ),
      ],
      timeline: [
        { year: '2009', label: B('Founded', 'Fundación'), text: B('Matthew Prince, Michelle Zatlyn and Lee Holloway, after Project Honey Pot.', 'Matthew Prince, Michelle Zatlyn y Lee Holloway, después de Project Honey Pot.') },
        { year: '2010', label: B('Public launch', 'Lanzamiento'), text: B('27 September, at TechCrunch Disrupt in San Francisco.', '27 de septiembre, en TechCrunch Disrupt, en San Francisco.') },
        { year: '2017', label: B('Workers', 'Workers'), text: B('29 September: JavaScript at the edge, on V8, with an API like Service Workers.', '29 de septiembre: JavaScript en el borde, sobre V8, con una API como la de Service Workers.') },
        { year: '2019', label: B('Listed', 'Cotización'), text: B('13 September, on the New York Stock Exchange as NET.', '13 de septiembre, en la Bolsa de Nueva York como NET.') },
        { year: '2020', label: B('Durable Objects', 'Durable Objects'), text: B('28 September: state with a single owner, at the edge.', '28 de septiembre: estado con un solo dueño, en el borde.') },
        { year: '2026', label: B('cf', 'cf'), text: B('28 September: a command line for the whole API, in open beta; Wrangler will follow it.', '28 de septiembre: una línea de comandos para toda la API, en beta abierta; Wrangler la va a seguir.') },
      ],
    },
    fits: {
      title: B('Where it fits', 'Dónde encaja'),
      intro: B('Cases where putting Cloudflare in front, or running code on it, pays off.', 'Casos en los que poner Cloudflare delante, o correr código en él, conviene.'),
      items: [
        { title: B('A public site or API', 'Un sitio o una API pública'), text: B('TLS, cache of what is the same for everyone, rules and rate limits before your servers, with the origin address out of DNS.', 'TLS, cache de lo que es igual para todos, reglas y rate limits antes de tus servidores, con la dirección del origen fuera del DNS.') },
        { title: B('An origin with no open ports', 'Un origen sin puertos abiertos'), text: B('A tunnel publishes a service from a private network, and Access asks for identity in front of internal tools.', 'Un túnel publica un servicio desde una red privada, y Access pide identidad delante de herramientas internas.') },
        { title: B('Logic close to the user', 'Lógica cerca del usuario'), text: B('Redirects, headers, A/B tests, authentication checks and small APIs that answer from the data center that received the request.', 'Redirecciones, encabezados, pruebas A/B, verificaciones de autenticación y APIs chicas que responden desde el data center que recibió el pedido.') },
        { title: B('Webhooks and bursts', 'Webhooks y ráfagas'), text: B('Accept at once, queue, and process at your own pace with retries and a dead letter queue.', 'Aceptar enseguida, encolar y procesar a tu ritmo con reintentos y una cola de mensajes muertos.') },
        { title: B('State per thing', 'Estado por cosa'), text: B('Counters, sessions, rooms and live status, one Durable Object per entity.', 'Contadores, sesiones, salas y estados en vivo, un Durable Object por entidad.') },
        { title: B('Files to many readers', 'Archivos para muchos lectores'), text: B('Objects in R2 served from the edge, with no egress fees.', 'Objetos en R2 servidos desde el borde, sin costo de salida.') },
      ],
    },
    misfits: {
      title: B('Where it does not', 'Dónde no'),
      intro: B('The course judgment, from the limits in the documentation: cases where something else does the job better.', 'El criterio del curso, a partir de los límites de la documentación: casos en los que otra cosa hace mejor el trabajo.'),
      headers: [B('Case', 'Caso'), B('Why not', 'Por qué no'), B('Instead', 'En cambio')],
      items: [
        { title: B('Heavy or long computation', 'Cálculo pesado o largo'), why: B('A request gets 10 ms of CPU on the free plan and 5 minutes at most on the paid one.', 'Un pedido tiene 10 ms de CPU en el plan gratuito y 5 minutos como máximo en el pago.'), instead: B('Your servers or containers, fed by a queue.', 'Tus servidores o contenedores, alimentados por una cola.') },
        { title: B('Your Java and Spring code', 'Tu código Java y Spring'), why: B('Java does not run in Workers.', 'Java no corre en Workers.'), instead: B('The origin, with the edge in front.', 'El origen, con el borde delante.') },
        { title: B('A large relational database', 'Una base relacional grande'), why: B('D1 is SQLite per database, with a single primary for writes.', 'D1 es SQLite por base, con una sola principal para las escrituras.'), instead: B('Your PostgreSQL or MySQL, reached through Hyperdrive.', 'Tu PostgreSQL o MySQL, alcanzado por Hyperdrive.') },
        { title: B('Counters and coordination in KV', 'Contadores y coordinación en KV'), why: B('KV is eventually consistent and has no atomic operations.', 'KV es eventualmente consistente y no tiene operaciones atómicas.'), instead: B('A Durable Object per counter.', 'Un Durable Object por contador.') },
        { title: B('Anything personal in a shared cache', 'Cualquier cosa personal en una cache compartida'), why: B('The default cache key has no user in it.', 'La clave de cache por defecto no tiene usuario.'), instead: B('private or no-store, and cache only what is the same for everyone.', 'private o no-store, y guardar solo lo que es igual para todos.') },
      ],
    },
    decide: {
      title: B('Five questions before you put it in front', 'Cinco preguntas antes de ponerlo delante'),
      questions: [
        B('Which requests must never reach my origin, and which must always?', '¿Qué pedidos no tienen que llegar nunca a mi origen, y cuáles siempre?'),
        B('What is the same for everyone, and can be cached, and what is personal?', '¿Qué es igual para todos, y se puede guardar, y qué es personal?'),
        B('Can someone reach my origin without going through the edge?', '¿Alguien puede llegar a mi origen sin pasar por el borde?'),
        B('What does each piece of state need: speed of reading, one owner, SQL or files?', '¿Qué necesita cada pieza de estado: lectura rápida, un dueño, SQL o archivos?'),
        B('What fits the free plan, and what would I pay for?', '¿Qué entra en el plan gratuito, y por qué pagaría?'),
      ],
      closing: B('The course answers each one with a command you can run, on your machine.', 'El curso responde cada una con un comando que podés ejecutar, en tu máquina.'),
      start: B('Start lesson 00', 'Empezá la lección 00'),
      back: B('Back to the course', 'Volvé al curso'),
    },
    sources: {
      title: B('Sources', 'Fuentes'),
      intro: B('Checked on', 'Verificadas el'),
      items: [
        ['Cloudflare: our story', 'https://www.cloudflare.com/our-story'],
        ['Cloudflare: global network map', 'https://www.cloudflare.com/network-map/'],
        ['Introducing Cloudflare Workers (2017)', 'https://www.blog.cloudflare.com/introducing-cloudflare-workers'],
        ['Workers Durable Objects beta (2020)', 'https://www.blog.cloudflare.com/introducing-workers-durable-objects'],
        ['The cf command line (2026)', 'https://blog.cloudflare.com/cloudflare-cf-cli-launch/'],
        ['Cloudflare Workers: languages', 'https://developers.cloudflare.com/workers/languages/'],
        ['Cloudflare Workers: limits', 'https://developers.cloudflare.com/workers/platform/limits'],
      ],
    },
  };
})();
