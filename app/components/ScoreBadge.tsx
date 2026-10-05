import { getScoreBand, scorePalette } from "~/lib/score";

interface ScoreBadgeProps {
   score: number;
}

const ScoreBadge: React.FC<ScoreBadgeProps> = ({ score }) => {
   const band = getScoreBand(score);
   const badgeText = band === "strong" ? "Strong" : band === "developing" ? "Good Start" : "Needs Work";

   return (
      <div className={`rounded-full px-3 py-1 ${scorePalette[band].badge}`}>
         <p className="text-sm font-medium">{badgeText}</p>
      </div>
   );
};

export default ScoreBadge;
