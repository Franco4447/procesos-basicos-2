import { Handle, Position } from '@xyflow/react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useState } from 'react';
import { useInfo } from '../context/InfoContext';

import { Info } from 'lucide-react';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export function CustomNode({ data, isConnectable, selected }: any) {
  const { label, category, hideHandles, extendedFunction, extendedDeficit, expandedDetails, isDamaged } = data;
  const [isHovered, setIsHovered] = useState(false);
  const showInfo = useInfo();
  
  // ... Handle damaged rendering classes ...
  let damagedClasses = isDamaged 
    ? "ring-4 ring-offset-2 ring-red-500 shadow-[0_0_20px_rgba(239,68,68,0.7)] animate-[pulse_2s_ease-in-out_infinite] border-red-500 !bg-red-50"
    : "";

  const deficitData = expandedDetails?.deficit || extendedDeficit;

  const handleClasses = "opacity-0";

  const renderHandles = () => (
    <>
      <Handle type="target" position={Position.Top} id="t-top-left" isConnectable={isConnectable} className={cn(handleClasses, "-translate-y-2")} style={{ left: '25%' }} />
      <Handle type="source" position={Position.Top} id="s-top-left" isConnectable={isConnectable} className={cn(handleClasses, "-translate-y-2")} style={{ left: '25%' }} />
      <Handle type="target" position={Position.Top} id="t-top-center" isConnectable={isConnectable} className={cn(handleClasses, "-translate-y-2")} style={{ left: '50%' }} />
      <Handle type="source" position={Position.Top} id="s-top-center" isConnectable={isConnectable} className={cn(handleClasses, "-translate-y-2")} style={{ left: '50%' }} />
      <Handle type="target" position={Position.Top} id="t-top-right" isConnectable={isConnectable} className={cn(handleClasses, "-translate-y-2")} style={{ left: '75%' }} />
      <Handle type="source" position={Position.Top} id="s-top-right" isConnectable={isConnectable} className={cn(handleClasses, "-translate-y-2")} style={{ left: '75%' }} />

      <Handle type="target" position={Position.Bottom} id="t-bottom-left" isConnectable={isConnectable} className={cn(handleClasses, "translate-y-2")} style={{ left: '25%' }} />
      <Handle type="source" position={Position.Bottom} id="s-bottom-left" isConnectable={isConnectable} className={cn(handleClasses, "translate-y-2")} style={{ left: '25%' }} />
      <Handle type="target" position={Position.Bottom} id="t-bottom-center" isConnectable={isConnectable} className={cn(handleClasses, "translate-y-2")} style={{ left: '50%' }} />
      <Handle type="source" position={Position.Bottom} id="s-bottom-center" isConnectable={isConnectable} className={cn(handleClasses, "translate-y-2")} style={{ left: '50%' }} />
      <Handle type="target" position={Position.Bottom} id="t-bottom-right" isConnectable={isConnectable} className={cn(handleClasses, "translate-y-2")} style={{ left: '75%' }} />
      <Handle type="source" position={Position.Bottom} id="s-bottom-right" isConnectable={isConnectable} className={cn(handleClasses, "translate-y-2")} style={{ left: '75%' }} />

      <Handle type="target" position={Position.Left} id="t-left-top" isConnectable={isConnectable} className={cn(handleClasses, "-translate-x-2")} style={{ top: '25%' }} />
      <Handle type="source" position={Position.Left} id="s-left-top" isConnectable={isConnectable} className={cn(handleClasses, "-translate-x-2")} style={{ top: '25%' }} />
      <Handle type="target" position={Position.Left} id="t-left-middle" isConnectable={isConnectable} className={cn(handleClasses, "-translate-x-2")} style={{ top: '50%' }} />
      <Handle type="source" position={Position.Left} id="s-left-middle" isConnectable={isConnectable} className={cn(handleClasses, "-translate-x-2")} style={{ top: '50%' }} />
      <Handle type="target" position={Position.Left} id="t-left-bottom" isConnectable={isConnectable} className={cn(handleClasses, "-translate-x-2")} style={{ top: '75%' }} />
      <Handle type="source" position={Position.Left} id="s-left-bottom" isConnectable={isConnectable} className={cn(handleClasses, "-translate-x-2")} style={{ top: '75%' }} />

      <Handle type="target" position={Position.Right} id="t-right-top" isConnectable={isConnectable} className={cn(handleClasses, "translate-x-2")} style={{ top: '25%' }} />
      <Handle type="source" position={Position.Right} id="s-right-top" isConnectable={isConnectable} className={cn(handleClasses, "translate-x-2")} style={{ top: '25%' }} />
      <Handle type="target" position={Position.Right} id="t-right-middle" isConnectable={isConnectable} className={cn(handleClasses, "translate-x-2")} style={{ top: '50%' }} />
      <Handle type="source" position={Position.Right} id="s-right-middle" isConnectable={isConnectable} className={cn(handleClasses, "translate-x-2")} style={{ top: '50%' }} />
      <Handle type="target" position={Position.Right} id="t-right-bottom" isConnectable={isConnectable} className={cn(handleClasses, "translate-x-2")} style={{ top: '75%' }} />
      <Handle type="source" position={Position.Right} id="s-right-bottom" isConnectable={isConnectable} className={cn(handleClasses, "translate-x-2")} style={{ top: '75%' }} />
    </>
  );

  const renderTooltip = () => {
    if (!extendedFunction && !deficitData) return null;

    return (
      <div 
        className={cn(
          "absolute z-[1000] left-[105%] top-1/2 -translate-y-1/2 min-w-[320px] max-w-[400px] p-4 rounded-xl shadow-2xl border border-slate-200 bg-white text-left text-sm pointer-events-auto cursor-auto transition-all duration-300 origin-left",
          (isHovered || selected) 
            ? "opacity-100 visible scale-100 translate-x-0" 
            : "opacity-0 invisible scale-95 -translate-x-2"
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="absolute right-full top-1/2 -translate-y-1/2 border-r-[10px] border-r-white border-y-[10px] border-y-transparent w-0 h-0" style={{ transform: 'translateX(1px)' }}></div>
        
        {extendedFunction && (
          <div className={deficitData ? "mb-3" : "mb-2"}>
            <span className="font-bold text-slate-800 block text-[11px] uppercase tracking-wide mb-1">Función / Capacidad</span>
            <ul className="list-disc pl-4 text-slate-600 mt-1 font-normal leading-snug space-y-1">
              {Array.isArray(extendedFunction) ? extendedFunction.map((item: string, i: number) => (
                <li key={i}>{item}</li>
              )) : <li>{extendedFunction}</li>}
            </ul>
          </div>
        )}

        {deficitData && (
          <div className="mt-3">
            <span className="font-bold text-red-600 block text-[11px] uppercase tracking-wide mb-1">Déficit / Patología</span>
            <div className="text-red-500 mt-1 font-normal leading-snug text-xs space-y-1">
              {deficitData.diagnosis && (
                Array.isArray(deficitData.diagnosis) ? (
                  <ul className="list-disc pl-4 font-bold mb-1 text-red-600">
                    {deficitData.diagnosis.map((diag: string, i: number) => (
                      <li key={i}>{diag}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="font-bold mb-1 text-red-600">{deficitData.diagnosis}</p>
                )
              )}
              {deficitData.text && <p className="text-red-900/80 mt-1">{deficitData.text}</p>}
              {(!deficitData.text && deficitData.deficits) && (
                <ul className="list-disc pl-4 space-y-1">
                  {deficitData.deficits.map((item: string, i: number) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              )}
              {(!deficitData.text && !deficitData.deficits && typeof deficitData === 'string') && (
                <p>{deficitData}</p>
              )}
            </div>
          </div>
        )}
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            showInfo(data);
          }}
          className="mt-4 px-3 py-2 w-full bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white active:scale-95 text-[13px] font-semibold rounded-lg shadow-sm hover:shadow-md outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 transition-all duration-200 flex justify-center items-center gap-2"
        >
          <Info size={16} />
          Más información
        </button>
      </div>
    );
  };

  if (category === 'io') {
    return (
      <div 
        className={cn("px-5 py-3 font-bold text-slate-700 border-2 border-slate-300 text-center text-sm md:text-base uppercase tracking-[0.2em] bg-white shadow-sm rounded-xl relative w-[180px] cursor-help hover:border-slate-400 hover:shadow-md transition-all duration-300 hover:ring-4 hover:ring-slate-200 active:scale-[0.98]", damagedClasses)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {renderHandles()}
        <span className={cn("bg-clip-text text-transparent bg-gradient-to-r", isDamaged ? "from-red-700 to-red-500" : "from-slate-700 to-slate-500")}>{label}</span>
        {renderTooltip()}
      </div>
    );
  }

  const baseClasses = "w-[190px] min-h-[85px] p-5 text-center text-[15px] font-semibold relative rounded-xl border-2 flex flex-col justify-center items-center cursor-help transition-all duration-300 hover:-translate-y-1 hover:shadow-xl active:scale-[0.98]";
  let categoryClasses = "";
  
  if (category === 'input-process') {
    categoryClasses = "border-blue-400/80 bg-gradient-to-br from-blue-50 to-blue-100/50 text-blue-800 shadow-md shadow-blue-500/10 hover:ring-4 hover:ring-blue-400/20";
  } else if (category === 'motor-process' || category === 'storage') {
    categoryClasses = "border-emerald-400/80 bg-gradient-to-br from-emerald-50 to-emerald-100/50 text-emerald-800 shadow-md shadow-emerald-500/10 hover:ring-4 hover:ring-emerald-400/20";
  } else if (category === 'semantic') {
    categoryClasses = "border-amber-500 bg-gradient-to-br from-amber-50 to-orange-50 text-amber-950 rounded-[28px] shadow-lg shadow-amber-500/15 border-[3px] hover:ring-4 hover:ring-amber-500/20";
  } else if (category === 'conversion') {
    categoryClasses = "border-fuchsia-400/80 bg-gradient-to-br from-fuchsia-50 to-purple-50 text-fuchsia-900 shadow-md shadow-fuchsia-500/10 hover:ring-4 hover:ring-fuchsia-400/20";
  } else {
    // lexicon
    categoryClasses = "border-amber-400/80 bg-gradient-to-br from-[#FFFBEB] to-[#FEF3C7] text-amber-900 shadow-md shadow-amber-500/10 hover:ring-4 hover:ring-amber-400/20";
  }

  return (
    <div 
      className={cn(baseClasses, categoryClasses, damagedClasses)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {renderHandles()}
      <div className="flex flex-col items-center justify-center space-y-0.5">
        {label.split('\n').map((line: string, i: number) => (
          <span key={i} className="block whitespace-nowrap leading-tight">{line}</span>
        ))}
      </div>
      {renderTooltip()}
    </div>
  );
}
