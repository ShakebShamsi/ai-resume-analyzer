import { getScoreBand, scorePalette } from "~/lib/score";

const ScoreCircle = ({ score = 75 }: { score: number }) => {
   const safeScore = Math.min(100, Math.max(0, score));
   const radius = 40;
   const stroke = 7;
   const normalizedRadius = radius - stroke / 2;
   const circumference = 2 * Math.PI * normalizedRadius;
   const progress = safeScore / 100;
   const strokeDashoffset = circumference * (1 - progress);
   const scoreColor = scorePalette[getScoreBand(safeScore)].foreground;

   return (
      <div className="relative size-[88px]" role="img" aria-label={`Overall score: ${safeScore} out of 100`}>
         <svg
            height="100%"
            width="100%"
            viewBox="0 0 100 100"
            className="-rotate-90"
            aria-hidden="true"
         >
            <circle
               cx="50"
               cy="50"
               r={normalizedRadius}
               stroke="#E7EFEC"
               strokeWidth={stroke}
               fill="transparent"
            />
            <circle
               cx="50"
               cy="50"
               r={normalizedRadius}
               stroke={scoreColor}
               strokeWidth={stroke}
               fill="transparent"
               strokeDasharray={circumference}
               strokeDashoffset={strokeDashoffset}
               strokeLinecap="round"
            />
         </svg>

         <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-sm font-bold text-[#163D39]">{`${safeScore}`}</span>
            <span className="text-[10px] font-medium text-gray-500">/ 100</span>
         </div>
      </div>
   );
};

export default ScoreCircle;
