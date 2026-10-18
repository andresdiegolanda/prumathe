window.DK_REFERENCE = {
  "sources": {
    "kind": [
      "kind quick start",
      "https://kind.sigs.k8s.io/docs/user/quick-start/"
    ],
    "container": [
      "Docker: what is a container?",
      "https://docs.docker.com/get-started/docker-concepts/the-basics/what-is-a-container/"
    ],
    "lifecycle": [
      "Docker: running containers",
      "https://docs.docker.com/engine/containers/run/"
    ],
    "image": [
      "Docker: what is an image?",
      "https://docs.docker.com/get-started/docker-concepts/the-basics/what-is-an-image/"
    ],
    "build": [
      "Docker build best practices",
      "https://docs.docker.com/build/building/best-practices/"
    ],
    "volume": [
      "Docker volumes",
      "https://docs.docker.com/engine/storage/volumes/"
    ],
    "network": [
      "Docker networking",
      "https://docs.docker.com/engine/network/"
    ],
    "ports": [
      "Docker port publishing",
      "https://docs.docker.com/engine/network/port-publishing/"
    ],
    "compose": [
      "Compose startup order and readiness",
      "https://docs.docker.com/compose/how-tos/startup-order/"
    ],
    "secrets": [
      "Compose secrets",
      "https://docs.docker.com/compose/how-tos/use-secrets/"
    ],
    "resources": [
      "Docker resource constraints",
      "https://docs.docker.com/engine/containers/resource_constraints/"
    ],
    "tag": [
      "Docker · docker image tag",
      "https://docs.docker.com/reference/cli/docker/image/tag/"
    ],
    "healthcheck": [
      "Dockerfile · HEALTHCHECK",
      "https://docs.docker.com/reference/dockerfile/#healthcheck"
    ],
    "logs": [
      "Docker logging",
      "https://docs.docker.com/engine/logging/"
    ],
    "architecture": [
      "Kubernetes architecture",
      "https://kubernetes.io/docs/concepts/architecture/"
    ],
    "pods": [
      "Kubernetes Pods",
      "https://kubernetes.io/docs/concepts/workloads/pods/"
    ],
    "controllers": [
      "Kubernetes controllers",
      "https://kubernetes.io/docs/concepts/architecture/controller/"
    ],
    "deployment": [
      "Kubernetes Deployments",
      "https://kubernetes.io/docs/concepts/workloads/controllers/deployment/"
    ],
    "service": [
      "Kubernetes Services",
      "https://kubernetes.io/docs/concepts/services-networking/service/"
    ],
    "configmap": [
      "Kubernetes ConfigMaps",
      "https://kubernetes.io/docs/concepts/configuration/configmap/"
    ],
    "secret": [
      "Kubernetes Secrets",
      "https://kubernetes.io/docs/concepts/configuration/secret/"
    ],
    "pv": [
      "Kubernetes persistent volumes",
      "https://kubernetes.io/docs/concepts/storage/persistent-volumes/"
    ],
    "probes": [
      "Kubernetes probes",
      "https://kubernetes.io/docs/concepts/workloads/pods/probes/"
    ],
    "kresources": [
      "Kubernetes resource management",
      "https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/"
    ],
    "rbac": [
      "Kubernetes RBAC",
      "https://kubernetes.io/docs/reference/access-authn-authz/rbac/"
    ]
  },
  "glossary": [
    [
      "Container",
      "Contenedor",
      "A process with isolated views and runtime boundaries.",
      "Un proceso con vistas aisladas y límites de ejecución.",
      1
    ],
    [
      "Kernel",
      "Kernel",
      "The operating system core shared by Linux containers on a Linux host.",
      "El núcleo del sistema operativo que comparten los contenedores Linux en un host Linux.",
      1
    ],
    [
      "Namespace (Linux)",
      "Namespace (Linux)",
      "A mechanism that isolates a view of resources such as processes or networking.",
      "Un mecanismo que aísla una vista de recursos, como procesos o red.",
      1
    ],
    [
      "Writable layer",
      "Capa escribible",
      "Per-container filesystem changes removed with that container.",
      "Cambios de archivos por contenedor que se eliminan al borrarlo.",
      2
    ],
    [
      "Image",
      "Imagen",
      "Filesystem layers and runtime defaults used to create containers.",
      "Capas de archivos y valores por defecto usados para crear contenedores.",
      3
    ],
    [
      "Layer",
      "Capa",
      "A filesystem change set in an image; later layers can mask earlier content.",
      "Un conjunto de cambios de archivos; capas posteriores pueden ocultar contenido anterior.",
      3
    ],
    [
      "Build context",
      "Contexto de build",
      "The selected input directory available to the build.",
      "El directorio de entrada elegido y disponible para el build.",
      4
    ],
    [
      "Dockerfile",
      "Dockerfile",
      "Instructions that define how to build an image.",
      "Instrucciones que definen cómo construir una imagen.",
      4
    ],
    [
      "Build cache",
      "Caché de build",
      "Reusable results for eligible unchanged build steps and inputs.",
      "Resultados reutilizables para pasos e insumos elegibles sin cambios.",
      4
    ],
    [
      "Volume",
      "Volumen",
      "Docker-managed storage whose lifecycle can outlast one container.",
      "Almacenamiento administrado por Docker que puede sobrevivir a un contenedor.",
      5
    ],
    [
      "Bind mount",
      "Bind mount",
      "A specified host path mounted into a container.",
      "Una ruta específica del host montada dentro del contenedor.",
      5
    ],
    [
      "DNS",
      "DNS",
      "Name resolution within a defined naming and network scope.",
      "Resolución de nombres dentro de un ámbito definido de nombres y de red.",
      6
    ],
    [
      "Port publishing",
      "Publicación de puertos",
      "Mapping a host endpoint to a container port.",
      "Mapeo de un endpoint del host a un puerto del contenedor.",
      7
    ],
    [
      "Compose",
      "Compose",
      "A tool for defining and running a multi-container application on Docker.",
      "Una herramienta para definir y ejecutar aplicaciones de varios contenedores en Docker.",
      8
    ],
    [
      "Environment variable",
      "Variable de entorno",
      "A named value supplied to a process when it starts.",
      "Un valor con nombre entregado a un proceso al arrancar.",
      9
    ],
    [
      "Health check",
      "Comprobación de salud",
      "A configured probe of one property, not a proof of all behavior.",
      "Una sonda de una propiedad configurada, no prueba de todo comportamiento.",
      10
    ],
    [
      "Tag",
      "Tag",
      "A mutable readable reference to an image.",
      "Una referencia legible y mutable a una imagen.",
      11
    ],
    [
      "Digest",
      "Digest",
      "A content-derived identifier for an object in a registry.",
      "Un identificador derivado del contenido para un objeto de registro.",
      11
    ],
    [
      "Registry",
      "Registro",
      "A service for distributing and storing image artifacts.",
      "Un servicio para distribuir y guardar artefactos de imagen.",
      11
    ],
    [
      "Control plane",
      "Plano de control",
      "Components that expose the API and coordinate desired state.",
      "Componentes que exponen la API y coordinan estado deseado.",
      13
    ],
    [
      "Node",
      "Nodo",
      "A machine whose runtime and kubelet execute assigned Pods.",
      "Una máquina cuyo runtime y kubelet ejecutan Pods asignados.",
      13
    ],
    [
      "kubelet",
      "kubelet",
      "The node agent that manages the local execution of Pods.",
      "El agente del nodo que administra la ejecución local de Pods.",
      13
    ],
    [
      "Context",
      "Contexto",
      "A kubeconfig selection of cluster, user and optional namespace.",
      "Una selección de clúster, usuario y namespace opcional en kubeconfig.",
      13
    ],
    [
      "Namespace (Kubernetes)",
      "Namespace (Kubernetes)",
      "An API scope for names and namespaced resources, distinct from Linux namespaces.",
      "Un ámbito de API para nombres y recursos con namespace, distinto de namespaces Linux.",
      13
    ],
    [
      "Pod",
      "Pod",
      "One or more co-scheduled containers sharing a network namespace and declared volumes.",
      "Uno o más contenedores ubicados juntos que comparten red y volúmenes declarados.",
      14
    ],
    [
      "Reconciliation",
      "Reconciliación",
      "Repeated actions that try to bring observed state toward desired state.",
      "Acciones repetidas que buscan acercar estado observado al deseado.",
      15
    ],
    [
      "Deployment",
      "Deployment",
      "A controller for updating and maintaining replicated Pod templates through ReplicaSets.",
      "Un controlador que actualiza y mantiene plantillas replicadas mediante ReplicaSets.",
      16
    ],
    [
      "ReplicaSet",
      "ReplicaSet",
      "A controller that maintains a desired number of matching Pods.",
      "Un controlador que mantiene una cantidad deseada de Pods coincidentes.",
      16
    ],
    [
      "Service",
      "Service",
      "A stable access abstraction for a changing set of selected backends.",
      "Una abstracción estable de acceso para destinos seleccionados que cambian.",
      17
    ],
    [
      "EndpointSlice",
      "EndpointSlice",
      "An API object recording backend endpoints and their conditions.",
      "Un objeto de API que registra endpoints de destino y sus condiciones.",
      17
    ],
    [
      "ConfigMap",
      "ConfigMap",
      "An object for non-confidential application configuration.",
      "Un objeto para configuración no confidencial.",
      18
    ],
    [
      "Secret",
      "Secret",
      "An API object for sensitive values; base64 encoding is not encryption.",
      "Un objeto para valores sensibles; base64 no es cifrado.",
      18
    ],
    [
      "PVC",
      "PVC",
      "A PersistentVolumeClaim requests storage with capacity and access requirements.",
      "Un PersistentVolumeClaim pide almacenamiento con capacidad y acceso requeridos.",
      19
    ],
    [
      "Readiness",
      "Readiness",
      "A signal for whether an instance should receive normal Service traffic.",
      "Una señal que indica si una instancia debería recibir tráfico normal del Service.",
      20
    ],
    [
      "Liveness",
      "Liveness",
      "A probe used to decide whether a container needs restarting.",
      "Una sonda para decidir si un contenedor necesita reiniciarse.",
      20
    ],
    [
      "Request",
      "Request",
      "A declared resource need considered during scheduling.",
      "Una necesidad de recursos declarada que se considera en el scheduling.",
      21
    ],
    [
      "Limit",
      "Limit",
      "A configured runtime ceiling, distinct from a scheduling request.",
      "Un techo configurado de ejecución, distinto del request de scheduling.",
      21
    ],
    [
      "Rollout",
      "Rollout",
      "The observed transition of workload instances to a new template revision.",
      "La transición observada de instancias a otra revisión de plantilla.",
      22
    ],
    [
      "RBAC",
      "RBAC",
      "Authorization by roles, resources, verbs and subject bindings.",
      "Autorización mediante roles, recursos, verbos y vínculos con sujetos.",
      23
    ],
    [
      "ServiceAccount",
      "ServiceAccount",
      "An identity for workloads that access the Kubernetes API.",
      "Una identidad para cargas que acceden a la API de Kubernetes.",
      23
    ]
  ]
};
