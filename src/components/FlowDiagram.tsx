import { useCallback, useState, useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  MarkerType,
  useNodesState,
  useEdgesState,
  NodeMouseHandler,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { CustomNode } from './CustomNode';
import { CustomEdge } from './CustomEdge';

const nodeTypes = {
  custom: CustomNode,
};

const edgeTypes = {
  custom: CustomEdge,
};

const initialNodes = [
  { id: '1', type: 'custom', position: { x: 0, y: 0 }, data: { label: 'Palabra oída', category: 'io', hideHandles: true } },
  { id: '6', type: 'custom', position: { x: 1200, y: 0 }, data: { label: 'Palabra leída', category: 'io', hideHandles: true } },
  
  { id: '2', type: 'custom', position: { x: 0, y: 200 }, data: { 
    label: 'Análisis acústico', 
    category: 'input-process', 
    extendedFunction: [
      'Aísla características acústicas fundamentales como la sonoridad, el punto y el modo de articulación.',
      'Realiza una abstracción y segmentación fonémica de los sonidos del habla.',
      'Procesa la señal física sonora continua mediante un tratamiento fonético preléxico.',
      'Funciona independientemente del tono, timbre o volumen específico del hablante.'
    ],
    expandedDetails: {
      description: 'El primer estadio de percepción del habla es el análisis acústico, el cual aísla y decodifica las características elementales de la onda sonora física. Transforma esta señal fonética (con alta variabilidad dependiendo de quién pronuncie, con qué entonación y velocidad) en representaciones auditivas normalizadas y estables.',
      function: {
        title: 'Decodificación Acústico-Fonética',
        text: 'Su principal tarea es segmentar el estímulo acústico continuo inhibiendo el ruido ambiental, para abstraer de forma exclusiva las características verbales y subyacentes del lenguaje hablado. Actúa analizando rasgos distintivos fundamentales.',
        list: [
          'Abstracción fonémica superando la inmensa variabilidad de la entonación y el timbre del locutor.',
          'Identificación pre-léxica de parámetros como sonoridad, punto y modo de articulación.',
          'Opera procesando y trozando en unidades el flujo continuo y veloz de entrada oral.'
        ]
      },
      deficit: {
        diagnosis: 'Sordera Verbal Pura',
        text: 'Si el deterioro compromete exclusivamente esta etapa fundamental del análisis de las ondas sonoras lingüísticas, el cuadro neurológico se identifica como Sordera Verbal Pura. Este síndrome disocia la audición humana: oyen cualquier ruido pero no decodifican la voz.',
        list: [
          'Audición y reconocimiento intacto de ruidos cotidianos (el claxon de un auto, ladridos, música).',
          'Sensación clínica referida por el paciente de escuchar "idiomas extranjeros o murmullos ininteligibles".',
          'Incapacidad rotunda para repetir bajo dictado, pese a comprender perfectamente la lectura y tener escritura y habla espontánea preservadas.'
        ],
        test: 'Discriminación de pares mínimos de fonemas verbales auditivamente, sin apoyo labio-facial.'
      }
    }
  } },
  { id: '7', type: 'custom', position: { x: 1200, y: 200 }, data: { 
    label: 'Análisis visual', 
    category: 'input-process', 
    extendedFunction: [
      'Decodifica el estímulo abstrayéndolo de variables tipográficas, formato o casos (mayúsculas/minúsculas).',
      'Realiza el procesamiento perceptivo de los grafemas detectando rasgos, líneas e intersecciones.',
      'Utiliza plantillas mentales o análisis de rasgos visuales para su reconocimiento.'
    ],
    expandedDetails: {
      description: 'El subcomponente primordial de la lectura se encarga de las tareas perceptivas visuales. Su labor es procesar y homogeneizar el intrincado mundo gráfico que conforma las palabras escritas para que el sistema lingüístico pueda integrarlas y leerlas.',
      function: {
        title: 'Reconocimiento y Segmentación de Grafemas',
        text: 'Efectúa un estudio y abstracción profunda donde percibe los grafemas dejando de lado la influencia de componentes superficiales y estilísticos. Las formas y los trazos convergen y se agrupan en identidades estables (letras de nuestro abecedario).',
        list: [
          'Transcodifica líneas, curvas e intersecciones convirtiendo la impresión visual en secuencias de letras y grafemas.',
          'Opera superando cambios superficiales del mundo exterior (tipografías como imprenta, manuscrita, tamaños o cursivas).',
          'Abastece el pasaje necesario y la base para una posible lectura rápida o una lectura a través del sonido de las letras.'
        ]
      },
      deficit: {
        diagnosis: 'Alexia Pura (Ceguera verbal sin agrafia)',
        text: 'Cuando se produce un daño en este componente que priva de transmitir información visual a los módulos léxicos y semánticos, aparece la alexia pura. En este déficit, la persona se ve obligada desesperadamente a individualizar una por una cada letra visual.',
        list: [
          'Pérdida trágica del reconocimiento visual "al vuelo" o pre-masticado de una palabra entera.',
          'Lectura silabeante y "letra a letra", extremadamente lenta y dependiente de un conteo exhaustivo visual extenuante.',
          'Preservación plena de su comprensión verbal y su escritura manuscrita y ortográfica.'
        ],
        test: 'Evaluaciones precisas temporizadas con palabras de variada longitud y contraste visuo-verbal y comprensión intacta.'
      }
    }
  } },
  
  { id: '3', type: 'custom', position: { x: 300, y: 400 }, data: { 
    label: 'Léxico auditivo', 
    category: 'lexicon', 
    extendedFunction: [
      'Selecciona la palabra correcta entre posibles "vecinos léxicos" mediante modelos interactivos y de activación.',
      'Permite constatar velozmente la validez léxica de las entradas auditivas e identificarlas.',
      'Almacena las huellas sonoras de las palabras estructuradas y conocidas del idioma.'
    ],
    expandedDetails: {
      description: 'El Léxico Auditivo actúa a la manera de un gran archivo pasivo ("diccionario auditivo mental") donde están almacenadas las identidades fonológicas globales y estructuradas de todas las palabras que la persona incorporó oralmente durante su ciclo vital.',
      function: {
        title: 'Base de Datos Acústico-Léxica',
        text: 'Su misión exclusiva es la "decisión y detección de léxico". Escanea implacablemente los fonemas de entrada de cada vocablo y coteja sus umbrales para determinar si esa palabra forma parte del repertorio aprendido de la lengua o si, por el contrario, es una palabra desconocida o inexistente.',
        list: [
          'Actúa bajo lógicas probabilísticas y de familiaridad: a medida que escuchamos la sílaba, descarta otras acepciones y encierra lo escuchado.',
          'Soporta el "Efecto de Frecuencia": los vocablos muy escuchados se encienden con un umbral mucho más bajo, resultando más rápidos de distinguir.',
          'Funciona discriminado de su significado: aquí sólo sabemos que esa palabra existe sin ahondar en su concepto puramente.'
        ]
      },
      deficit: {
        diagnosis: 'Sordera para la forma de las palabras',
        text: 'La caída de las representaciones en el Léxico de entrada fomenta el síndrome denominado "ceguera léxica o sordera para la conformación de la palabra". El individuo preserva la mecánica oyente e incluso discrimina consonantes, pero tiene destrozado su diccionario acústico.',
        list: [
          'Experimenta las palabras de su propio idioma cual si estuviera en un ambiente repleto de dialectos y vocabularios extranjeros jamás escuchados.',
          'Anula por completo cualquier fenómeno de ventaja en vocablos usuales (ausencia de efecto de frecuencia).',
          'Suele repetir mediante rutas mecánicas (como un papagayo) de fonema-articulación careciendo de todo saber de familiaridad referencial.'
        ],
        test: 'Tarea de decisión léxica auditiva (semejante a un "verdadero o falso").'
      }
    }
  } },
  { id: '8', type: 'custom', position: { x: 900, y: 400 }, data: { 
    label: 'Léxico visual', 
    category: 'lexicon', 
    extendedFunction: [
      'Reconoce la palabra escrita al instante analizando el bloque total y general.',
      'Sustenta la base cognitiva material de la lectura fluida, rápida y profunda ("ruta directa").',
      'Aloja los "moldes visuales" familiares de la ortografía adquiridos durante la alfabetización.'
    ],
    expandedDetails: {
      description: 'Esta estructura conforma el diccionario de entrada para la modalidad de la lectura experta, madurada luego de amplios procesos de lecto-escritura en el niño y el infante. Permite que, como adultos, veamos e identifiquemos una palabra casi imperceptiblemente.',
      function: {
        title: 'Reconocimiento Holístico de la Fachada',
        text: 'La lectura madura carece de deletreo y decodificaciones silábicas tortuosas gracias a este léxico visual. Nos dota para ver "ÁRBOL" como una pintura fotográfica entera conocida (holística). Así, saltamos al entendimiento superior con inusitada celeridad lectora.',
        list: [
          'Posee umbrales que premian las altas frecuencias, facilitándonos leer instantáneamente palabras hiper-conocidas.',
          'Garantiza descifrar homófonos (palabras que suenan igual pero escriben distinto, como HIERBA / HIERVA), sorteando confusiones fonológicas.',
          'Prepara la vía directa, logrando leer sin someter a fonemas obligados los vocablos percibidos.'
        ]
      },
      deficit: {
        diagnosis: 'Dislexia Superficial de Input',
        text: 'A raíz de una pérdida en los almacenes visuales del cerebro, el paciente cae en estado de orfandad léxica para la lectura y queda sumido a utilizar la ruta "novata y escolar" puramente fonológica y silábica. Su lectura se vuelve extremadamente dependiente de la conversión fonema a grafema.',
        list: [
          'Dilemas imposibles frente a homófonos, ya que todo se reduce a un silabeo idéntico ("Vaca" resulta indistinguible de "Baca").',
          'Exacerbada y fatal tendencia para someter e imponer reglas fonológicas ("Leer como es") en vocablos irregulares o extranjerismos.',
          'Buena y perfecta fluidez para leer falsas palabras o pseudopalabras, ya que la vía fónica mecánica no exige léxico visual.'
        ],
        test: 'Lectura en voz alta contrastando palabras regulares con irregulares/homófonas y tareas de decisión léxica visual.'
      }
    }
  } },
  
  { id: '4', type: 'custom', position: { x: 0, y: 600 }, data: { 
    label: 'Conversión\nacústico-fonológica', 
    category: 'conversion', 
    extendedFunction: [
      'Transforma el input fonético a códigos articulables, ignorando activación léxica mental.',
      'Permite la repetición oracional o el aprendizaje vocal de pseudopalabras y vocabulario de índole nueva.',
      'Constituye un bypass o ruta perilexical (mecanismo "esclavo").'
    ],
    expandedDetails: {
      description: 'Como un bypass ajeno a los significados e inteligencias de la experiencia, el puente acústico-fonológico engarza la asimilación del mundo auditivo a nuestra capacidad refleja natural muscular y elocuente. Constituye la vía o "ruta peri-lexical o directa al sonido".',
      function: {
        title: 'Mecanismo Ecoico (Transcodificación de Superficie)',
        text: 'Evade cualquier procesamiento que contenga rastreos de vocabularios en la mente o conceptualizaciones semánticas. Funciona analizando y traduciendo instantáneamente fonemas asimilados pasándolos directos al "Retén fonológico" de salida.',
        list: [
          'Es el enrutamiento primario que faculta al ser humano poder decir u ensayar vocabulario inexplorado e insólito (pseudopalabras, neologismos, palabras extranjeras).',
          'Constituye un "puente sin entendimiento ni consciencia".',
          'Puede mantenerse invicto permitiendo un reflejo imitativo en síndromes graves como la "Afasia Mixta Transcortical".'
        ]
      },
      deficit: {
        diagnosis: 'Agnosia Fonológica Auditiva',
        text: 'Cuando el encadenamiento perilexical sufre averías, la persona que escuche vocabulario inédito está absolutamente imposibilitada a reiterarlo, obligándola a acudir a mecanismos cerebrales léxicos.',
        list: [
          'Incompetencia rotunda ante el desafío de repetir secuencias novedosas (no-palabras inventadas).',
          'Su capacidad fonológica repetitiva por vía léxico-semántica logra ensayar y retener palabras corrientes para repetirles bien y sin titubeos, al verse cobijados a refugio en significados previos.'
        ],
        test: 'Pruebas de repetición al dictado oral contrastando pseudopalabras vs. palabras familiares.'
      }
    }
  } },
  { id: '9', type: 'custom', position: { x: 1050, y: 600 }, data: { 
    label: 'Conversión\ngrafema-fonema', 
    category: 'conversion', 
    extendedFunction: [
      'Agrupa las letras visuales y segmenta para decantar en un continuo articulatorio normado por sílabas.',
      'Ejecuta el ensamble segmentario de grafemas a fonemas constituyendo la "ruta fonológica".',
      'Imprescindible enrutador para la lectura de pseudopalabras y base para principiantes de lectura.'
    ],
    expandedDetails: {
      description: 'El pilar neurológico en la adquisición y primera infancia formativa ante la lectura (ruta indirecta). Efectúa un ensamble sintético y lento donde convierte secuencias estáticas impresas de los grafos al vibrante dinamismo de la sílaba sonara y entonación en la lectura.',
      function: {
        title: 'Sistematización Alfabética y Pre-Ensamblado',
        text: 'Este decodificador efectiviza la recitación de grafema a fonema sin la intervención directa del Léxico Visual, transcribiendo las combinaciones gráficas como una decodificación forzosa, algorítmica y acompasada (el clásico silabeo sonoro escolar).',
        list: [
          'Proporciona una recitación obligatoriamente "reglamentada". Falla ante estructuras no tipificadas, pero adapta su cauce a sistemas como el español por su gran linealidad ortográfica.',
          'Brinda independencia al lector permitiendo derivar el sonido de las palabras inéditas ("bracutina").'
        ]
      },
      deficit: {
        diagnosis: 'Dislexia Fonológica',
        text: 'El daño profundo sobre este módulo priva al sujeto de la vía fonológica. Si el paciente no puede acceder a una representación en el Léxico Visual (porque la palabra es infrecuente o desconocida), simplemente no puede pronunciarla.',
        list: [
          'Incapacidad drástica para derivar el sonido de palabras novedosas, inventadas o pseudopalabras.',
          'Fallas drásticas en el ensamble de letras individuales a representaciones fonológicas.',
          'Tendencia extrema a "lexicalizar" (intentar adivinar una pseudopalabra asimilándola a una palabra real muy parecida visualmente).'
        ],
        test: 'Lectura en voz alta de pseudopalabras y palabras infrecuentes comparadas con palabras de alta frecuencia.'
      }
    }
  } },
  
  { id: '5', type: 'custom', position: { x: 600, y: 500 }, data: { 
    label: 'Sistema\nsemántico', 
    category: 'semantic', 
    extendedFunction: [
      'Asigna "qué quiere decir" cada concepto integrando estímulos perceptuales a la cognición superior.',
      'Red central interconectada y "amodal" responsable de la memoria y el conocimiento general del mundo.',
      'Agrupa y asocia conceptos estructurándolos por jerarquías, rasgos distintivos y categorías taxonómicas.'
    ],
    expandedDetails: {
      description: 'La gigantesca bóveda reticular "amodal". Ocupa las interconexiones en red que otorgan representación conceptual universal a todos nuestros reconocimientos. Unifica todos los aportes motores, perceptuales, visuales y sonoros para conferir la consciencia intrínseca y proposicional ("qué es, para qué funciona, dónde vive").',
      function: {
        title: 'Centralización Distribuida de Conceptos Universales',
        text: 'Esta encrucijada medular carece de fonología o lenguajes escritos, conformando los esquemas nodales. Constituye el fin superior cognitivo. Independiente de cómo se perciba (dibujo de manzana, su olor, o la palabra oída "manzana"), el concepto desata todo su universo de esquemas (“fruta, árbol, roja, jugosa”).',
        list: [
          'Organiza intrínsecamente y asocia de forma nodal ramificadora en clasificaciones lógicas ("seres vivos", "herramientas").',
          'Dinamiza interactuando, decidiendo denominaciones e inducciones con la intención pre-motriz hacia los léxicos de salida.',
          'Se ve robustecido por efectos categoriales como "Tipicidad"; un mamífero cuadrúpedo común (perro) es de más rápido acceso que uno atípico (ballena).'
        ]
      },
      deficit: {
        diagnosis: 'Agnosia / Demencia Semántica',
        text: 'La desorganización a las bases enciclopédicas por desnutriciones neurológicas o afasias graves trae un déficit letal intermodal inmiscuido en todas las áreas de la comprensión, arrastrando a su paso el habla espontánea conciente y la mímica funcional lógica.',
        list: [
          'Degradación sustancial, intermodal e independiente del formato de entrada hacia el concepto u objeto genérico.',
          'Desestructuración progresiva de jerarquías ("perro" pasa a definirse como "animal" y luego como "cosa").',
          'Fallos consistentes al ordenar por categorías o identificar propiedades semánticas ante cualquier estímulo.'
        ],
        test: 'Test de Pirámides y Faraones/Palmeras (asociación semántica) y denominación intermodal, emparejamiento palabra-dibujo.'
      }
    }
  } },
  
  { id: '10', type: 'custom', position: { x: 300, y: 800 }, data: { 
    label: 'Léxico fonológico', 
    category: 'lexicon', 
    extendedFunction: [
      'Selecciona y prepara con extraordinaria velocidad ("milisegundos") la representación sonora expresiva definitiva.',
      'Conserva los "moldes sonoros" pre-articulados del vocabulario habitual de un individuo (memoria a largo plazo).',
      'Es altamente sensible al efecto de la frecuencia de uso y la edad de adquisición léxica.'
    ],
    expandedDetails: {
      description: 'Se halla instanciado como "el diccionarios de fonético de salida" donde yacen las representaciones para los moldes pre-articulatorios en el uso expresivo idiomático oral. Es el emisor donde los significados puros son arropados con la forma de palabras para ser emitidas al entorno.',
      function: {
        title: 'Módulo Expresor Semántico-Vocálico',
        text: 'Mediante conexiones directas desde la cognición semántica (habla espontánea y denominación) o atajos de la transcripción estructural (repetición puente de léxico a léxico), dispara la configuración fonológica de la palabra abstracta seleccionada.',
        list: [
          'Suficiente propulsor, es susceptible de bloqueos intermitentes ante ansiedad o estrés (fenómeno de la Punta de la Lengua en estado normal).',
          'Evidencia fortísima correlación entre la accesibilidad y la consolidación de léxico de uso altamente frecuente y edad temprana de adquisición.'
        ]
      },
      deficit: {
        diagnosis: 'Anomia Pura / Afasia Anómica',
        text: 'La desconexión a este eslabón despunta cuadros que imposibilitan encontrar un acceso a la etiqueta léxica. El paciente exhibe consciencia total, conoce, entiende y siente al cien por ciento lo que anhela nombrar pero le es inalcanzable neuro-vocalmente.',
        list: [
          'Agrava irremisiblemente el conocido fenómeno temporal "Lo tengo en la Punta de las Lenguas" asumiéndolo crónico.',
          'Sobrevienen en un mar de parafasias formales o semánticas al suplir la palabra bloqueada con otras vecinas en la red.',
          'El paciente se rodea en circunloquios descriptivos ("Esa cosa con tinta para escribir" para birome).'
        ],
        test: 'Requerimientos de Denominaciones (Boston Naming Test), demostrando una comprensión ilesa pero un bloqueo terminal verbal.'
      }
    }
  } },
  { id: '11', type: 'custom', position: { x: 900, y: 800 }, data: { 
    label: 'Léxico ortográfico', 
    category: 'lexicon', 
    extendedFunction: [
      'Facilita dictar una estructura ortográfica automatizada, holística y exacta a la mano del individuo.',
      'Evita la aplicación forzosa de reglas fonéticas para poder escribir rápidamente palabras irregulares u opacas.',
      'Sirve como "bypass" procedimental entre un pre-pensamiento y la escritura directa y automatizada.'
    ],
    expandedDetails: {
      description: 'El Léxico Ortográfico de Salida (LOS) es el archivero global que acopia la configuración e identidad alfabética exacta para los vocablos que el sujeto ya tiene afianzados ortográficamente (memoria viso-grafémica productiva).',
      function: {
        title: 'Módulo Expresor de las Estructuras Ortográficas',
        text: 'En su interior residen los patrones que dotan al escritor de destreza pura, eximiéndolo de construir la palabra letra a letra mediante sonidos o reglas ortográficas memorizadas conscientemente. Funciona saltándose las trabas perilexicales sintéticas en tareas de escritura veloz o copiado experto.',
        list: [
          'Previene equivocaciones severas disipando el "ruido fonético"; gracias a él escribimos perfectamente los vocablos irregulares sin fonetizarlos forzosamente.',
          'Facilita dictar o manuscribir una estructura automatizada y consolidada directa a la pluma u ordenador ahorrando energía cognitiva valiosa.'
        ]
      },
      deficit: {
        diagnosis: 'Agrafia Superficial o Léxica',
        text: 'La lesión en el LOS deja a la persona atada a las vías obligatorias de la "Conversión fonema-grafema" perdiendo así las singularidades aprendidas y deudas históricas u caprichosas con la letra formal idiomática.',
        list: [
          'Sobre-regularización constante obligada y sistemática de vocablos irregulares u ambiguos ("erbir" por "hervir").',
          'Los escritos en el afásico rebasan de faltas y regulaciones que destrozan la escritura culta pero suenan extrañamente correcto fonéticamente ("omvre").',
          'Pueden transcribir bien palabras transparentes o regulares, e incluso no decaen sobre pseudo-palabras irreales.'
        ],
        test: 'Escritura al dictado contrastando vocablos regulares con irregulares, además de pares homófonos heterógrafos.'
      }
    }
  } },
  
  { id: '12', type: 'custom', position: { x: 0, y: 1000 }, data: { 
    label: 'Almacén de\nfonemas', 
    category: 'storage', 
    extendedFunction: [
      'Bucle temporal y mnemotécnico ("Retén Fonológico") último y previo a la ejecución motriz articulatoria.',
      'Retiene fríamente y alinea, a corto plazo, la secuencia del armado de fonemas de manera seriada e inestable.',
      'Sostiene pacientemente el encadenamiento fonológico a la espera de sus sistemas orofaciales periféricos.'
    ],
    expandedDetails: {
      description: 'El Retén Fonológico es un sistema de memoria de trabajo efímera que actúa de antesala terminal hacia el control fonoarticular orofacial. Su función no es enciclopédica, sino procedimental para posponer un colapso en la emisión mientras aguardamos la directriz motora de respuesta.',
      function: {
        title: 'Buffer de Estabilización Pre-Motor Repetitivo',
        text: 'Recoge las unidades fonológicas pregonadas sean desde la ruta léxico-semántica o del encofrado perilexical y retiene como "buffer activo" el eco para que todo el listado de fonaciones desemboque de a turnos coordinando las cuerdas, los labios y lenguas.',
        list: [
          'Estabiliza y acompasa el "flujo a enunciar" previniendo omisiones o tropiezos mecánicos orgánicos fonadores.',
          'Inmerso en un paradigma limitado; si rebasamos su memoria de 7 items u oraciones gigantes, decae por colapso natural humano.'
        ]
      },
      deficit: {
        diagnosis: 'Afasia de Conducción (Alteración pura del Retén Fonológico)',
        text: 'El quiebre drástico del retén presenta la clásica anomalía del límite atroz de secuencias repetitivas. El habla fluye con lógica normal, pero se traban sistemáticamente y es destruida cuando tienen que forzarse a recordar un dictado que supera sus limitadas capacidades mnemotécnicas recientes.',
        list: [
          'Preservado intelecto sintáctico-semántico expresivo mermado asfixiantemente en iteraciones secuenciales largas por caída abismal en el efecto de la longitud.',
          'Genera transposiciones, y parálisis sub-segmentales reordenando torpemente la pronunciación, mutilándola caprichosamente por falta transitoria de sostén memorístico.'
        ],
        test: 'Repetición encadenada impuesta de span creciente (de menor a extensísimos caracteres u oraciones con rimas complejas asiladas).'
      }
    }
  } },
  { id: '14', type: 'custom', position: { x: 1200, y: 1000 }, data: { 
    label: 'Almacén de\ngrafemas', 
    category: 'storage', 
    extendedFunction: [
      'Guía paralela visual abstracta, reteniendo letras un tiempo prudente previo al control nervioso muscular.',
      'Filtra e impide solapamientos sirviendo de buffer de retención mientras el sistema prepara los alógrafos.',
      'Separa la mera secuencia abstracta (mayúsculas o minúsculas) antes del tipeo de teclado o caligrafía libre.'
    ],
    expandedDetails: {
      description: 'El eslabón temporal que coordina y dosifica en la cascada hacia el control motriz la abrumadora cantidad seriada grafémica lograda de instancias ortográficas o acústicas para evitar sobre la mano un atropello desproporcionado de órdenes espaciales disonantes.',
      function: {
        title: 'Buffer de Retención y Organización Neuro-gráfica (Retén Grafémico)',
        text: 'Evita descargas catastróficas del pensamiento general manuscrito dándole tregua interina a los músculos grafomotores ("frena y forma cola seriada" sobre qué letras deberán delinearse postreramente al papel en un margen acotado de lapsos inmediatos).',
        list: [
          'Retiene en bloque ordenado secuencial alfabéticamente evitando solapaciones y cruces groseros caligráficos.',
          'Previene aletargamientos anagramáticos impidiendo una caída de las derivaciones finales en dictámenes y dictados veloces ajenos o extensos.'
        ]
      },
      deficit: {
        diagnosis: 'Agrafia del Buffer Grafémico / Agrafia Espacial',
        text: 'Las órdenes abstractas hacia los alógrafos se amontonan de tal manera que las postreras sufren la sustracción total u alteración irrefrenable desfigurada.',
        list: [
          'Exponenciación grave y notoria dictaminada por la sobrecarga y el efecto de longitud (cuanto más estirada la frase en grafias, mayor mortandad de exactitud presentarán borroneando sus finales).',
          'Sufren traspapeleo perdiendo sus nociones o encajes insertando enroques caligráficos al azar en palabras larguísimas de su propio intelecto en manuscrito o sobre un teclado.'
        ],
        test: 'Copia progresiva veloz confrontada a dictadillos evaluativos en listas kilométricas, registrándose siempre alteraciones de caídas terminales irregulares.'
      }
    }
  } },
  
  { id: '13', type: 'custom', position: { x: 600, y: 1000 }, data: { 
    label: 'Conversión\nfonema-grafema', 
    category: 'conversion', 
    extendedFunction: [
      'Mapea y traduce interactivamente desde las unidades discretas de sonido audibles hacia sus asimilables signos mecánicos ortográficos.',
      'Opera como un enrutador estricto para transcribir y dictar fonología donde se ignoran las memorias de significado.',
      'Soporte constitutivo perilexical de escritura forzosa ante pseudopalabras o dictados irreconocibles.'
    ],
    expandedDetails: {
      description: 'Mecanismo inversor indirecto indispensable, mediador entre el torrente auditivo fonológico que entra u imaginamos y la tipificación constructiva serial gráfica hacia nuestra biomecánica del brazo escritor o máquina mecanografiada.',
      function: {
        title: 'Desensamble Sonoro a Escritura Literal o Sub-Léxica',
        text: 'Transfunde analíticamente reglas de "cómo rige el sonido que en sílaba resuena y qué garabato debo forzar en su papel". Salta el puente semántico o la red abstracta logrando calcos insípidos e inexorables pre-programados.',
        list: [
          'Insuflador de transcripciones exactas para pseudopalabras insólitas sin enraizamiento visual en nuestras memorias enciclopédicas al alfabar el dictador.',
          'Puntal base para el "rumiar ecoico" en la consciencia, dándonos arranques para transcribir sílabas fonéticamente de lenguajes irreconocibles pero descifrables estructuralmente (escribir una palabra sueca escuchada por primera vez).'
        ]
      },
      deficit: {
        diagnosis: 'Agrafia Fonológica',
        text: 'La falla o amputación en de este ensamble fonético-grafémico a nivel neural condena y aísla la pluma forzándola inyectivamente a disponer de sus repositorios de memorias intocadas. No pueden "asir", tipificar o derivar transcripción forzosa ante el dictado inexplorado insólito.',
        list: [
          'Absoluta paralización e imposibilidad fúnebre extrema ante todo estímulo inventado o pseudo-verbalización para volverse alfabético en su puño.',
          'Naufragio rotundo donde abundan los blancos paralizantes sin tan siquiera esgrimir amagos aproximativos con lógicas al dictado de inexplorados.',
          'Conservan en gracia su léxico puro intacto para vaciar su caudal experto natural de los cotidianos y dictámenes diarios aprendidos por el paso de sus vidas.'
        ],
        test: 'Escritura al dictado forzado bajo presión sistemática, alternando la perfecta performance en palabras habituadas versus el congelamiento trágico ante la pseudopalabra indomable de prueba.'
      }
    }
  } },
  
  { id: '15', type: 'custom', position: { x: 0, y: 1200 }, data: { label: 'Habla', category: 'io', hideHandles: true } },
  { id: '16', type: 'custom', position: { x: 1200, y: 1200 }, data: { label: 'Escritura', category: 'io', hideHandles: true } },
];

const markerOpt = {
  type: MarkerType.ArrowClosed,
  color: '#94A3B8',
  width: 20,
  height: 20,
};

const markerConvOpt = {
  type: MarkerType.ArrowClosed,
  color: '#d946ef',
  width: 20,
  height: 20,
};

const edgeStyle = { stroke: '#94A3B8', strokeWidth: 2 };
const dashedEdgeStyle = { stroke: '#94A3B8', strokeWidth: 2, strokeDasharray: '6,4' };
const convEdgeStyle = { stroke: '#d946ef', strokeWidth: 2.5, strokeDasharray: '6,4' };

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', type: 'custom', sourceHandle: 's-bottom-center', targetHandle: 't-top-center', markerEnd: markerOpt, style: edgeStyle },
  { id: 'e6-7', source: '6', target: '7', type: 'custom', sourceHandle: 's-bottom-center', targetHandle: 't-top-center', markerEnd: markerOpt, style: edgeStyle },
  
  { id: 'e2-3', source: '2', target: '3', type: 'custom', sourceHandle: 's-bottom-right', targetHandle: 't-top-center', markerEnd: markerOpt, style: edgeStyle, data: { 
    extendedFunction: [
      'El espectro acústico estimula simultáneamente múltiples representaciones léxicas candidatas en el Léxico Auditivo (activación paralela interactiva).',
      'La palabra blanco adquiere sostenidamente mayor nivel de activación a lo largo de los milisegundos.',
      'Sustituye, aísla y finalmente inhibe lateralmente a todos sus "vecinos léxicos" ruidosos competidores.'
    ]
  } },
  { id: 'e7-8', source: '7', target: '8', type: 'custom', sourceHandle: 's-bottom-left', targetHandle: 't-top-center', markerEnd: markerOpt, style: edgeStyle, data: { 
    extendedFunction: [
      'Evalúa de un simple vistazo y holísticamente el "molde general" de una cadena regular, lo cual favorece estímulos de alta frecuencia.',
      'El analizador visual traslada patrones abstractos de trazos y los encadena velozmente frente a un bloque ortográfico previo globalizante.',
      'Pone en marcha el flujo primordial definido como "la vía dorada directa y léxica" para hablantes expertos de la lectura.'
    ]
  } },
  
  { id: 'e2-4', source: '2', target: '4', type: 'custom', sourceHandle: 's-bottom-left', targetHandle: 't-top-left', markerEnd: markerConvOpt, style: convEdgeStyle, data: { 
    extendedFunction: [
      'Funciona de bypass mecanicista que evade todas las exigencias de comprobaciones del nivel semántico central sobre pseudopalabras nulas.',
      'Redirecciona obligadamente el material pre-acústico en jeringozas extranjeras que escapan de cualquier léxico aprendido en diccionarios mentales.',
      'Desvía el output del reconocimiento sonoro para posibilitar repasos o ecos vociferativos sin entendimiento asociativo.'
    ]
  } },
  { id: 'e7-9', source: '7', target: '9', type: 'custom', sourceHandle: 's-bottom-center', targetHandle: 't-top-center', markerEnd: markerConvOpt, style: convEdgeStyle, data: { 
    extendedFunction: [
      'Es la petición predeterminada obligada de bloques en un estudiante de lectura que usa reglas aisladas para forzar el paso "letra a sonido".',
      'Desencadena los algoritmos lentos fonológicos y seriales en ausencia de patrones consolidados familiares léxicos previos.',
      'Si se ve forzada ante palabras visualmente irregulares, provoca inevitables lecturas robotizadas y fonetizadas literalmente.'
    ]
  } },
  { id: 'e7-14', source: '7', target: '14', type: 'custom', sourceHandle: 's-bottom-right', targetHandle: 't-top-right', markerEnd: markerOpt, style: dashedEdgeStyle, data: { 
    extendedFunction: [
      'Constituye la biela neurológica que explica el "calco perfecto a papel" en pacientes con demencias semánticas catastróficas y ceguera al léxico.',
      'Transfiere la mera decodificación lineal captural visual en un bypass exclusivo al dominio caligráfico sin filtros de palabras.',
      'Ignora la retentiva obligatoria de significado o articulación abstracta, derivando en copias esclavas.'
    ]
  } },
  
  { id: 'e3-5', source: '3', target: '5', type: 'custom', sourceHandle: 's-right-middle', targetHandle: 't-top-left', markerEnd: markerOpt, style: edgeStyle, data: { 
    extendedFunction: [
      'Proporciona el andamiaje asociativo primordial que hace que "reconocer la palabra oída" active instantáneamente el conocimiento conceptual ("Comprensión Auditiva").',
      'Envía eficientemente la firma de coincidencia pre-léxica al espacio interrelacionado semántico general amodal.',
      'Si se desconecta, origina "Sordera al Significado": el paciente repetirá velozmente, pero será ciego a su significado.'
    ]
  } },
  { id: 'e8-5', source: '8', target: '5', type: 'custom', sourceHandle: 's-left-middle', targetHandle: 't-top-right', markerEnd: markerOpt, style: edgeStyle, data: { 
    extendedFunction: [
      'Sirve como el pilar fundamental que dota velozmente al lector rápido y silencioso para impregnarse del contenido abstracto del texto.',
      'Se disocia activamente sobre las cortezas de reconocimiento fonético, posibilitando evadir el letreo auditivo en voz alta acortando el análisis.',
      'Bajo lesiones afásicas de Ceguera Conceptual, la cadena sintáctica es fluida de lectura, pero despojada de entendimiento amodal en el lector.'
    ]
  } },
  
  { id: 'e3-10', source: '3', target: '10', type: 'custom', sourceHandle: 's-bottom-left', targetHandle: 't-top-left', markerEnd: markerOpt, style: dashedEdgeStyle, data: { 
    extendedFunction: [
      'Provee de modelo a los afásicos ecoicos sorprendentes donde repiten fluidamente diálogos enteros sin comprenderlos aislando todo contacto con la corteza asociativa.',
      'El puente percusor por el que las memorias aprendidas destilan directo lo abstraído léxico familiar al estante articulatorio.',
      'Construye discursos velozmente automáticos dictados desde la repetición sostenida a costas del propio léxico fonológico del paciente.'
    ]
  } },
  { id: 'e8-10', source: '8', target: '10', type: 'custom', sourceHandle: 's-bottom-left', targetHandle: 't-top-right', markerEnd: markerOpt, style: dashedEdgeStyle, data: { 
    extendedFunction: [
      'Ruta auxiliar funcional donde un lector lee a gran velocidad y cadencia de alta voz su libro, carente de retentiva semántica si su atención está distanciada.',
      'Propulsa la lectura de vocablos irregulares esquivando algoritmos fallidos en demencias y afasias conceptuales.'
    ]
  } },
  { id: 'e8-11', source: '8', target: '11', type: 'custom', sourceHandle: 's-bottom-right', targetHandle: 't-top-right', markerEnd: markerOpt, style: dashedEdgeStyle, data: { 
    extendedFunction: [
      'Consagra una conectividad donde al ver algo, transcribimos instantánemente librándonos del pesado procesamiento mental o vocal para concentrarnos en la birome.',
      'Posibilita escribir vertiginosamente evitando toda regla ortográfica o de memoria fonética dictando de texto al texto ("copia pura veloz").'
    ]
  } },
  
  { id: 'e5-10', source: '5', target: '10', type: 'custom', sourceHandle: 's-bottom-left', targetHandle: 't-top-center', markerEnd: markerOpt, style: edgeStyle, data: { 
    extendedFunction: [
      'Eslabón base de ordenamiento para el "habla reflexiva e informada sobre el mundo" desde la propia intencionalidad originaria abstracta.',
      'Despliega activaciones de asociaciones conceptuales que seleccionan "la etiqueta" adecuada para el sonido (Denominación oral).',
      'Las fallas de transmisión post-semánticas resbalan la orden y bloquean la producción dando origen al circuloquio anómico de "la punta de la lengua".'
    ]
  } },
  { id: 'e5-11', source: '5', target: '11', type: 'custom', sourceHandle: 's-bottom-right', targetHandle: 't-top-left', markerEnd: markerOpt, style: edgeStyle, data: { 
    extendedFunction: [
      'Emisor principal de "escritura originada" donde la intuición y semántica proveen puramente qué enjambre ortográfico automatizado se usará.',
      'Dota el dictado composicional reflexivo y exacto a quien crea cuentos, literaturas o se comunica bajo teclados e instancias libres del aula.'
    ]
  } },
  
  { id: 'e10-11', source: '10', target: '11', type: 'custom', sourceHandle: 's-right-middle', targetHandle: 't-left-middle', markerEnd: markerOpt, style: edgeStyle, data: {
    extendedFunction: [
      'Da soporte interactivo paralelo y contiguo al manuscrito y fomenta que la pronunciación silenciosa mental evoque el rastro certero grafémico.',
      'Refuerza indirectamente la consolidación del calco evaluando sub-conscientemente las salidas articulatorias en paralelo al lápiz tipificador.'
    ]
  } },
  
  { id: 'e10-12', source: '10', target: '12', type: 'custom', sourceHandle: 's-bottom-center', targetHandle: 't-top-center', markerEnd: markerOpt, style: edgeStyle, data: { 
    extendedFunction: [
      'Pico de transición donde el vocablo empaquetado y seleccionado magistralmente del léxico transborda íntegramente hacia el Retén corto temporal.',
      'Asienta, transfiere y descarga de forma veloz todo el torrente encadenado necesario reteniendo el material previo al habla física.'
    ]
  } },
  { id: 'e11-14', source: '11', target: '14', type: 'custom', sourceHandle: 's-bottom-center', targetHandle: 't-top-left', markerEnd: markerOpt, style: edgeStyle, data: { 
    extendedFunction: [
      'Canal que rutea la "ortografía dictaminada" decidiéndola temporalmente para evitar decaimientos en su resguardo a la estación procedimental.',
      'Somete a los engranajes caligráficos sirviéndoles el empaquetado visual global posponiendo interferencias y cruces.'
    ]
  } },
  
  { id: 'e4-12', source: '4', target: '12', type: 'custom', sourceHandle: 's-bottom-left', targetHandle: 't-top-left', markerEnd: markerConvOpt, style: convEdgeStyle, data: { 
    extendedFunction: [
      'Evacúa velozmente locuciones "nulas o pseudolingüísticas sonoras en frío" al almacén repitente o eco sin tocar el significado.',
      'Aisla la reproducción dictada "a calco" enviando lo trans-codificado analíticamente directo a las áreas de imitación sub-motora.'
    ]
  } },
  
  { id: 'e9-12', source: '9', target: '12', type: 'custom', sourceHandle: 's-bottom-center', targetHandle: 't-top-right', markerEnd: markerConvOpt, style: convEdgeStyle, data: { 
    extendedFunction: [
      'Consumación de fragilidad en donde todo lo ensayado sonoramente paso a paso cae finalmente al frágil resguardo organizador del ensamble en voz.',
      'Lidariza el letreo de pseudopalabras arrojando sílabas disonantes con altas probabilidades caídas que sufren lapsos e interrupciones temporales.'
    ]
  } },
  
  { id: 'e12-13', source: '12', target: '13', type: 'custom', sourceHandle: 's-right-middle', targetHandle: 't-left-middle', markerEnd: markerConvOpt, style: convEdgeStyle, data: { 
    extendedFunction: [
      'Vierte lo rumiado o el "habla pasmada sub-consciente en loop" por el cual nosotros tratamos fonéticamente de escribir y pensar los sonidos extraños con el teclado.',
      'Mecanismo natural al "tantear" o arrastrar fonéticamente dictados a pluma usando el cerebro de base acústica de eco como la central pre-formativa.'
    ]
  } },
  { id: 'e13-14', source: '13', target: '14', type: 'custom', sourceHandle: 's-right-middle', targetHandle: 't-left-middle', markerEnd: markerConvOpt, style: convEdgeStyle, data: { 
    extendedFunction: [
      'Descarga los compases elaborados finales de una traducción "fonema->grafismo" para dejar listas formas asimilables manuales extrañas en el buffer pre-escritura.',
      'Conecta la instancia metódica con el final procedimental y fínografico enviándolo hacia el apartado periférico en espera.'
    ]
  } },
  
  { id: 'e12-15', source: '12', target: '15', type: 'custom', sourceHandle: 's-bottom-center', targetHandle: 't-top-center', markerEnd: markerOpt, style: edgeStyle, data: { 
    extendedFunction: [
      'Activan la ejecución biológico puramente eferente al velo-paladar u cuerdas vocales coordinadas produciendo la voz per-sed (Habla fluida física).',
      'Se sume a atrofias y disartrias donde a pesar de pensar perfectamente, las bocas se paralizan y traban las intenciones de dicción de origen neuromuscular.'
    ]
  } },
  { id: 'e14-16', source: '14', target: '16', type: 'custom', sourceHandle: 's-bottom-center', targetHandle: 't-top-center', markerEnd: markerOpt, style: edgeStyle, data: { 
    extendedFunction: [
      'Despliega visio-muscularmente cinemáticas sobre impresiones de mano libres, curvas precisas para imprenta o tecleado.',
      'Una caída de apraxia paralizaría ininteligiblemente la orden, causando fallos de caligrafía espacial incomprensibles y agrafias motoras irreparables grafológicamente.'
    ]
  } },
  
  { 
    id: 'e15-1', source: '15', target: '1', type: 'step', sourceHandle: 's-left-middle', targetHandle: 't-left-middle', markerEnd: { type: MarkerType.ArrowClosed, color: '#cbd5e1', width: 20, height: 20 }, style: { strokeDasharray: '6,6', stroke: '#cbd5e1', strokeWidth: 2 },
    data: { extendedFunction: [
      'Bucle natural e indispensable humano donde todo lo dictado en "alta voz" re-impacta auditivamente en nuestro monitor instintivo comprobando su éxito (Auto-Monitoreo acústico).',
      'Forza reparaciones in-situ y "off-line" si hay desfasajes o ruidos de interferencia verbal donde reajustaremos ("eh, quise decir...").'
    ] }
  },
  { 
    id: 'e16-6', source: '16', target: '6', type: 'step', sourceHandle: 's-right-middle', targetHandle: 't-right-middle', markerEnd: { type: MarkerType.ArrowClosed, color: '#cbd5e1', width: 20, height: 20 }, style: { strokeDasharray: '6,6', stroke: '#cbd5e1', strokeWidth: 2 },
    data: { extendedFunction: [
      'Lectura secundaria ocular e "inducida paralela", vital durante la trascripción o narración sostenida escrita evitando omisiones por medio del reinicio analítico ocular.',
      'Desenvuelve el revisionismo caligráfico sobre la pantalla visual y permite deshacer rápidamente o percatarnos de las presiones de teclas falsas.'
    ] }
  },
];

