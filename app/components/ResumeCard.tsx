import { Link } from "react-router";
import ScoreCircle from "~/components/ScoreCircle";
import { useEffect, useState } from "react";
import { usePuterStore } from "~/lib/puter";

const ResumeCard = ({
   resume,
   onDelete,
}: {
   resume: Resume;
   onDelete: (resume: Resume) => Promise<void>;
}) => {
   const readFile = usePuterStore((state) => state.fs.read);
   const [resumeUrl, setResumeUrl] = useState('');
   const [isPreviewLoading, setIsPreviewLoading] = useState(true);
   const [isDeleting, setIsDeleting] = useState(false);
   const [deleteError, setDeleteError] = useState('');

   useEffect(() => {
      let objectUrl: string | undefined;
      let isCancelled = false;
      setIsPreviewLoading(true);
      setResumeUrl('');

      const loadResume = async () => {
         try {
            const blob = await readFile(resume.imagePath);
            if (!blob || isCancelled) return;
            objectUrl = URL.createObjectURL(blob);
            setResumeUrl(objectUrl);
         } catch (error) {
            console.error("Resume preview failed to load:", error);
            if (!isCancelled) setResumeUrl('');
         } finally {
            if (!isCancelled) setIsPreviewLoading(false);
         }
      }

      loadResume();

      return () => {
         isCancelled = true;
         if (objectUrl) URL.revokeObjectURL(objectUrl);
      };
   }, [readFile, resume.imagePath]);

   const handleDelete = async () => {
      const description = [resume.companyName, resume.jobTitle].filter(Boolean).join(' - ');
      if (!window.confirm(`Delete ${description || 'this resume'} and its ATS history?`)) return;

      setIsDeleting(true);
      setDeleteError('');
      try {
         await onDelete(resume);
      } catch (error) {
         console.error("Resume history deletion failed:", error);
         setDeleteError(error instanceof Error ? error.message : 'Could not delete this resume. Please try again.');
         setIsDeleting(false);
      }
   };

   return (
      <article className="resume-card animate-in fade-in duration-700">
         <Link to={`/resume/${resume.id}`} className="flex flex-1 flex-col gap-4">
            <div className="resume-card-header">
               <div className="min-w-0 flex-1">
                  <p className="mb-2 text-xs font-semibold uppercase text-[#4D766E]">
                     APPLICATION
                  </p>
                  <h2 className="break-words text-xl font-bold leading-snug text-[#163D39]">
                     {resume.companyName || "Resume"}
                  </h2>
                  <p className="mt-1 line-clamp-2 break-words text-sm leading-relaxed text-gray-600">
                     {resume.jobTitle || "General resume review"}
                  </p>
               </div>
               <div className="flex shrink-0 flex-col items-center gap-1">
                  <ScoreCircle score={resume.feedback.overallScore} />
                  <span className="text-xs font-medium text-gray-500">Overall score</span>
               </div>
            </div>

            <div className="resume-card-preview">
               {resumeUrl ? (
                  <img
                     src={resumeUrl}
                     alt={`${resume.companyName || "Resume"} preview`}
                     className="h-full w-full object-contain"
                  />
               ) : (
                  <div className="flex h-full items-center justify-center text-sm text-gray-500">
                     {isPreviewLoading ? "Loading resume preview..." : "Resume preview unavailable"}
                  </div>
               )}
            </div>

            <div className="mt-auto flex items-center justify-between border-t border-[#E5ECE9] pt-4">
               <span className="text-sm font-semibold text-[#24534D]">View detailed feedback</span>
               <span aria-hidden="true" className="text-lg text-[#4D8378]">&rarr;</span>
            </div>
         </Link>

         <div className="flex min-h-10 items-center justify-between border-t border-[#E5ECE9] pt-3">
            {deleteError ? (
               <p role="alert" className="max-w-[70%] break-words text-xs text-[#925549]">{deleteError}</p>
            ) : (
               <span className="text-xs text-gray-500">ATS history</span>
            )}
            <button
               type="button"
               onClick={handleDelete}
               disabled={isDeleting}
               aria-label={`Delete ${resume.companyName || 'resume'} ATS history`}
               className="rounded-md px-3 py-2 text-sm font-semibold text-[#925549] transition-colors hover:bg-[#F7ECE9] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#BF7668] disabled:cursor-wait disabled:opacity-60"
            >
               {isDeleting ? "Deleting..." : "Delete"}
            </button>
         </div>
      </article>
   )
}
export default ResumeCard
