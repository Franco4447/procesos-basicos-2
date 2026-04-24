import { useState, useEffect } from 'react';
import { FlowDiagram, RouteDef } from './components/FlowDiagram';
import { InfoContext } from './context/InfoContext';
import { DIAGNOSTICOS_AGRUPADOS, DiagnosisDef } from './data/diagnosticos';
import { X, BookOpen, BrainCircuit, MousePointer2, Info, Navigation, Play, Route as RouteIcon, Map, Activity, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const GRUPOS_RUTAS = [
  {
    title: 'Lectura',
    routes: [
      {
        id: 'lectura-lexica',
        name: 'Ruta Léxico-semántica',
        description: 'Permite leer palabras conocidas comprendiendo su significado.',
        nodes: ['6', '7', '8', '5', '10', '12', '15'],
        edges: ['e6-7', 'e7-8', 'e8-5', 'e5-10', 'e10-12', 'e12-15']
      },
      {
        id: 'lectura-asemantica',
        name: 'Ruta Léxica Asemántica',
        description: 'Permite leer palabras regulares e irregulares conocidas evadiendo su comprensión.',
        nodes: ['6', '7', '8', '10', '12', '15'],
        edges: ['e6-7', 'e7-8', 'e8-10', 'e10-12', 'e12-15']
      },
      {
        id: 'lectura-fonologica',
        name: 'Ruta Subléxica (Fonológica)',
        description: 'Permite leer pseudopalabras aplicando reglas de conversión grafema a fonema.',
        nodes: ['6', '7', '9', '12', '15'],
        edges: ['e6-7', 'e7-9', 'e9-12', 'e12-15']
      }
    ]
  },
  {
    title: 'Escritura al Dictado',
    routes: [
      {
        id: 'escritura-lexica',
        name: 'Ruta Léxico-semántica',
        description: 'Permite escribir al dictado palabras familiares comprendiendo su significado.',
        nodes: ['1', '2', '3', '5', '11', '14', '16'],
        edges: ['e1-2', 'e2-3', 'e3-5', 'e5-11', 'e11-14', 'e14-16']
      },
      {
        id: 'escritura-fonologica',
        name: 'Ruta Subléxica (Fonológica)',
        description: 'Permite escribir al dictado palabras desconocidas aplicando decodificación fonema-grafema.',
        nodes: ['1', '2', '4', '12', '13', '14', '16'],
        edges: ['e1-2', 'e2-4', 'e4-12', 'e12-13', 'e13-14', 'e14-16']
      }
    ]
  },
  {
    title: 'Repetición Oral',
    routes: [
      {
        id: 'repeticion-lexica',
        name: 'Ruta Léxico-semántica',
        description: 'Repetición de palabras de forma consciente y medidada por la comprensión.',
        nodes: ['1', '2', '3', '5', '10', '12', '15'],
        edges: ['e1-2', 'e2-3', 'e3-5', 'e5-10', 'e10-12', 'e12-15']
      },
      {
        id: 'repeticion-asemantica',
        name: 'Ruta Léxica Asemántica',
        description: 'Repetición de palabras conocidas velozmente, sin pensar en su significado.',
        nodes: ['1', '2', '3', '10', '12', '15'],
        edges: ['e1-2', 'e2-3', 'e3-10', 'e10-12', 'e12-15']
      },
      {
        id: 'repeticion-perilexica',
        name: 'Ruta Periléxica (Subléxica)',
        description: 'Permite la repetición acústico-fonológica pasiva de palabras desconocidas o inventadas.',
        nodes: ['1', '2', '4', '12', '15'],
        edges: ['e1-2', 'e2-4', 'e4-12', 'e12-15']
      }
    ]
  },
  {
    title: 'Producción Espontánea',
    routes: [
      {
        id: 'denominacion-oral',
        name: 'Denominación Oral / Habla Espontánea',
        description: 'Producción oral a partir de ideas previas o al reconocer conceptualmente un dibujo.',
        nodes: ['5', '10', '12', '15'],
        edges: ['e5-10', 'e10-12', 'e12-15']
      },
      {
        id: 'denominacion-escrita',
        name: 'Denominación / Escritura Espontánea',
        description: 'Expresión escrita espontánea desencadenada a partir de los propios conceptos y vivencias.',
        nodes: ['5', '11', '14', '16'],
        edges: ['e5-11', 'e11-14', 'e14-16']
      }
    ]
  },
  {
    title: 'Copia',
    routes: [
      {
        id: 'copia-lexica',
        name: 'Ruta Léxico-semántica',
        description: 'Mecanismo de copia de textos comprensiva y reflexiva pasando por la internalización del mensaje.',
        nodes: ['6', '7', '8', '5', '11', '14', '16'],
        edges: ['e6-7', 'e7-8', 'e8-5', 'e5-11', 'e11-14', 'e14-16']
      },
      {
        id: 'copia-asemantica',
        name: 'Ruta Léxica Asemántica',
        description: 'Copia de vocablos aprendidos evitando reflexionar en sus significados (dicción caligráfica directa).',
        nodes: ['6', '7', '8', '11', '14', '16'],
        edges: ['e6-7', 'e7-8', 'e8-11', 'e11-14', 'e14-16']
      },
      {
        id: 'copia-directa',
        name: 'Ruta Periléxica (Copia Servil)',
        description: 'Constituye la copia o "calco" puro de caracteres extraños que no entendemos ni conocemos visuo-gráficamente.',
        nodes: ['6', '7', '14', '16'],
        edges: ['e6-7', 'e7-14', 'e14-16']
      }
    ]
  }
];

const getFilterCategory = (diagName: string) => {
  const lower = diagName.toLowerCase();
  if (lower.includes('pura') || lower.includes('puro') || lower.includes('anartria') || lower.includes('apraxia')) return 'Pura';
  if (lower.includes('superficie')) return 'de Superficie';
  if (lower.includes('fonológic') || lower.includes('fonologic')) return 'Fonológico';
  if (lower.includes('significado')) return 'del Significado';
  if (lower.includes('profund')) return 'Profundo';
  return null;
};

export default function App() {
  const [selectedInfo, setSelectedInfo] = useState<any>(null);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [showRoutesPanel, setShowRoutesPanel] = useState(false);
  const [showDiagnosesPanel, setShowDiagnosesPanel] = useState(false);
  const [activeRoute, setActiveRoute] = useState<RouteDef | null>(null);
  const [activeDiagnosis, setActiveDiagnosis] = useState<DiagnosisDef | null>(null);
  const [activeDiagFilter, setActiveDiagFilter] = useState<string | null>(null);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const filterOptions = [
    { id: 'Pura', label: 'Pura (Niveles periféricos)' },
    { id: 'de Superficie', label: 'de Superficie (Nivel léxico)' },
    { id: 'Fonológico', label: 'Fonológico (Nivel subléxico)' },
    { id: 'del Significado', label: 'del Significado (Nivel semántico)' },
    { id: 'Profundo', label: 'Profundo (Rutas múltiples)' }
  ];

  const filteredDiagnosesMap = Object.entries(DIAGNOSTICOS_AGRUPADOS).reduce((acc, [category, diagnoses]) => {
    const filtered = diagnoses.filter(diag => {
      if (!activeDiagFilter) return true;
      const filterCat = getFilterCategory(diag.name);
      return filterCat === activeDiagFilter;
    });
    if (filtered.length > 0) {
      acc[category] = filtered;
    }
    return acc;
  }, {} as Record<string, DiagnosisDef[]>);

  // When clicking 'Más información'
  const handleShowInfo = (info: any) => {
    setSelectedInfo(info);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedInfo(null);
        setShowRoutesPanel(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <InfoContext.Provider value={handleShowInfo}>
      <div className="w-screen h-screen overflow-hidden flex flex-col bg-slate-50 font-sans text-slate-800">
        <header className="h-[80px] px-10 bg-slate-900 border-b border-slate-800 shadow-sm flex items-center justify-between z-10 w-full shrink-0">
          <div>
            <h1 className="text-[24px] font-semibold text-white tracking-tight">Arquitectura del Procesamiento Lingüístico</h1>
            <p className="text-[14px] text-white/80 mt-1">Entendimiento y Producción de Lenguaje Oral y Escrito</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => { setShowDiagnosesPanel(true); setShowRoutesPanel(false); }}
              className={`flex items-center gap-2 px-4 py-2 text-slate-200 hover:text-white rounded-lg transition-colors border border-slate-700 ${showDiagnosesPanel ? 'bg-slate-700 text-white' : 'bg-slate-800 hover:bg-slate-700'}`}
            >
               <Activity size={18} />
               <span>Diagnósticos</span>
            </button>
            <button 
              onClick={() => { setShowRoutesPanel(true); setShowDiagnosesPanel(false); }}
              className={`flex items-center gap-2 px-4 py-2 text-slate-200 hover:text-white rounded-lg transition-colors border border-slate-700 ${showRoutesPanel ? 'bg-slate-700 text-white' : 'bg-slate-800 hover:bg-slate-700'}`}
            >
               <Map size={18} />
               <span>Rutas</span>
            </button>
            <button 
              onClick={() => setShowOnboarding(true)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-slate-200 hover:text-white rounded-lg hover:bg-slate-700 transition-colors border border-slate-700"
            >
              <Info size={18} />
              <span>Ayuda</span>
            </button>
          </div>
        </header>

        <main className="flex-1 w-full h-[calc(100vh-80px)] flex relative overflow-hidden">
          {/* Main Diagram Area */}
          <div className="flex-1 relative w-full h-full">
            <FlowDiagram activeRoute={activeRoute} activeDiagnosis={activeDiagnosis} />
          </div>

          {/* Rutas Panel (Left Side) */}
          <AnimatePresence>
            {showRoutesPanel && (
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="w-80 md:w-96 h-full bg-white border-r border-slate-200 shadow-2xl absolute left-0 top-0 z-[1500] flex flex-col"
              >
                <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                  <div className="flex items-center gap-2 text-slate-800">
                    <RouteIcon size={20} />
                    <h2 className="font-bold tracking-tight text-lg">Rutas de Procesamiento</h2>
                  </div>
                  <button
                    onClick={() => {
                      setShowRoutesPanel(false);
                      setActiveRoute(null);
                    }}
                    className="p-1.5 hover:bg-slate-200 text-slate-500 hover:text-slate-800 rounded-md transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                  {GRUPOS_RUTAS.map((grupo) => (
                    <div key={grupo.title}>
                      <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">{grupo.title}</h3>
                      <div className="space-y-2">
                        {grupo.routes.map((route) => {
                          const isActive = activeRoute?.id === route.id;
                          return (
                            <button
                              key={route.id}
                              onClick={() => isActive ? setActiveRoute(null) : setActiveRoute(route)}
                              className={`w-full text-left p-3 rounded-xl border transition-all ${isActive ? 'bg-blue-50 border-blue-200 ring-1 ring-blue-500 shadow-sm' : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'}`}
                            >
                              <h4 className={`font-semibold text-sm ${isActive ? 'text-blue-700' : 'text-slate-700'}`}>{route.name}</h4>
                              <p className="text-xs text-slate-500 mt-1 leading-snug">{route.description}</p>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Diagnoses Panel (Left Side) */}
          <AnimatePresence>
            {showDiagnosesPanel && (
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="w-80 md:w-96 h-full bg-white border-r border-slate-200 shadow-2xl absolute left-0 top-0 z-[1500] flex flex-col"
              >
                <div className="p-5 border-b border-red-100 flex items-center justify-between bg-red-50">
                  <div className="flex items-center gap-2 text-red-800">
                    <Activity size={20} />
                    <h2 className="font-bold tracking-tight text-lg">Diagnósticos</h2>
                  </div>
                  <button
                    onClick={() => {
                      setShowDiagnosesPanel(false);
                      setActiveDiagnosis(null);
                    }}
                    className="p-1.5 hover:bg-red-200 text-red-500 hover:text-red-800 rounded-md transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 flex flex-col">
                  
                  {/* Dropdown de Filtro */}
                  <div className="mb-4 relative">
                    <label className="block text-xs font-bold text-slate-500 mb-1.5 px-1 uppercase tracking-wider">Filtro por tipo</label>
                    <button 
                      onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                      onBlur={() => setTimeout(() => setShowFilterDropdown(false), 150)}
                      className="w-full flex items-center justify-between bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
                    >
                      <span className="flex items-center gap-2">
                        {activeDiagFilter ? (
                          <>
                            <div className="w-2 h-2 rounded-full bg-red-500" />
                            <span className="text-red-700">{filterOptions.find(o => o.id === activeDiagFilter)?.label}</span>
                          </>
                        ) : (
                          'Todos los tipos'
                        )}
                      </span>
                      <ChevronDown size={16} className={`text-slate-400 transition-transform duration-200 ${showFilterDropdown ? 'rotate-180' : ''}`} />
                    </button>
                    
                    <AnimatePresence>
                      {showFilterDropdown && (
                         <motion.div 
                           initial={{ opacity: 0, y: -5, scale: 0.98 }} 
                           animate={{ opacity: 1, y: 0, scale: 1 }} 
                           exit={{ opacity: 0, y: -5, scale: 0.98 }}
                           transition={{ duration: 0.15 }}
                           className="absolute z-10 w-full mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden"
                         >
                           <button
                             onMouseDown={(e) => e.preventDefault()}
                             onClick={() => { setActiveDiagFilter(null); setShowFilterDropdown(false); }}
                             className={`w-full text-left px-3 py-2.5 text-sm transition-colors flex items-center justify-between ${!activeDiagFilter ? 'bg-slate-50 text-slate-800 font-semibold' : 'text-slate-600 hover:bg-slate-50'}`}
                           >
                             Todos los tipos
                             {!activeDiagFilter && <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />}
                           </button>
                           {filterOptions.map(opt => (
                             <button
                               key={opt.id}
                               onMouseDown={(e) => e.preventDefault()}
                               onClick={() => {
                                 if (activeDiagFilter === opt.id) {
                                   setActiveDiagFilter(null);
                                 } else {
                                   setActiveDiagFilter(opt.id);
                                 }
                                 setShowFilterDropdown(false);
                               }}
                               className={`w-full text-left px-3 py-2.5 text-sm transition-colors flex items-center justify-between border-t border-slate-50 ${activeDiagFilter === opt.id ? 'bg-red-50/50 text-red-700 font-semibold' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'}`}
                             >
                               {opt.label}
                               {activeDiagFilter === opt.id && <div className="w-1.5 h-1.5 rounded-full bg-red-500" />}
                             </button>
                           ))}
                         </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="flex-1 space-y-6">
                    {Object.entries(filteredDiagnosesMap).length === 0 ? (
                      <div className="p-4 text-center mt-6">
                        <p className="text-slate-500 text-sm italic">No hay diagnósticos que coincidan con este filtro.</p>
                      </div>
                    ) : (
                      Object.entries(filteredDiagnosesMap).map(([category, diagnoses]) => (
                        <div key={category}>
                          <h3 className="font-bold text-slate-800 border-b border-slate-200 pb-2 mb-3 text-sm">{category}</h3>
                          <div className="space-y-2">
                            {diagnoses.map((diag) => {
                              const isActive = activeDiagnosis?.name === diag.name;
                              return (
                                <button
                                  key={diag.name}
                                  onClick={() => isActive ? setActiveDiagnosis(null) : setActiveDiagnosis(diag)}
                                  className={`w-full text-left p-3 rounded-xl border transition-all ${isActive ? 'bg-red-50 border-red-200 ring-1 ring-red-500 shadow-sm' : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'}`}
                                >
                                  <h4 className={`font-semibold text-sm ${isActive ? 'text-red-700' : 'text-slate-700'}`}>{diag.name}</h4>
                                  {isActive && diag.description && (
                                    <div className="mt-2 text-xs text-red-900/80 leading-snug">
                                      <p>{diag.description}</p>
                                      {diag.list && diag.list.length > 0 && (
                                        <ul className="list-disc pl-4 mt-2 space-y-1">
                                          {diag.list.map((item, idx) => (
                                            <li key={idx}>{item}</li>
                                          ))}
                                        </ul>
                                      )}
                                    </div>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Onboarding Modal */}
          <AnimatePresence>
            {showOnboarding && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[5000] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4"
              >
                <motion.div
                  initial={{ scale: 0.95, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.95, opacity: 0, y: 20 }}
                  className="bg-white rounded-2xl shadow-2xl max-w-xl w-full p-6 relative overflow-hidden flex flex-col max-h-[90vh]"
                >
                  <button
                    onClick={() => setShowOnboarding(false)}
                    className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors"
                  >
                    <X size={24} />
                  </button>
                  
                  <div className="mb-5 border-b border-slate-100 pb-5 pr-8">
                    <h2 className="text-2xl font-bold text-slate-800 tracking-tight leading-tight">
                      Modelo Cognitivo del Lenguaje
                    </h2>
                    <p className="text-slate-500 mt-1.5 text-sm">
                      Basado en los esquemas de procesamiento léxico de Ellis & Young (1988) y Patterson & Shewell (1987).
                    </p>
                  </div>
                  
                  <div className="overflow-y-auto pr-2 space-y-5">
                    <p className="text-base text-slate-700 leading-relaxed">
                      Este diagrama interactivo permite explorar las rutas mentales subyacentes a la lectura, escritura, comprensión y habla, así como las patologías (p.ej. afasias, dislexias) originadas por el daño en los diferentes módulos.
                    </p>
                    
                    <div className="grid gap-3">
                      <div className="flex gap-4 items-start p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                        <div className="p-2.5 bg-blue-100 text-blue-600 rounded-lg shrink-0">
                          <MousePointer2 size={20} />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-800 text-base">Resaltado de Rutas</h4>
                          <p className="text-slate-600 text-sm mt-0.5 leading-relaxed">Sitúa el cursor sobre cualquier módulo para iluminar instantáneamente las vías de procesamiento involucradas hacia atrás y hacia delante.</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-4 items-start p-4 bg-amber-50/50 rounded-xl border border-amber-100">
                        <div className="p-2.5 bg-amber-100 text-amber-600 rounded-lg shrink-0">
                          <BookOpen size={20} />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-800 text-base">Exploración Clínica</h4>
                          <p className="text-slate-600 text-sm mt-0.5 leading-relaxed">Haz clic en <strong>"+ Info"</strong> o "Más información" de cualquier módulo para abrir el panel con su descripción neurocognitiva sistemática y patología asociada.</p>
                        </div>
                      </div>

                      <div className="flex gap-4 items-start p-4 bg-emerald-50/50 rounded-xl border border-emerald-100">
                        <div className="p-2.5 bg-emerald-100 text-emerald-600 rounded-lg shrink-0">
                          <Navigation size={20} />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-800 text-base">Navegación</h4>
                          <p className="text-slate-600 text-sm mt-0.5 leading-relaxed">Utiliza la rueda del ratón para hacer zoom, arrastra para moverte por el lienzo, o ayúdate del mapa de la esquina inferior derecha.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-5 border-t border-slate-100 flex justify-end">
                    <button 
                      onClick={() => setShowOnboarding(false)}
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-semibold shadow-md shadow-blue-600/20 transition-all active:scale-95 text-sm"
                    >
                      <span>Empezar a explorar</span>
                      <Play size={16} className="fill-current" />
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Right Side Panel (Half screen width) */}
          <AnimatePresence>
            {selectedInfo && (
              <>
                <motion.div
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="panel-title"
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  className="w-1/2 h-full bg-white border-l border-slate-200 shadow-2xl absolute right-0 top-0 z-[2000] flex flex-col focus:outline-none"
                  tabIndex={-1}
                >
                  <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
                    <h2 id="panel-title" className="text-2xl font-bold tracking-tight text-slate-800">
                      {selectedInfo.label}
                    </h2>
                    <button
                      onClick={() => setSelectedInfo(null)}
                      className="p-2 hover:bg-slate-200 text-slate-500 hover:text-slate-800 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                      aria-label="Cerrar panel"
                      title="Cerrar panel"
                    >
                      <X size={24} />
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto p-10 space-y-8">
                    {/* Detailed Content */}
                    {selectedInfo.expandedDetails ? (
                      <div className="space-y-10">
                        {/* Intro/Description */}
                        {selectedInfo.expandedDetails.description && (
                          <p className="text-lg text-slate-700 leading-relaxed">
                            {selectedInfo.expandedDetails.description}
                          </p>
                        )}
                        
                        {/* Función Extended */}
                        {selectedInfo.expandedDetails.function && (
                          <section>
                            <div className="flex items-center gap-2 mb-4">
                              <BookOpen className="text-blue-600" size={26} />
                              <h3 className="text-2xl font-bold text-slate-800">
                                {selectedInfo.expandedDetails.function.title || "Función y Mecanismo"}
                              </h3>
                            </div>
                            <div className="bg-blue-50/70 p-6 rounded-2xl border border-blue-100 shadow-sm">
                              <p className="text-slate-800 leading-relaxed text-lg mb-4">
                                {selectedInfo.expandedDetails.function.text}
                              </p>
                              {selectedInfo.expandedDetails.function.list && (
                                <ul className="list-disc pl-6 space-y-3 text-slate-700 text-lg marker:text-blue-400">
                                  {selectedInfo.expandedDetails.function.list.map((item: string, i: number) => (
                                    <li key={i}>{item}</li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          </section>
                        )}

                        {/* Deficit Extended */}
                        {selectedInfo.expandedDetails.deficit && (
                          <section>
                            <div className="flex items-center gap-2 mb-4">
                              <BrainCircuit className="text-red-500" size={26} />
                              <h3 className="text-2xl font-bold text-slate-800">
                                {selectedInfo.expandedDetails.deficit.title || "Patología y Trastornos Asociados"}
                              </h3>
                            </div>
                            <div className="bg-red-50/70 p-6 rounded-2xl border border-red-100 shadow-sm text-lg">
                              {selectedInfo.expandedDetails.deficit.diagnosis && (
                                <div className="mb-4 inline-block bg-red-100 text-red-900 px-4 py-2 rounded-lg font-bold border border-red-200">
                                  Diagnóstico Clínico: {Array.isArray(selectedInfo.expandedDetails.deficit.diagnosis) 
                                    ? selectedInfo.expandedDetails.deficit.diagnosis.join(' / ') 
                                    : selectedInfo.expandedDetails.deficit.diagnosis}
                                </div>
                              )}
                              {selectedInfo.expandedDetails.deficit.text && (
                                <p className="text-red-950/90 leading-relaxed mb-4">
                                  {selectedInfo.expandedDetails.deficit.text}
                                </p>
                              )}
                              {selectedInfo.expandedDetails.deficit.list && (
                                <div className="mb-5">
                                  <p className="font-semibold text-red-900 mb-3">Manifestaciones principales:</p>
                                  <ul className="list-disc pl-6 space-y-3 text-red-900/80 marker:text-red-400">
                                    {selectedInfo.expandedDetails.deficit.list.map((item: string, i: number) => (
                                      <li key={i}>{item}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              {selectedInfo.expandedDetails.deficit.test && (
                                <div className="pt-4 border-t border-red-200/60 mt-4">
                                  <span className="font-bold text-red-900">Método de Evaluación:</span>{' '}
                                  <span className="text-red-900/90">{selectedInfo.expandedDetails.deficit.test}</span>
                                </div>
                              )}
                            </div>
                          </section>
                        )}
                      </div>
                    ) : (
                      <>
                        {/* Fallback for nodes without expandedDetails */}
                        {(selectedInfo.extendedFunction || selectedInfo.function) && (
                          <section>
                            <div className="flex items-center gap-2 mb-4">
                              <BookOpen className="text-blue-500" size={24} />
                              <h3 className="text-xl font-bold text-slate-800">Función y Capacidades</h3>
                            </div>
                            <div className="bg-blue-50/50 p-6 rounded-xl border border-blue-100">
                              {Array.isArray(selectedInfo.extendedFunction) ? (
                                <ul className="list-disc pl-5 space-y-2 text-slate-700 text-lg">
                                  {selectedInfo.extendedFunction.map((item: string, i: number) => (
                                    <li key={i}>{item}</li>
                                  ))}
                                </ul>
                              ) : (
                                <p className="text-slate-700 leading-relaxed text-lg">
                                  {selectedInfo.extendedFunction || selectedInfo.function}
                                </p>
                              )}
                            </div>
                          </section>
                        )}

                        {(selectedInfo.extendedDeficit || selectedInfo.deficit) && (
                          <section>
                            <div className="flex items-center gap-2 mb-4">
                              <BrainCircuit className="text-red-500" size={24} />
                              <h3 className="text-xl font-bold text-slate-800">Patología y Déficit</h3>
                            </div>
                            <div className="bg-red-50/50 p-6 rounded-xl border border-red-100 text-red-900 text-lg">
                              {typeof selectedInfo.extendedDeficit === 'object' && selectedInfo.extendedDeficit !== null ? (
                                <div className="space-y-4">
                                  <p className="font-semibold text-xl">
                                    Diagnóstico: {Array.isArray(selectedInfo.extendedDeficit.diagnosis) 
                                      ? selectedInfo.extendedDeficit.diagnosis.join(' / ') 
                                      : selectedInfo.extendedDeficit.diagnosis}
                                  </p>
                                  <div>
                                    <p className="font-semibold mb-2">Déficits principales:</p>
                                    <ul className="list-disc pl-5 space-y-2">
                                      {selectedInfo.extendedDeficit.deficits.map((item: string, i: number) => (
                                        <li key={i}>{item}</li>
                                      ))}
                                    </ul>
                                  </div>
                                  <p className="pt-2 border-t border-red-200">
                                    <span className="font-semibold">Test de evaluación:</span> {selectedInfo.extendedDeficit.test}
                                  </p>
                                </div>
                              ) : (
                                <p className="leading-relaxed">
                                  {selectedInfo.extendedDeficit || selectedInfo.deficit}
                                </p>
                              )}
                            </div>
                          </section>
                        )}
                      </>
                    )}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </main>
      </div>
    </InfoContext.Provider>
  );
}
