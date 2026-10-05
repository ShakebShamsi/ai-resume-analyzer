import ScoreGauge from "~/components/ScoreGauge";
import ScoreBadge from "~/components/ScoreBadge";
import { getScoreBand, scorePalette } from "~/lib/score";

const Category = ({ title, score }: { title: string, score: number }) => {
   const textColor = scorePalette[getScoreBand(score)].text;

   return (
      <div className="resume-summary">
         <div className="category">
            <div className="flex flex-row gap-2 items-center justify-center">
               <p className="text-2xl">{title}</p>
               <ScoreBadge score={score} />
            </div>
            <p className={`text-xl font-semibold ${textColor}`}>
               <span className={textColor}>{score}</span>/100
            </p>
         </div>
      </div>
   )
}

const Summary = ({ feedback }: { feedback: Feedback }) => {
   return (
      <div className="w-full overflow-hidden rounded-xl border border-[#DCE8E4] bg-white shadow-sm">
         <div className="flex flex-row items-center gap-5 border-b border-[#E5ECE9] bg-[#F2F7F5] p-4 sm:gap-8 sm:p-5">
            <ScoreGauge score={feedback.overallScore} />

            <div className="flex flex-col gap-2">
               <h2 className="text-xl font-bold text-[#163D39] sm:text-2xl">Your Resume Score</h2>
               <p className="text-sm leading-relaxed text-gray-600">
                  This score is calculated based on the variables listed below.
               </p>
            </div>
         </div>

         <Category title="Tone & Style" score={feedback.toneAndStyle.score} />
         <Category title="Content" score={feedback.content.score} />
         <Category title="Structure" score={feedback.structure.score} />
         <Category title="Skills" score={feedback.skills.score} />
      </div>
   )
}
export default Summary
