import {
  BaseEdge,
  EdgeLabelRenderer,
  getStraightPath,
  type EdgeProps,
} from '@xyflow/react';
import React, { useState } from 'react';
import { useInfo } from '../context/InfoContext';

export function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  style,
  markerEnd,
  data,
  selected,
}: EdgeProps) {
  const [isHovered, setIsHovered] = useState(false);
  const showInfo = useInfo();

  const [edgePath, labelX, labelY] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      
      {/* Invisible thicker path for easier hovering interaction */}
      <path
        d={edgePath}
        fill="none"
        stroke="transparent"
        strokeWidth={30}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ pointerEvents: 'all', cursor: 'help' }}
      />

      {/* Tooltip rendered safely via EdgeLabelRenderer (teleports out of SVG context) */}
      {((isHovered || selected) && data && (data.extendedFunction || data.extendedDeficit || data.function || data.deficit)) && (
        <EdgeLabelRenderer>
          <div
            className="absolute rounded-xl shadow-2xl border border-slate-300 bg-white p-4 text-sm z-[1500] transition-opacity pointer-events-auto cursor-auto"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
              transform: `translate(-50%, -50%)`,
              left: labelX,
              top: labelY,
              minWidth: '320px',
              maxWidth: '400px',
            }}
          >
            {(data.extendedFunction || data.function) && (
              <div className={(data.extendedDeficit || data.deficit) ? "mb-3" : "mb-2"}>
                <span className="font-bold text-slate-800 block text-[11px] uppercase tracking-wide mb-1">Proceso</span>
                {Array.isArray(data.extendedFunction) ? (
                  <ul className="list-disc pl-4 text-slate-600 mt-1 font-normal leading-snug space-y-1">
                    {data.extendedFunction.map((item: string, i: number) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-slate-600 mt-1 font-normal leading-snug">{(data.extendedFunction || data.function) as string}</p>
                )}
              </div>
            )}
            
            {(data.extendedDeficit || data.deficit) && (
              <div className="mt-3">
                <span className="font-bold text-red-600 block text-[11px] uppercase tracking-wide mb-1">Fallo Clínico</span>
                {data.extendedDeficit && typeof data.extendedDeficit === 'object' && data.extendedDeficit !== null && 'diagnosis' in data.extendedDeficit ? (
                  <div className="text-red-500 mt-1 font-normal leading-snug text-xs space-y-1">
                    {(data.extendedDeficit as any).diagnosis && <p className="font-bold mb-1 text-red-600">{(data.extendedDeficit as any).diagnosis}</p>}
                    {(data.extendedDeficit as any).deficits ? (
                      <ul className="list-disc pl-4 space-y-1">
                        {(data.extendedDeficit as any).deficits.map((item: string, i: number) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    ) : (
                      <p>{data.extendedDeficit as unknown as string}</p>
                    )}
                    {(data.extendedDeficit as any).test && (
                      <p className="pt-2 mt-2 border-t border-red-100">
                        <span className="font-semibold text-red-600">Test de evaluación:</span> {(data.extendedDeficit as any).test}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-red-500 mt-1 font-normal leading-snug">{(data.extendedDeficit || data.deficit) as string}</p>
                )}
              </div>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                showInfo({
                  label: 'Proceso de conexión',
                  extendedFunction: data.extendedFunction,
                  extendedDeficit: data.extendedDeficit,
                  function: data.function,
                  deficit: data.deficit
                });
              }}
              className="mt-3 px-3 py-1.5 w-full bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-semibold rounded transition-colors"
            >
              Más información
            </button>
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}
