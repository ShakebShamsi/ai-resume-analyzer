import { usePuterStore } from "~/lib/puter";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";

export const meta = () => ([
   { title: 'ResuMatrix | Auth' },
   { name: 'description', content: 'Log into your account' },
])

const Auth = () => {
   const { isLoading, auth } = usePuterStore();
   const location = useLocation();
   const next = location.search.split('next=')[1];
   const navigate = useNavigate();

   useEffect(() => {
      if (auth.isAuthenticated) navigate(next);
   }, [auth.isAuthenticated, next])

   return (
      <main className="flex min-h-screen items-center justify-center bg-[url('/images/bg-auth.svg')] bg-cover bg-center px-4 py-12 pt-0 sm:px-6">
         <div className="w-full max-w-[440px]">
            <div className="mb-5 flex items-center justify-center gap-3">
               <span className="flex size-10 items-center justify-center rounded-lg bg-[#123F3B] text-base font-bold text-white shadow-sm">
                  R
               </span>
               <span className="text-lg font-bold text-[#163D39]">ResuMatrix</span>
            </div>

            <section className="rounded-xl border border-[#DCE8E4] bg-white/95 p-6 shadow-xl shadow-[#163D39]/10 backdrop-blur-sm sm:p-10">
               <div className="flex flex-col items-center gap-3 text-center">
                  <p className="text-xs font-semibold uppercase text-[#4D766E]">Account access</p>
                  <h1 className="!text-3xl !leading-tight !tracking-normal !text-[#163D39]">Welcome back</h1>
                  <p className="max-w-sm text-sm leading-relaxed text-gray-600">
                     Sign in to continue to your resume analysis and feedback.
                  </p>
               </div>

               <div className="mt-8">
                  {isLoading ? (
                     <button className="auth-button animate-pulse" disabled>
                        Signing you in...
                     </button>
                  ) : auth.isAuthenticated ? (
                     <button className="auth-button" onClick={auth.signOut}>
                        Sign out
                     </button>
                  ) : (
                     <button className="auth-button" onClick={auth.signIn}>
                        Sign in
                     </button>
                  )}
               </div>
            </section>
         </div>
      </main>
   )
}

export default Auth
