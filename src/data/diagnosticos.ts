import { initialNodes, initialEdges } from '../components/FlowDiagram';

export interface DiagnosisDef {
  name: string;
  description?: string;
  list?: string[];
  test?: string;
  nodes: string[];
  edges: string[];
  category: string;
}

const allDiagnosesMap = new Map<string, DiagnosisDef>();

const getCategoryForDiagnosis = (name: string): string => {
  const lower = name.toLowerCase();
  if (lower.includes('agrafia')) return 'Trastornos de la Escritura (Agrafias)';
  if (lower.includes('alexia') || lower.includes('ceguera para el significado')) return 'Trastornos de la Lectura (Alexias)';
  if (lower.includes('sordera') || lower.includes('agnosia fonológica auditiva') || lower.includes('agnosia profunda')) return 'Trastornos de la Comprensión Auditiva';
  return 'Trastornos Semánticos y de Producción Oral';
};

const processDeficit = (deficitInfo: any, sourceId: string, isNode: boolean) => {
  if (!deficitInfo || !deficitInfo.diagnosis) return;
  const diagnoses = Array.isArray(deficitInfo.diagnosis) ? deficitInfo.diagnosis : [deficitInfo.diagnosis];
  
  diagnoses.forEach((rawDiag: string) => {
    let diagName = rawDiag;
    if (rawDiag.startsWith('Alexia Profunda')) diagName = 'Alexia Profunda';
    if (rawDiag.startsWith('Agrafia Profunda')) diagName = 'Agrafia Profunda';
    if (rawDiag.startsWith('Agnosia Profunda')) diagName = 'Agnosia Profunda';

    let finalDescription = deficitInfo.text;
    let finalList = deficitInfo.list ? [...deficitInfo.list] : undefined;

    if (diagName === 'Alexia Profunda') {
      finalDescription = 'La Alexia Profunda surge de un daño combinado bloqueando tanto la ruta léxica visual como la ruta fonológica (Conversión grafema-fonema). El paciente se ve obligado a utilizar rutas parciales dañadas, conduciendo al síntoma cardinal: los paralexias semánticas.';
      finalList = [
        'Paralexias verbales semánticas (leer "mar" por "océano").',
        'Incapacidad rotunda para leer no-palabras o palabras inventadas.',
        'Mayor afectación perjudicial sobre las partículas gramaticales o palabras abstractas.'
      ];
    } else if (diagName === 'Agrafia Profunda') {
      finalDescription = 'La Agrafia Profunda es producto de un daño extenso que neutraliza la ruta léxica (Léxico Grafémico) junto con la ruta de conversión fonema-grafema. El sujeto pierde capacidades ortográficas formales y la habilidad de transformar sonidos en letras.';
      finalList = [
        'Paragrafias semánticas dramáticas (escribir "hora" dictándose "reloj").',
        'Nulidad absoluta en el deletreo o la copia de pseudopalabras dictadas.',
        'Notable facilidad residual en sustantivos figurativos en claro detrimento de los nexos gramaticales.'
      ];
    } else if (diagName === 'Agnosia Profunda') {
      finalDescription = 'La Agnosia o Sordera Profunda implica el daño simultáneo de la ruta léxica de acceso auditivo y el mecanismo subléxico de conversión acústico-fonológica. La comprensión oral remanente es precaria y defectuosa.';
      finalList = [
        'Fracaso sistemático al reiterar pseudopalabras transmitidas sonoramente.',
        'Errores de sustitución semántica desde la percepción auditiva.',
        'Experimenta el lenguaje ajeno con enormes lagunas reconociendo sólo rastros categoriales del mensaje acústico.'
      ];
    }

    if (!allDiagnosesMap.has(diagName)) {
      allDiagnosesMap.set(diagName, {
        name: diagName,
        description: finalDescription,
        list: finalList,
        test: deficitInfo.test,
        nodes: [],
        edges: [],
        category: getCategoryForDiagnosis(diagName)
      });
    }
    
    const diagData = allDiagnosesMap.get(diagName)!;
    if (isNode) {
      if (!diagData.nodes.includes(sourceId)) diagData.nodes.push(sourceId);
    } else {
      if (!diagData.edges.includes(sourceId)) diagData.edges.push(sourceId);
    }
  });
};

initialNodes.forEach((node: any) => {
  if (node.data?.expandedDetails?.deficit) {
    processDeficit(node.data.expandedDetails.deficit, node.id, true);
  }
});

initialEdges.forEach((edge: any) => {
  if (edge.data?.extendedDeficit) {
    processDeficit(edge.data.extendedDeficit, edge.id, false);
  } else if (edge.data?.deficit) {
    processDeficit(edge.data.deficit, edge.id, false);
  }
});

export const DIAGNOSTICOS: DiagnosisDef[] = Array.from(allDiagnosesMap.values()).sort((a,b) => a.name.localeCompare(b.name));

export const DIAGNOSTICOS_AGRUPADOS = DIAGNOSTICOS.reduce((acc, diag) => {
  if (!acc[diag.category]) {
    acc[diag.category] = [];
  }
  acc[diag.category].push(diag);
  return acc;
}, {} as Record<string, DiagnosisDef[]>);

