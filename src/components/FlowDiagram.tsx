import { useCallback } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MarkerType,
  useNodesState,
  useEdgesState,
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

// Huge Grid Mapping to prevent overlap
// Cols: A=0, C=300, E=600, G=900, H=1050, I=1200
// Rows: 1=0, 3=200, 5=400, 6=500, 7=600, 9=800, 11=1000, 13=1200
// Width is 180, Height is ~80

const initialNodes = [
  // A1, I1: Inputs
  { id: '1', type: 'custom', position: { x: 0, y: 0 }, data: { label: 'Palabra oída', category: 'io', hideHandles: true } },
  { id: '6', type: 'custom', position: { x: 1200, y: 0 }, data: { label: 'Palabra leída', category: 'io', hideHandles: true } },
  
  // A3, I3: Analysis
  { id: '2', type: 'custom', position: { x: 0, y: 200 }, data: { label: 'Análisis acústico', category: 'input-process', function: 'Extrae los rasgos fonéticos e identifica los fonemas a partir de la señal física acústica en secuencias segmentadas.', deficit: 'Sordera verbal pura. Fracaso en discriminación de fonemas, aunque percibe sonidos ambientales intactos.' } },
  { id: '7', type: 'custom', position: { x: 1200, y: 200 }, data: { label: 'Análisis visual', category: 'input-process', function: 'Identifica grafemas (letras) independientes de su forma física original (tipografía/mayúsculas) para reconocimiento ortográfico.', deficit: 'Alexia pura (Ceguera verbal). Discrimina estímulos visuales pero no logra identificar las letras ni asociarlas al lenguaje.' } },
  
  // C5, G5: Input Lexicons
  { id: '3', type: 'custom', position: { x: 300, y: 400 }, data: { label: 'Léxico auditivo', category: 'lexicon', function: 'Almacena las representaciones abstractas de la forma sonora de las palabras familiares. Es crucial en la decisión léxica auditiva.', deficit: 'Sordera para la forma de las palabras. Incapacidad para discriminar palabras orales reales de inventadas; falla en repetición léxica.' } },
  { id: '8', type: 'custom', position: { x: 900, y: 400 }, data: { label: 'Léxico visual', category: 'lexicon', function: 'Almacena representaciones ortográficas escritas familiares. Evalúa cadenas de letras globalmente ("ruta directa").', deficit: 'Sordera para el significado de las palabras o Dislexia superficial de input. Imposibilidad lectora de palabras irregulares.' } }, // G5
  
  // A7, H7: Conversions (peripheric)
  { id: '4', type: 'custom', position: { x: 0, y: 600 }, data: { label: 'Conversión\nacústico-fonológica', category: 'conversion', function: 'Vía perilexical (ruta no léxica) directa. Transforma el input fonético decodificado a códigos temporalmente articulatorios sin sentido.', deficit: 'Agnosia fonológica auditiva. Las pseudo-palabras no logran ser repetidas, preservando la repetición de palabras cotidianas concidas.' } },
  { id: '9', type: 'custom', position: { x: 1050, y: 600 }, data: { label: 'Conversión\ngrafema-fonema', category: 'conversion', function: 'Identificación de grafemas aislados para transformarlos sublexicalmente en fonemas asimilables según las lógicas de la sílaba.', deficit: 'Dislexia fonológica. Gran incapacidad para leer en voz alta palabras no familiares o pseudopalabras. Si es muy severa junto al semántico: Dislexia Profunda.' } }, // H7
  
  // E6: Semantic System
  { id: '5', type: 'custom', position: { x: 600, y: 500 }, data: { label: 'Sistema\nsemántico', category: 'semantic', function: 'Componente central "amodal". Agrupa, interrelaciona redes categoriales, evoca el contenido del mundo, y guarda el "concepto".', deficit: 'Agnosia/Demencia semántica. Degradación sustancial inter-modal del concepto. Fallan consistentemente las mismas categorías ante cualquier modalidad.' } }, // E6
  
  // C9, G9: Output Lexicons
  { id: '10', type: 'custom', position: { x: 300, y: 800 }, data: { label: 'Léxico fonológico', category: 'lexicon', function: 'Almacena las formas articuladas y sonoras de las palabras a expensas de acceder a ellas de un previo sistema semántico.', deficit: 'Anomia simple o del léxico fonológico. Entienden qué es el objeto pero no alcanzan su forma de salida (fenómeno de la punta de la lengua). Producción con parafasias formales.' } },
  { id: '11', type: 'custom', position: { x: 900, y: 800 }, data: { label: 'Léxico ortográfico', category: 'lexicon', function: 'Memoria ortográfica que dispone del deletreo automatizado y abstracto de las palabras que uno tiene dominio directo de uso.', deficit: 'Agrafia superficial. Implica el recurrir estrictamente a reglas fonema-grafema, lo cual destruye la grafía correcta de las palabras de escritura ambigua, irregular o caprichosa.' } }, // G9
  
  // A11, I11: Storage / Buffers
  { id: '12', type: 'custom', position: { x: 0, y: 1000 }, data: { label: 'Almacén de\nfonemas', category: 'storage', function: 'Retén temporal mnemotécnico. Retiene y alinea, a corto plazo, la secuencia del armado de fonemas ordenados antes de su articulación definitiva.', deficit: 'Produce parafasias fonémicas variables intra-tarea. Trastorno temporal postlexical de anticipación y desorganización similar al lapsus.' } },
  { id: '14', type: 'custom', position: { x: 1200, y: 1000 }, data: { label: 'Almacén de\ngrafemas', category: 'storage', function: 'Buffer (Retén) grafémico y de trabajo. Encamina el armado global en paralelo alógrafo (mayúsculas o minúsculas) y la orden muscular al azar a letras.', deficit: 'Agrafia del buffer grafémico: Errores posicionales, adiciones y transposiciones muy marcadas ante longitudes largas (mayor pérdida buffer), tanto en pseudopalabras como comunes.' } },
  
  // E11: Conversion Output
  { id: '13', type: 'custom', position: { x: 600, y: 1000 }, data: { label: 'Conversión\nfonema-grafema', category: 'conversion', function: 'Transformación (Mapeo) secuencial estricto de sonidos y fonología internalizada para el dictado sub-léxico en una orden ortográfica.', deficit: 'Agrafia fonológica. Extrema dificultad e imposibilidad al tener que escribir al dictado palabras que no se conocen (inexistencia lexical) o pseudopalabras.' } },
  
  // A13, I13: Outputs
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
  // A1 -> A3 (Vertical)
  { id: 'e1-2', source: '1', target: '2', type: 'custom', zIndex: 50, sourceHandle: 's-bottom-center', targetHandle: 't-top-center', markerEnd: markerOpt, style: edgeStyle },
  // I1 -> I3 (Vertical)
  { id: 'e6-7', source: '6', target: '7', type: 'custom', zIndex: 50, sourceHandle: 's-bottom-center', targetHandle: 't-top-center', markerEnd: markerOpt, style: edgeStyle },
  
  // A3 -> C5 (Diagonal)
  { id: 'e2-3', source: '2', target: '3', type: 'custom', zIndex: 50, sourceHandle: 's-bottom-right', targetHandle: 't-top-center', markerEnd: markerOpt, style: edgeStyle, data: { function: 'Se contrastan los fonemas analizados con el inventario de palabras disponibles en el sistema.' } },
  // I3 -> G5 (Diagonal)
  { id: 'e7-8', source: '7', target: '8', type: 'custom', zIndex: 50, sourceHandle: 's-bottom-left', targetHandle: 't-top-center', markerEnd: markerOpt, style: edgeStyle, data: { function: 'Busca coincidencias totales de letras de una fijación ocular o secuenciales contra el léxico ortográfico.' } },
  
  // A3 -> A7 (Vertical)
  { id: 'e2-4', source: '2', target: '4', type: 'custom', zIndex: 50, sourceHandle: 's-bottom-left', targetHandle: 't-top-left', markerEnd: markerConvOpt, style: convEdgeStyle, data: { function: 'Redirección sublexical a la vía de ensamble segmentario, evadiendo cualquier verificación del sistema central frente a estímulos y pseudopalabras irreconocibles.' } },
  // I3 -> H7 (Diagonal) 
  { id: 'e7-9', source: '7', target: '9', type: 'custom', zIndex: 50, sourceHandle: 's-bottom-center', targetHandle: 't-top-center', markerEnd: markerConvOpt, style: convEdgeStyle, data: { function: 'Apertura de la vía indirecta lectora. Petición del paso a paso letra a sonido sin un patrón lexicográfico preestablecido.' } },
  // I3 -> I11 (Vertical / Direct visual route)
  { id: 'e7-14', source: '7', target: '14', type: 'custom', zIndex: 50, sourceHandle: 's-bottom-right', targetHandle: 't-top-right', markerEnd: markerOpt, style: dashedEdgeStyle, data: { function: 'Copia pura esclava o dibujo literal sin procesamiento adicional intermedio de los grafemas detectados al papel.' } },
  
  // C5 -> E6 (Diagonal)
  { id: 'e3-5', source: '3', target: '5', type: 'custom', zIndex: 50, sourceHandle: 's-right-middle', targetHandle: 't-top-left', markerEnd: markerOpt, style: edgeStyle, data: { function: 'Acreditado el reconocimiento oral, se envía la firma lingüística abstracta a encajar y unirse con el concepto correspondiente.' } },
  // G5 -> E6 (Diagonal)
  { id: 'e8-5', source: '8', target: '5', type: 'custom', zIndex: 50, sourceHandle: 's-left-middle', targetHandle: 't-top-right', markerEnd: markerOpt, style: edgeStyle, data: { function: 'Una vez vista la "silueta" global de una palabra normal dentro del léxico, se dispara automática e instantáneamente su significado interrelacionado.' } },
  
  // C5 -> C9 (Vertical)
  { id: 'e3-10', source: '3', target: '10', type: 'custom', zIndex: 50, sourceHandle: 's-bottom-left', targetHandle: 't-top-left', markerEnd: markerOpt, style: dashedEdgeStyle, data: { function: 'Repetición directa asemántica. Vía puente que repite tal cual las cadenas fonológicas ya conocidas repulsando la interferencia cognitiva.' } },
  
  // G5 -> C9 (Léxico visual -> Léxico fonológico) 
  { id: 'e8-10', source: '8', target: '10', type: 'custom', zIndex: 50, sourceHandle: 's-bottom-left', targetHandle: 't-top-right', markerEnd: markerOpt, style: dashedEdgeStyle, data: { function: 'Ruta léxica asemántica (o directa residual). Facilita leer palabras correctas en voz alta sin comprenderlas (frecuente en pacientes dementes fluidos).' } },
  
  // G5 -> G9 (Léxico visual -> Léxico ortográfico) 
  { id: 'e8-11', source: '8', target: '11', type: 'custom', zIndex: 50, sourceHandle: 's-bottom-right', targetHandle: 't-top-right', markerEnd: markerOpt, style: dashedEdgeStyle, data: { function: 'Enlace exclusivo que propicia la copia ultrarrápida al léxico manuscrito por bypass de un texto, o sea, ver y transcribir globalmente ignorando las vías comprensivas superiores.' } },
  
  // E6 -> C9 (Diagonal)
  { id: 'e5-10', source: '5', target: '10', type: 'custom', zIndex: 50, sourceHandle: 's-bottom-left', targetHandle: 't-top-center', markerEnd: markerOpt, style: edgeStyle, data: { function: 'El concepto en mente localiza direccionalidades topográficas y morfológicas hacia su par lingüístico-vocal para formular la respuesta verbal en el cerebro o "habla interna".' } },
  // E6 -> G9 (Diagonal)
  { id: 'e5-11', source: '5', target: '11', type: 'custom', zIndex: 50, sourceHandle: 's-bottom-right', targetHandle: 't-top-left', markerEnd: markerOpt, style: edgeStyle, data: { function: 'Al pensar algo, el contenido semántico emite su solicitud de despliegue sobre su par lexical ortográfico para obtener las secuencias grafémicas de lo que se desea inscribir.' } },
  
  // C9 -> G9 (Horizontal)
  { id: 'e10-11', source: '10', target: '11', type: 'custom', zIndex: 50, sourceHandle: 's-right-middle', targetHandle: 't-left-middle', markerEnd: markerOpt, style: edgeStyle },
  
  // C9 -> A11 (Diagonal)
  { id: 'e10-12', source: '10', target: '12', type: 'custom', zIndex: 50, sourceHandle: 's-bottom-center', targetHandle: 't-top-center', markerEnd: markerOpt, style: edgeStyle, data: { function: 'Inmediata transición del cúmulo léxico general y fonémico hacia el contenedor secuencial.' } },
  // G9 -> I14 (Diagonal)
  { id: 'e11-14', source: '11', target: '14', type: 'custom', zIndex: 50, sourceHandle: 's-bottom-center', targetHandle: 't-top-left', markerEnd: markerOpt, style: edgeStyle, data: { function: 'Traspaso postlexical que destina en la unidad de retención grafémica la formación abstracta y exacta seleccionada para las instrucciones neuromusculares.' } },
  
  // A7 -> A12 (Vertical)
  { id: 'e4-12', source: '4', target: '12', type: 'custom', zIndex: 50, sourceHandle: 's-bottom-left', targetHandle: 't-top-left', markerEnd: markerConvOpt, style: convEdgeStyle, data: { function: 'Entrega en el almacén repeticional de los fonemas "fríos" del dictado/eco de la pseudopalabra que ha analizado la regla acústico-fonológica.' } },
  
  // H9 -> A12 (Conversión grafema-fonema -> Almacén de fonemas)
  { id: 'e9-12', source: '9', target: '12', type: 'custom', zIndex: 50, sourceHandle: 's-bottom-center', targetHandle: 't-top-right', markerEnd: markerConvOpt, style: convEdgeStyle, data: { function: 'Emisión continua y trabajosa que llena el almacén desde un sistema de reconocimiento letreado a sonoro silábico en decodificación.' } },
  
  // A12 -> E13 (Horizontal)
  { id: 'e12-13', source: '12', target: '13', type: 'custom', zIndex: 50, sourceHandle: 's-right-middle', targetHandle: 't-left-middle', markerEnd: markerConvOpt, style: convEdgeStyle, data: { function: 'Desde el retén fonológico en estado temporal de repaso (loop), se envía lo envasado a acoplarse y mapearse a signos normados de transcripción escrita visual.' } },
  // E13 -> I14 (Horizontal)
  { id: 'e13-14', source: '13', target: '14', type: 'custom', zIndex: 50, sourceHandle: 's-right-middle', targetHandle: 't-left-middle', markerEnd: markerConvOpt, style: convEdgeStyle, data: { function: 'Impacta el resultado del traspaso metódico desde sonidos sueltos hacia representaciones grafémicas en espera listas para escribir o tipear.' } },
  
  // A12 -> A15 (Vertical)
  { id: 'e12-15', source: '12', target: '15', type: 'custom', zIndex: 50, sourceHandle: 's-bottom-center', targetHandle: 't-top-center', markerEnd: markerOpt, style: edgeStyle, data: { function: 'Inicia los programas neuro-motores, transformando patrones en órdenes para los articuladores orofaciales (Habla).' } },
  // I14 -> I16 (Vertical)
  { id: 'e14-16', source: '14', target: '16', type: 'custom', zIndex: 50, sourceHandle: 's-bottom-center', targetHandle: 't-top-center', markerEnd: markerOpt, style: edgeStyle, data: { function: 'Inicia comandos quinestésticos en las habilidades manuales finas. Ordena los tiempos inter-patrones desde el cerebro al papel o teclado.' } },
  
  // Auditory feedback loop
  { 
    id: 'e15-1', 
    source: '15', 
    target: '1', 
    type: 'step', 
    zIndex: 50,
    sourceHandle: 's-left-middle', 
    targetHandle: 't-left-middle', 
    markerEnd: { ...markerOpt, color: '#cbd5e1' }, 
    style: { strokeDasharray: '6,6', stroke: '#cbd5e1', strokeWidth: 2 }
  },
  // Visual feedback loop
  { 
    id: 'e16-6', 
    source: '16', 
    target: '6', 
    type: 'step', 
    zIndex: 50,
    sourceHandle: 's-right-middle', 
    targetHandle: 't-right-middle', 
    markerEnd: { ...markerOpt, color: '#cbd5e1' }, 
    style: { strokeDasharray: '6,6', stroke: '#cbd5e1', strokeWidth: 2 }
  },
];

export function FlowDiagram() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  return (
    <div className="w-full h-full min-h-[90vh]">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
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
      </ReactFlow>
    </div>
  );
}
