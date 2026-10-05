import { Link } from "react-router";
import ScoreCircle from "~/components/ScoreCircle";
import { useEffect, useState } from "react";
import { usePuterStore } from "~/lib/puter";

const ResumeCard = ({ resume: { id, companyName, jobTitle, feedback, imagePath } }: { resume: Resume }) => {
   const { fs } = usePuterStore();
   const [resumeUrl, setResumeUrl] = useState('');

   useEffect(() => {
      const loadResume = async () => {
         const blob = await fs.read(imagePath);
         if (!blob) return;
         let url = URL.createObjectURL(blob);
         setResumeUrl(url);
      }

      loadResume();
   }, [imagePath]);

   return (
      <Link to={`/resume/${id}`} className="resume-card animate-in fade-in duration-700">
         <div className="resume-card-header">
            <div className="min-w-0 flex-1">
               <p className="mb-2 text-xs font-semibold uppercase text-[#4D766E]">
                  APPLICATION
               </p>
               <h2 className="break-words text-xl font-bold leading-snug text-[#163D39]">
                  {companyName || "Resume"}
               </h2>
               <p className="mt-1 line-clamp-2 break-words text-sm leading-relaxed text-gray-600">
                  {jobTitle || "General resume review"}
               </p>
            </div>
            <div className="flex shrink-0 flex-col items-center gap-1">
               <ScoreCircle score={feedback.overallScore} />
               <span className="text-xs font-medium text-gray-500">Overall score</span>
            </div>
         </div>

         <div className="resume-card-preview">
            {resumeUrl ? (
               <img
                  src={resumeUrl}
                  alt={`${companyName || "Resume"} preview`}
                  className="h-full w-full object-contain"
               />
            ) : (
               <div className="flex h-full items-center justify-center text-sm text-gray-500">
                  Loading resume preview...
               </div>
            )}
         </div>

         <div className="mt-auto flex items-center justify-between border-t border-[#E5ECE9] pt-4">
            <span className="text-sm font-semibold text-[#24534D]">View detailed feedback</span>
            <span aria-hidden="true" className="text-lg text-[#4D8378]">&rarr;</span>
         </div>
      </Link>
   )
}
export default ResumeCard