export function FlowDiagram() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const onNodeMouseEnter: NodeMouseHandler = useCallback((_, node) => {
    setHoveredNode(node.id);
  }, []);

  const onNodeMouseLeave: NodeMouseHandler = useCallback(() => {
    setHoveredNode(null);
  }, []);

  const { connectedNodes, connectedEdgesIds } = useMemo(() => {
    if (!hoveredNode) {
      return { connectedNodes: new Set<string>(), connectedEdgesIds: new Set<string>() };
    }

    const cNodes = new Set<string>();
    const cEdges = new Set<string>();

    const queueForwards = [hoveredNode];
    while (queueForwards.length > 0) {
      const current = queueForwards.shift()!;
      cNodes.add(current);
      
      // Stop traversing forward at "Habla" (15) and "Escritura" (16)
      if (current === '15' || current === '16') {
        continue;
      }

      edges.forEach((edge) => {
        if (edge.source === current) {
          cEdges.add(edge.id);
          if (!cNodes.has(edge.target)) {
            queueForwards.push(edge.target);
          }
        }
      });
    }

    const queueBackwards = [hoveredNode];
    while (queueBackwards.length > 0) {
      const current = queueBackwards.shift()!;
      cNodes.add(current);

      // Stop traversing backward at "Palabra oída" (1) and "Palabra leída" (6)
      if (current === '1' || current === '6') {
        continue;
      }

      edges.forEach((edge) => {
        if (edge.target === current) {
          cEdges.add(edge.id);
          if (!cNodes.has(edge.source)) {
            queueBackwards.push(edge.source);
          }
        }
      });
    }

    return { connectedNodes: cNodes, connectedEdgesIds: cEdges };
  }, [hoveredNode, edges]);

  const dynamicNodes = useMemo(() => {
    return nodes.map((node) => {
      if (!hoveredNode) {
        return {
          ...node,
          style: { ...node.style, opacity: 1, transition: 'opacity 0.3s ease' },
        };
      }

      const isConnected = connectedNodes.has(node.id);
      return {
        ...node,
        style: {
          ...node.style,
          opacity: isConnected ? 1 : 0.25,
          transition: 'opacity 0.3s ease',
        },
      };
    });
  }, [nodes, hoveredNode, connectedNodes]);

  const dynamicEdges = useMemo(() => {
    return edges.map((edge) => {
      // If no node is hovered, return the default edge
      if (!hoveredNode) {
        return {
          ...edge,
          animated: false,
          style: {
            ...edge.style,
            opacity: 1,
            strokeWidth: edge.type === 'custom' && edge.style?.strokeWidth ? edge.style.strokeWidth : 2,
            transition: 'opacity 0.3s ease, stroke-width 0.3s ease',
          }
        };
      }

      // If a node is hovered, highlight connected edges
      const isConnected = connectedEdgesIds.has(edge.id);
      return {
        ...edge,
        animated: isConnected,
        style: {
          ...edge.style,
          opacity: isConnected ? 1 : 0.15, // Fade out non-connected edges
          strokeWidth: isConnected ? 3 : (edge.style?.strokeWidth || 2),
          transition: 'opacity 0.3s ease, stroke-width 0.3s ease',
        },
        zIndex: isConnected ? 1000 : 0
      };
    });
  }, [edges, hoveredNode, connectedEdgesIds]);

  return (
    <div className="w-full h-full min-h-[90vh]">
      <ReactFlow
        nodes={dynamicNodes}
        edges={dynamicEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeMouseEnter={onNodeMouseEnter}
        onNodeMouseLeave={onNodeMouseLeave}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        fitViewOptions={{ padding: 0.1 }}
        minZoom={0.1}
        nodesDraggable={false}
        nodesConnectable={false}
        panOnDrag={[1, 2]}
        className="bg-slate-50 [&_.react-flow__pane]:cursor-default"
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#cbd5e1" gap={20} size={1} />
        <Controls showInteractive={false} className="bg-white border-slate-200 shadow-sm rounded-md" />
        <MiniMap 
          nodeColor={(n) => {
            if (n.data?.category === 'input-process') return '#60a5fa';
            if (n.data?.category === 'motor-process' || n.data?.category === 'storage') return '#34d399';
            if (n.data?.category === 'semantic') return '#f59e0b';
            if (n.data?.category === 'conversion') return '#e879f9';
            if (n.data?.category === 'lexicon') return '#fbbf24';
            return '#cbd5e1';
          }}
          maskColor="rgba(248, 250, 252, 0.7)"
          className="bg-white border-slate-200 shadow-sm rounded-md overflow-hidden" 
        />
      </ReactFlow>
    </div>
  );
}
