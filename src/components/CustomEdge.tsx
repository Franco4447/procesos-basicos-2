import {
  BaseEdge,
  EdgeLabelRenderer,
  getStraightPath,
  type EdgeProps,
} from '@xyflow/react';
import React, { useState } from 'react';

export function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  style,
  markerEnd,
  data,
}: EdgeProps) {
  const [isHovered, setIsHovered] = useState(false);

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
        strokeOpacity={0}
        strokeWidth={20}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="react-flow__edge-interaction"
      />

      {/* Tooltip rendered safely via EdgeLabelRenderer (teleports out of SVG context) */}
      {(isHovered && data && (data.function || data.deficit)) && (
        <EdgeLabelRenderer>
          <div
            className="absolute rounded-md shadow-lg border border-slate-300 bg-white p-3 text-sm z-50 transition-opacity pointer-events-none"
            style={{
              transform: `translate(-50%, -50%)`,
              left: labelX,
              top: labelY,
              minWidth: '220px',
              maxWidth: '280px',
            }}
          >
            {data.function && (
              <div className="mb-2">
                <span className="font-bold text-slate-800 bloc text-xs uppercase tracking-wide">Proceso:</span>
                <p className="text-slate-600 mt-1">{data.function as string}</p>
              </div>
            )}
            {data.deficit && (
              <div>
                <span className="font-bold text-red-600 block text-xs uppercase tracking-wide">Fallo Clínico:</span>
                <p className="text-red-500 mt-1">{data.deficit as string}</p>
              </div>
            )}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}
