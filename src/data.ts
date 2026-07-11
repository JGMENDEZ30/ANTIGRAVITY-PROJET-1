import { EraItem, Enigma, LogEntry, BadgeItem } from "./types";

export const INITIAL_ERAS: EraItem[] = [
  {
    id: "proto-slavic",
    title: "Orígenes Proto-Eslavos",
    era: "Hasta el Siglo VI d.C.",
    category: "Proto-Eslavo",
    description: "Rastrea el nacimiento de las lenguas eslavas desde sus raíces indoeuropeas comunes y la posterior evolución del proto-eslavo.",
    duration: "5 MINUTOS",
    badge: "Raíces",
    icon: "git-branch",
    insightTitle: "Perspectiva Lingüística",
    insightText: "La ley de sílabas abiertas reconfiguró el proto-eslavo temprano: todas las sílabas debían terminar en vocal, provocando la pérdida de consonantes finales y creando diptongos nasales únicos.",
    detailText: "El proto-eslavo comenzó como una rama de la familia indoeuropea. Durante milenios, el sistema experimentó transformaciones radicales, incluida la simplificación de clusters consonánticos y la asimilación de vocales. Alrededor del siglo VI, las migraciones de los pueblos eslavos fragmentaron esta unidad lingüística en tres subgrupos principales: occidental, meridional y oriental.",
  },
  {
    id: "old-east-slavic",
    title: "El Eslavo Oriental Antiguo y la Rus de Kiev",
    era: "Siglos IX - XIV d.C.",
    category: "Eslavo Oriental",
    description: "Explora la vibrante lengua vernácula de la Rus de Kiev, registrada de forma única en manuscritos de corteza de abedul de Nóvgorod.",
    duration: "6 MINUTOS",
    badge: "Edad Media",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDTGPchCe8j6so5WHtJ-E82RWzU5HEcy85bWgeR-n_IggTflQVJic_qz-sZY6o44N2GbFOwb8DbJp0JXQ_ZWW23caughMIcItkaPh5fihGysoI0DTLsnMUe5J-LAbSzDFoZ9oZ_J8LIUstvYfHJj9hV52O_POITlC6j3LXXBPLKJeoAxkHUhVxMVHDRripqvJU7huN-dJEBHNhURF43TN8ADWRwvJ3Lb3h2BXsLlXSi8kNMoXANt6i4ai4W_Wtp4aqGIqagvtBQwM2o",
    detailText: "El eslavo oriental antiguo era la lengua hablada en la Rus de Kiev, un vasto estado medieval confederado. Aunque existía una lengua literaria formal, las cartas de corteza de abedul descubiertas en Nóvgorod revelan que las personas comunes (comerciantes, campesinos, esposas) escribían cartas personales con un alto nivel de alfabetización utilizando su propio dialecto local, que ya mostraba diferencias fonéticas cruciales.",
  },
  {
    id: "church-slavonic",
    title: "La Influencia del Eslavo Eclesiástico",
    era: "Siglo IX en adelante",
    category: "Eslavo Eclesiástico",
    description: "Examina el inmenso impacto que tuvo el Antiguo Eslavo Eclesiástico (búlgaro antiguo) traído por Cirilo y Metodio en el vocabulario refinado del ruso.",
    duration: "4 MINUTOS",
    badge: "Eclesiástico",
    icon: "book-open",
    insightTitle: "Perspectiva Lingüística",
    insightText: "El eslavo eclesiástico aportó abstracción filosófica, mientras que el ruso vernáculo aportó los términos prácticos. Esto creó dobletes como 'глава' (glorioso/formal) frente a 'голова' (anatómico/nativo).",
    detailText: "El Antiguo Eslavo Eclesiástico fue codificado por los misioneros bizantinos Cirilo y Metodio para cristianizar a los pueblos eslavos. Al adoptarse en la Rus de Kiev, sirvió como lengua escrita sagrada e intelectual. Con el tiempo, el ruso absorbió miles de términos literarios, prefijos y sufijos de origen eslavo meridional, dotando a la lengua moderna de una sofisticada distinción estilística en su léxico actual.",
  },
  {
    id: "middle-russian",
    title: "La Época del Ruso Medio",
    era: "Siglos XIV - XVII d.C.",
    category: "Ruso Medio",
    description: "Descubre el periodo de fragmentación tras la caída de Kiev, la invasión mongola y el posterior surgimiento de dialectos regionales diferenciados.",
    duration: "5 MINUTOS",
    badge: "Transición",
    icon: "split",
    detailText: "La caída de la Rus de Kiev ante la invasión mongola rompió la relativa homogeneidad del eslavo oriental antiguo. Durante este oscuro período, los dialectos occidentales evolucionaron de forma independiente hacia el bielorruso y el ucraniano, mientras que los dialectos del noreste (bajo la órbita de Vladimir y posteriormente de Moscú) sufrieron simplificaciones morfológicas y fonéticas complejas, preparando el terreno para el ruso medio.",
  },
  {
    id: "moscow-dialect",
    title: "El Surgimiento del Dialecto de Moscú",
    era: "Siglos XIV - XVIII d.C.",
    category: "Dialecto de Moscú",
    description: "Aprende cómo la preeminencia política del Gran Ducado de Moscú consolidó su dialecto local (akan'e) como la base indiscutible del ruso oficial.",
    duration: "4 MINUTOS",
    badge: "Consolidación",
    icon: "crown",
    insightTitle: "Perspectiva Lingüística",
    insightText: "Moscú se encontraba en la zona de transición entre el norte y el sur. Adoptó la pronunciación de las 'o' no acentuadas como 'a' (akan'e) del sur, combinada con la consonante 'g' oclusiva del norte.",
    detailText: "A medida que Moscú crecía en poder, los escribas de su cancillería estatal difundían directivas oficiales escritas en su dialecto regional. El dialecto moscovita era de transición: compartía la pronunciación de las sílabas no acentuadas del sur ('akan'e') y la fonética consonántica fuerte del norte. El prestigio administrativo de Moscovia obligó a los demás territorios a emular este dialecto, sentando las bases del ruso literario moderno.",
  },
  {
    id: "modern-russian",
    title: "La Edad de Oro y el Ruso Moderno",
    era: "Siglos XVIII - XIX d.C.",
    category: "Ruso Moderno",
    description: "Explora la gran estandarización literaria liderada por Mijaíl Lomonósov y culminada por el genio lírico de Aleksandr Pushkin.",
    duration: "7 MINUTOS",
    badge: "Estandarización",
    icon: "feather",
    insightTitle: "Perspectiva Lingüística",
    insightText: "Pushkin unificó el eslavo eclesiástico refinado, la influencia aristocrática francesa y el lenguaje crudo y expresivo de los campesinos locales, naciendo así la sintaxis ágil del ruso moderno.",
    detailText: "En el siglo XVIII, el científico y gramático Mijaíl Lomonósov formuló la teoría de los 'tres estilos' del ruso. Pedro el Grande reformó el alfabeto retirando grafías redundantes. Finalmente, en el siglo XIX, Aleksandr Pushkin rompió las viejas rigideces clasicistas y fusionó de forma genial el ruso vernáculo coloquial con los elementos elevados del eslavo eclesiástico, definiendo la lengua rica y melódica que hoy conocemos.",
  }
];

