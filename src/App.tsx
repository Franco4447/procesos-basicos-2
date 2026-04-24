import { useState, useEffect } from 'react';
import { FlowDiagram } from './components/FlowDiagram';
import { InfoContext } from './context/InfoContext';
import { X, BookOpen, BrainCircuit, MousePointer2, Info, Navigation, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [selectedInfo, setSelectedInfo] = useState<any>(null);
  const [showOnboarding, setShowOnboarding] = useState(true);

  // When clicking 'Más información'
  const handleShowInfo = (info: any) => {
    setSelectedInfo(info);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedInfo(null);
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
          <button 
            onClick={() => setShowOnboarding(true)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-slate-200 hover:text-white rounded-lg hover:bg-slate-700 transition-colors border border-slate-700"
          >
            <Info size={18} />
            <span>Ayuda</span>
          </button>
        </header>

        <main className="flex-1 w-full h-[calc(100vh-80px)] flex relative overflow-hidden">
          {/* Main Diagram Area */}
          <div className="flex-1 relative w-full h-full">
            <FlowDiagram />
          </div>

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
                                  Diagnóstico Clínico: {selectedInfo.expandedDetails.deficit.diagnosis}
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
                                    Diagnóstico: {selectedInfo.extendedDeficit.diagnosis}
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
