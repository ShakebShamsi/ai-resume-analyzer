import { type FormEvent, useState } from 'react';
import Navbar from "~/components/Navbar";
import FileUploader from "~/components/FileUploader";
import { usePuterStore } from "~/lib/puter";
import { useNavigate } from "react-router";
import { convertPdfToImage } from "~/lib/pdf2img";
import { generateUUID } from "~/lib/utils";
import { parseFeedbackResponse } from "~/lib/feedback";
import { prepareInstructions } from "../../constants";

const Upload = () => {
   const { auth, isLoading, fs, ai, kv } = usePuterStore();
   const navigate = useNavigate();

   const [isProcessing, setIsProcessing] = useState(false);
   const [isSigningIn, setIsSigningIn] = useState(false);
   const [authMessage, setAuthMessage] = useState('');
   const [statusText, setStatusText] = useState('');
   const [file, setFile] = useState<File | null>(null);

   const handleFileSelect = (file: File | null) => {
      setFile(file);
   };

   const handleAnalyze = async ({
      companyName,
      jobTitle,
      jobDescription,
      file,
   }: {
      companyName: string;
      jobTitle: string;
      jobDescription: string;
      file: File;
   }) => {
      setIsProcessing(true);
      let uploadedResumePath: string | undefined;
      let uploadedImagePath: string | undefined;
      let historyKey: string | undefined;
      let historySaved = false;

      try {
         setStatusText('Uploading the file...');
         const uploadedFile = await fs.upload([file]);
         if (!uploadedFile) throw new Error('Failed to upload file');
         uploadedResumePath = uploadedFile.path;

         setStatusText('Converting to image...');
         const imageFile = await convertPdfToImage(file);
         if (!imageFile.file) throw new Error('Failed to convert PDF to image');

         setStatusText('Uploading the image...');
         const uploadedImage = await fs.upload([imageFile.file]);
         if (!uploadedImage) throw new Error('Failed to upload image');
         uploadedImagePath = uploadedImage.path;

         setStatusText('Preparing data...');
         const uuid = generateUUID();

         historyKey = `resume:${uuid}`;
         setStatusText('Analyzing...');

         const feedback = await ai.feedback(
            uploadedFile.path,
            prepareInstructions({ jobTitle, jobDescription })
         );

         if (!feedback?.message?.content) {
            throw new Error('Claude returned an empty response');
         }

         const parsedFeedback = parseFeedbackResponse(feedback.message.content);
         const data: Resume = {
            id: uuid,
            resumePath: uploadedFile.path,
            imagePath: uploadedImage.path,
            companyName,
            jobTitle,
            feedback: parsedFeedback,
         };

         const wasSaved = await kv.set(historyKey, JSON.stringify(data));
         if (!wasSaved) throw new Error('Failed to save resume analysis');
         historySaved = true;

         setStatusText('Analysis complete, redirecting...');
         navigate(`/resume/${uuid}`);
      } catch (error: any) {
         console.error('Resume analysis failed:', error);

         if (!historySaved) {
            await Promise.allSettled([
               ...(historyKey ? [kv.delete(historyKey)] : []),
               ...(uploadedResumePath ? [fs.delete(uploadedResumePath)] : []),
               ...(uploadedImagePath ? [fs.delete(uploadedImagePath)] : []),
            ]);
         }

         if (String(error?.message).includes('Model not found')) {
            setStatusText('AI model unavailable. Please try again later.');
         } else {
            setStatusText(error?.message || 'Something went wrong');
         }

         setIsProcessing(false);
      }
   };

   const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const form = e.currentTarget.closest('form');
      if (!form) return;

      const formData = new FormData(form);

      const companyName = formData.get('company-name') as string;
      const jobTitle = formData.get('job-title') as string;
      const jobDescription = formData.get('job-description') as string;

      if (!companyName || !jobTitle || !jobDescription) {
         alert("Please fill in all required fields");
         return;
      }

      if (companyName.length < 2) {
         alert("Company name must be at least 2 characters long");
         return;
      }

      if (jobTitle.length < 5) {
         alert("Job title must be at least 5 characters long");
         return;
      }

      if (jobDescription.length < 50) {
         alert("Job description must be at least 50 characters long");
         return;
      }

      if (!file) {
         alert("Please upload a resume");
         return;
      }

      if (isLoading) {
         setAuthMessage("Checking your Puter sign-in. Please try again in a moment.");
         return;
      }

      if (!usePuterStore.getState().auth.isAuthenticated) {
         setIsSigningIn(true);
         setAuthMessage('');
         try {
            await auth.signIn();
         } catch {
            setAuthMessage("Could not open Puter sign-in. Please try again.");
            setIsSigningIn(false);
            return;
         }
         setIsSigningIn(false);

         if (!usePuterStore.getState().auth.isAuthenticated) {
            setAuthMessage("Sign in with Puter to analyze your resume.");
            return;
         }
      }

      setAuthMessage('');
      handleAnalyze({ companyName, jobTitle, jobDescription, file });
   };

   return (
      <main className="bg-[url('/images/bg-main.svg')] bg-cover">
         <Navbar />

         <section className="main-section">
            <div className="page-heading py-16">
               <h1>Smart feedback for your dream job</h1>

               {isProcessing ? (
                  <>
                     <h2>{statusText}</h2>
                     <img src="/images/resume-scan.gif" className="w-full" />
                  </>
               ) : (
                  <h2>Drop your resume for an ATS score and improvement tips</h2>
               )}

               {!isProcessing && (
                  <form
                     id="upload-form"
                     onSubmit={handleSubmit}
                     className="flex flex-col gap-4 mt-8"
                  >
                     <div className="form-div">
                        <label htmlFor="company-name">Company Name *</label>
                        <input
                           type="text"
                           name="company-name"
                           id="company-name"
                           placeholder="Company Name"
                           required
                           minLength={2}
                        />
                     </div>

                     <div className="form-div">
                        <label htmlFor="job-title">Job Title *</label>
                        <input
                           type="text"
                           name="job-title"
                           id="job-title"
                           placeholder="Job Title"
                           required
                           minLength={5}
                        />
                     </div>

                     <div className="form-div">
                        <label htmlFor="job-description">Job Description *</label>
                        <textarea
                           rows={5}
                           name="job-description"
                           id="job-description"
                           placeholder="Job Description"
                           required
                           minLength={150}
                        />
                     </div>

                     <div className="form-div">
                        <label>Upload Resume *</label>
                        <FileUploader onFileSelect={handleFileSelect} />
                     </div>

                     <button
                        className="upload-button rounded-full px-4 py-2 cursor-pointer w-full"
                        type="submit"
                        disabled={isProcessing || isSigningIn}
                     >
                        {isSigningIn ? "Signing in..." : "Analyze Resume"}
                     </button>
                     {(isSigningIn || authMessage) && (
                        <p className="text-center text-sm" role="status">
                           {isSigningIn ? "Complete Puter sign-in to continue." : authMessage}
                        </p>
                     )}
                  </form>
               )}
            </div>
         </section>
      </main>
   );
};

export default Upload;