export const INITIAL_ENIGMAS: Enigma[] = [
  {
    id: "enigma-yers",
    title: "La Caída de los Yers (ъ, ь)",
    description: "¿Por qué desaparecieron estas misteriosas vocales ultracortas en el ruso antiguo y cómo reconfiguraron la fonética actual?",
    insightTitle: "Ley de Sílabas Abiertas",
    insightText: "La caída de los yers (ъ, ь) eliminó miles de vocales cortas a finales del siglo XII. Esto desencadenó la alternancia vocálica actual (ej: день -> дня) y la palatalización sistemática de las consonantes rusas.",
    icon: "sparkles",
    sampleText: "сьнь (sueño / son) -> сон / сна\nдьнь (día) -> день / дня"
  },
  {
    id: "enigma-pleofonia",
    title: "El Enigma de la Pleofonía (Polnoglasie)",
    description: "¿Por qué el ruso tiene palabras dobles para el mismo concepto (ej. cabeza: голова vs. глава)?",
    insightTitle: "Eslavo Oriental vs. Eclesiástico",
    insightText: "La pleofonía (polnoglasie) es el sello de las lenguas eslavas orientales nativas: insertan vocales entre consonantes líquidas (oro/ere/olo/ele), mientras que el eslavo meridional (eclesiástico) las contrae (ra/re/la/le).",
    icon: "music",
    sampleText: "голова (ruso nativo) vs. глава (eslavo eclesiástico)\nгород (ruso nativo) vs. град (eslavo eclesiástico)"
  },
  {
    id: "enigma-reformas",
    title: "La Reforma de Pedro el Grande",
    description: "¿Por qué el Zar Pedro el Grande secularizó drásticamente el alfabeto en 1708 eliminando letras ornamentales?",
    insightTitle: "Letras Civiles (Grazhdansky Shrift)",
    insightText: "Pedro el Grande introdujo las 'Letras Civiles' para facilitar la imprenta laica de libros de ciencia y navegación, separando formalmente la lengua religiosa (eslavo eclesiástico) de la administración del imperio.",
    icon: "pen-tool",
    sampleText: "Eliminación de omega (ω), psi (ψ) y simplificación de las letras cirílicas ornamentales medievales a moldes geométricos de estilo romano."
  }
];

export const INITIAL_LOGS: LogEntry[] = [
  {
    id: "log-1",
    title: "Análisis de la Pleofonía",
    resolved: true,
    time: "Hace 10 min",
    description: "Comparaste las raíces nativas 'город' con la eclesiástica 'град' usando el transformador.",
    icon: "check-circle"
  },
  {
    id: "log-2",
    title: "Orígenes Proto-Eslavos",
    resolved: true,
    time: "Hoy",
    description: "Completaste la lectura interactiva de las migraciones eslavas del siglo VI.",
    icon: "book"
  },
  {
    id: "log-3",
    title: "Reforma del Zar Pedro",
    resolved: true,
    time: "Ayer",
    description: "Analizaste el impacto de la introducción de las Letras Civiles del siglo XVIII.",
    icon: "check-circle"
  }
];

export const INITIAL_BADGES: BadgeItem[] = [
  {
    id: "badge-1",
    title: "Descifrador de Manuscritos",
    unlocked: true,
    icon: "feather",
    description: "Analizaste con éxito un texto eslavo medieval usando inteligencia artificial."
  },
  {
    id: "badge-2",
    title: "Escribano Imperial",
    unlocked: true,
    icon: "award",
    description: "Completaste lecturas profundas en tres épocas lingüísticas diferentes."
  },
  {
    id: "badge-3",
    title: "Linguista de Moscovia",
    unlocked: false,
    icon: "lock",
    description: "Desbloquéalo al resolver el misterio del surgimiento de la dinastía moscovita."
  },
  {
    id: "badge-4",
    title: "Catedrático de Pushkin",
    unlocked: false,
    icon: "lock",
    description: "Desbloquéalo completando la estandarización final de la Edad de Oro literaria rusa."
  }
];
