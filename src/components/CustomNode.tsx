import { Handle, Position } from '@xyflow/react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export function CustomNode({ data, isConnectable }: any) {
  const { label, category, hideHandles, function: nodeFunction, deficit: nodeDeficit } = data;

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

  const renderTooltip = () => (
    (nodeFunction || nodeDeficit) ? (
      <div className="absolute z-50 left-full ml-4 top-0 min-w-[250px] max-w-[300px] p-3 rounded-lg shadow-xl border bg-white opacity-0 group-hover/node:opacity-100 transition-opacity duration-200 pointer-events-none hidden group-hover/node:block text-left text-sm">
        <div className="absolute right-full top-4 border-r-8 border-r-white border-y-8 border-y-transparent w-0 h-0" style={{ transform: 'translateX(1px)' }}></div>
        {nodeFunction && (
          <div className="mb-2">
            <span className="font-bold text-slate-800 block text-xs uppercase tracking-wide">Función / Capacidad</span>
            <p className="text-slate-600 mt-1 font-normal leading-snug">{nodeFunction}</p>
          </div>
        )}
        {nodeDeficit && (
          <div>
            <span className="font-bold text-red-600 block text-xs uppercase tracking-wide">Déficit / Patología</span>
            <p className="text-red-500 mt-1 font-normal leading-snug">{nodeDeficit}</p>
          </div>
        )}
      </div>
    ) : null
  );

  if (category === 'io') {
    return (
      <div className="px-4 py-2 font-bold text-slate-600 border-2 border-slate-300 text-center text-sm md:text-base uppercase tracking-widest bg-white shadow-sm rounded-lg relative w-[180px] z-10 group/node">
        {renderHandles()}
        {label}
        {renderTooltip()}
      </div>
    );
  }

  const baseClasses = "w-[180px] min-h-[80px] p-4 text-center text-[14px] font-semibold z-10 relative rounded-[8px] border-2 flex flex-col justify-center items-center transition-all duration-200 group/node";
  let categoryClasses = "";
  
  if (category === 'input-process') {
    categoryClasses = "border-blue-400 bg-blue-50 text-blue-700 shadow-sm";
  } else if (category === 'motor-process' || category === 'storage') {
    categoryClasses = "border-emerald-400 bg-emerald-50 text-emerald-700 shadow-sm";
  } else if (category === 'semantic') {
    categoryClasses = "border-amber-500 bg-amber-50 text-amber-900 rounded-[24px] shadow-sm border-[3px]";
  } else if (category === 'conversion') {
    categoryClasses = "border-fuchsia-400 bg-fuchsia-50 text-fuchsia-800 shadow-sm";
  } else {
    // lexicon
    categoryClasses = "border-amber-400 bg-[#FFFBEB] text-slate-800 shadow-sm";
  }

  return (
    <div className={cn(baseClasses, categoryClasses)}>
      {renderHandles()}
      {label.split('\n').map((line: string, i: number) => (
        <span key={i} className="block whitespace-nowrap">{line}</span>
      ))}
      {renderTooltip()}
    </div>
  );
}
