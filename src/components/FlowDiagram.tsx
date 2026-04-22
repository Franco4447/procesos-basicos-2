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

const nodeTypes = {
  custom: CustomNode,
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
  { id: '2', type: 'custom', position: { x: 0, y: 200 }, data: { label: 'Análisis acústico', category: 'input-process' } },
  { id: '7', type: 'custom', position: { x: 1200, y: 200 }, data: { label: 'Análisis visual', category: 'input-process' } },
  
  // C5, G5: Input Lexicons
  { id: '3', type: 'custom', position: { x: 300, y: 400 }, data: { label: 'Léxico auditivo', category: 'lexicon' } },
  { id: '8', type: 'custom', position: { x: 900, y: 400 }, data: { label: 'Léxico visual', category: 'lexicon' } }, // G5
  
  // A7, H7: Conversions (peripheric)
  { id: '4', type: 'custom', position: { x: 0, y: 600 }, data: { label: 'Conversión\nacústico-fonológica', category: 'conversion' } },
  { id: '9', type: 'custom', position: { x: 1050, y: 600 }, data: { label: 'Conversión\ngrafema-fonema', category: 'conversion' } }, // H7
  
  // E6: Semantic System
  { id: '5', type: 'custom', position: { x: 600, y: 500 }, data: { label: 'Sistema\nsemántico', category: 'semantic' } }, // E6
  
  // C9, G9: Output Lexicons
  { id: '10', type: 'custom', position: { x: 300, y: 800 }, data: { label: 'Léxico fonológico', category: 'lexicon' } },
  { id: '11', type: 'custom', position: { x: 900, y: 800 }, data: { label: 'Léxico ortográfico', category: 'lexicon' } }, // G9
  
  // A11, I11: Storage / Buffers
  { id: '12', type: 'custom', position: { x: 0, y: 1000 }, data: { label: 'Almacén de\nfonemas', category: 'storage' } },
  { id: '14', type: 'custom', position: { x: 1200, y: 1000 }, data: { label: 'Almacén de\ngrafemas', category: 'storage' } },
  
  // E11: Conversion Output
  { id: '13', type: 'custom', position: { x: 600, y: 1000 }, data: { label: 'Conversión\nfonema-grafema', category: 'conversion' } },
  
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
  { id: 'e1-2', source: '1', target: '2', type: 'straight', zIndex: 50, sourceHandle: 's-bottom-center', targetHandle: 't-top-center', markerEnd: markerOpt, style: edgeStyle },
  // I1 -> I3 (Vertical)
  { id: 'e6-7', source: '6', target: '7', type: 'straight', zIndex: 50, sourceHandle: 's-bottom-center', targetHandle: 't-top-center', markerEnd: markerOpt, style: edgeStyle },
  
  // A3 -> C5 (Diagonal)
  { id: 'e2-3', source: '2', target: '3', type: 'straight', zIndex: 50, sourceHandle: 's-bottom-right', targetHandle: 't-top-center', markerEnd: markerOpt, style: edgeStyle },
  // I3 -> G5 (Diagonal)
  { id: 'e7-8', source: '7', target: '8', type: 'straight', zIndex: 50, sourceHandle: 's-bottom-left', targetHandle: 't-top-center', markerEnd: markerOpt, style: edgeStyle },
  
  // A3 -> A7 (Vertical)
  { id: 'e2-4', source: '2', target: '4', type: 'straight', zIndex: 50, sourceHandle: 's-bottom-left', targetHandle: 't-top-left', markerEnd: markerConvOpt, style: convEdgeStyle },
  // I3 -> H7 (Diagonal) 
  { id: 'e7-9', source: '7', target: '9', type: 'straight', zIndex: 50, sourceHandle: 's-bottom-center', targetHandle: 't-top-center', markerEnd: markerConvOpt, style: convEdgeStyle },
  // I3 -> I11 (Vertical / Direct visual route)
  { id: 'e7-14', source: '7', target: '14', type: 'straight', zIndex: 50, sourceHandle: 's-bottom-right', targetHandle: 't-top-right', markerEnd: markerOpt, style: dashedEdgeStyle },
  
  // C5 -> E6 (Diagonal)
  { id: 'e3-5', source: '3', target: '5', type: 'straight', zIndex: 50, sourceHandle: 's-right-middle', targetHandle: 't-top-left', markerEnd: markerOpt, style: edgeStyle },
  // G5 -> E6 (Diagonal)
  { id: 'e8-5', source: '8', target: '5', type: 'straight', zIndex: 50, sourceHandle: 's-left-middle', targetHandle: 't-top-right', markerEnd: markerOpt, style: edgeStyle },
  
  // C5 -> C9 (Vertical)
  { id: 'e3-10', source: '3', target: '10', type: 'straight', zIndex: 50, sourceHandle: 's-bottom-left', targetHandle: 't-top-left', markerEnd: markerOpt, style: dashedEdgeStyle },
  
  // G5 -> C9 (Léxico visual -> Léxico fonológico) 
  { id: 'e8-10', source: '8', target: '10', type: 'straight', zIndex: 50, sourceHandle: 's-bottom-left', targetHandle: 't-top-right', markerEnd: markerOpt, style: dashedEdgeStyle },
  
  // G5 -> G9 (Léxico visual -> Léxico ortográfico) 
  { id: 'e8-11', source: '8', target: '11', type: 'straight', zIndex: 50, sourceHandle: 's-bottom-right', targetHandle: 't-top-right', markerEnd: markerOpt, style: dashedEdgeStyle },
  
  // E6 -> C9 (Diagonal)
  { id: 'e5-10', source: '5', target: '10', type: 'straight', zIndex: 50, sourceHandle: 's-bottom-left', targetHandle: 't-top-center', markerEnd: markerOpt, style: edgeStyle },
  // E6 -> G9 (Diagonal)
  { id: 'e5-11', source: '5', target: '11', type: 'straight', zIndex: 50, sourceHandle: 's-bottom-right', targetHandle: 't-top-left', markerEnd: markerOpt, style: edgeStyle },
  
  // C9 -> G9 (Horizontal)
  { id: 'e10-11', source: '10', target: '11', type: 'straight', zIndex: 50, sourceHandle: 's-right-middle', targetHandle: 't-left-middle', markerEnd: markerOpt, style: edgeStyle },
  
  // C9 -> A11 (Diagonal)
  { id: 'e10-12', source: '10', target: '12', type: 'straight', zIndex: 50, sourceHandle: 's-bottom-center', targetHandle: 't-top-center', markerEnd: markerOpt, style: edgeStyle },
  // G9 -> I11 (Diagonal)
  { id: 'e11-14', source: '11', target: '14', type: 'straight', zIndex: 50, sourceHandle: 's-bottom-center', targetHandle: 't-top-left', markerEnd: markerOpt, style: edgeStyle },
  
  // A7 -> A11 (Vertical)
  { id: 'e4-12', source: '4', target: '12', type: 'straight', zIndex: 50, sourceHandle: 's-bottom-left', targetHandle: 't-top-left', markerEnd: markerConvOpt, style: convEdgeStyle },
  
  // H7 -> A11 (Conversión grafema-fonema -> Almacén de fonemas)
  { id: 'e9-12', source: '9', target: '12', type: 'straight', zIndex: 50, sourceHandle: 's-bottom-center', targetHandle: 't-top-right', markerEnd: markerConvOpt, style: convEdgeStyle },
  
  // A11 -> E11 (Horizontal)
  { id: 'e12-13', source: '12', target: '13', type: 'straight', zIndex: 50, sourceHandle: 's-right-middle', targetHandle: 't-left-middle', markerEnd: markerConvOpt, style: convEdgeStyle },
  // E11 -> I11 (Horizontal)
  { id: 'e13-14', source: '13', target: '14', type: 'straight', zIndex: 50, sourceHandle: 's-right-middle', targetHandle: 't-left-middle', markerEnd: markerConvOpt, style: convEdgeStyle },
  
  // A11 -> A13 (Vertical)
  { id: 'e12-15', source: '12', target: '15', type: 'straight', zIndex: 50, sourceHandle: 's-bottom-center', targetHandle: 't-top-center', markerEnd: markerOpt, style: edgeStyle },
  // I11 -> I13 (Vertical)
  { id: 'e14-16', source: '14', target: '16', type: 'straight', zIndex: 50, sourceHandle: 's-bottom-center', targetHandle: 't-top-center', markerEnd: markerOpt, style: edgeStyle },
  
  // Auditory feedback loop (Habla -> Palabra Oída)
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
  // Visual feedback loop (Escritura -> Palabra Leída)
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
        fitView
        fitViewOptions={{ padding: 0.1 }}
        minZoom={0.1}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        className="bg-slate-50"
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#cbd5e1" gap={20} size={1} />
        <Controls showInteractive={false} className="bg-white border-slate-200 shadow-sm rounded-md" />
      </ReactFlow>
    </div>
  );
}
