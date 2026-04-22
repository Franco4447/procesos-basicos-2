import { FlowDiagram } from './components/FlowDiagram';

export default function App() {
  return (
    <div className="w-screen h-screen overflow-hidden flex flex-col bg-slate-50 font-sans text-slate-800">
      <header className="h-[80px] px-10 bg-slate-900 border-b border-slate-800 shadow-sm flex items-center justify-between z-10 w-full shrink-0">
        <div>
          <h1 className="text-[24px] font-semibold text-white tracking-tight">Arquitectura del Procesamiento Lingüístico</h1>
          <p className="text-[14px] text-white/80 mt-1">Entendimiento y Producción de Lenguaje Oral y Escrito</p>
        </div>
      </header>
      <main className="flex-1 w-full h-[calc(100vh-80px)] flex">
        <div className="flex-1 relative w-full h-full">
          <FlowDiagram />
        </div>
      </main>
    </div>
  );
}
