import { useEffect, useRef, useState } from "react";
import { getScoreBand, scorePalette } from "~/lib/score";

const ScoreGauge = ({ score = 75 }: { score: number }) => {
   const [pathLength, setPathLength] = useState(0);
   const pathRef = useRef<SVGPathElement>(null);

   const safeScore = Math.min(100, Math.max(0, score));
   const percentage = safeScore / 100;
   const scoreColor = scorePalette[getScoreBand(safeScore)].foreground;

   useEffect(() => {
      if (pathRef.current) {
         setPathLength(pathRef.current.getTotalLength());
      }
   }, []);

   return (
      <div className="flex flex-col items-center">
         <div className="relative w-40 h-20">
            <svg viewBox="0 0 100 50" className="w-full h-full">
               <path
                  d="M10,50 A40,40 0 0,1 90,50"
                  fill="none"
                  stroke="#E5ECE9"
                  strokeWidth="10"
                  strokeLinecap="round"
               />

               <path
                  ref={pathRef}
                  d="M10,50 A40,40 0 0,1 90,50"
                  fill="none"
                  stroke={scoreColor}
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={pathLength}
                  strokeDashoffset={pathLength * (1 - percentage)}
               />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
               <div className="pt-4 text-xl font-semibold text-[#163D39]">{safeScore}/100</div>
            </div>
         </div>
      </div>
   );
};

export default ScoreGauge;
