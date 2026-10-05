import React from 'react'
import { getScoreBand, scorePalette } from "~/lib/score";

interface Suggestion {
   type: "good" | "improve";
   tip: string;
}

interface ATSProps {
   score: number;
   suggestions: Suggestion[];
}

const ATS: React.FC<ATSProps> = ({ score, suggestions }) => {
   const band = getScoreBand(score);

   const iconSrc = band === "strong"
      ? '/icons/ats-good.svg'
      : band === "developing"
         ? '/icons/ats-warning.svg'
         : '/icons/ats-bad.svg';

   const subtitle = band === "strong"
      ? 'Great Job!'
      : band === "developing"
         ? 'Good Start'
         : 'Needs Improvement';

   return (
      <div className={`w-full rounded-xl border p-5 shadow-sm sm:p-6 ${scorePalette[band].panel}`}>
         {/* Top section with icon and headline */}
         <div className="flex items-center gap-4 mb-6">
            <img src={iconSrc} alt="ATS Score Icon" className="w-12 h-12" />
            <div>
               <h2 className="text-2xl font-bold">ATS Score - {score}/100</h2>
            </div>
         </div>

         {/* Description section */}
         <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">{subtitle}</h3>
            <p className="text-gray-600 mb-4">
               This score represents how well your resume is likely to perform in Applicant Tracking Systems used by employers.
            </p>

            {/* Suggestions list */}
            <div className="space-y-3">
               {suggestions.map((suggestion, index) => (
                  <div key={index} className="flex items-start gap-3">
                     <img
                        src={suggestion.type === "good" ? "/icons/check.svg" : "/icons/warning.svg"}
                        alt={suggestion.type === "good" ? "Check" : "Warning"}
                        className="w-5 h-5 mt-1"
                     />
                     <p className={suggestion.type === "good" ? "text-[#39766F]" : "text-[#806035]"}>
                        {suggestion.tip}
                     </p>
                  </div>
               ))}
            </div>
         </div>

         {/* Closing encouragement */}
         <p className="text-gray-700 italic">
            Keep refining your resume to improve your chances of getting past ATS filters and into the hands of recruiters.
         </p>
      </div>
   )
}

export default ATS
