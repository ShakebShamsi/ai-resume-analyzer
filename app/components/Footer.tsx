import { Link } from "react-router";

const Footer = () => (
   <footer className="border-t border-gray-200 bg-white px-6 py-7">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
         <div>
            <Link to="/" className="flex w-fit items-center gap-3" aria-label="ResuMatrix home">
               <span className="flex size-10 shrink-0 items-center justify-center">
                  <img src="/favicon-black.ico" alt="" className="size-10 object-contain" />
               </span>
               <span className="min-w-0">
                  <span className="block text-lg font-bold text-gradient">ResuMatrix</span>
                  <span className="hidden text-xs text-gray-500 sm:block">Resume intelligence, refined</span>
               </span>
            </Link>
         </div>

         <div className="flex flex-col gap-3 text-sm text-gray-500 sm:items-end">
            <nav aria-label="Footer navigation" className="flex gap-5">
               <Link to="/" className="transition-colors hover:text-gray-900">
                  Applications
               </Link>
               <Link to="/upload" className="transition-colors hover:text-gray-900">
                  Upload resume
               </Link>
            </nav>
            {/* <p>© {new Date().getFullYear()} ResuMatrix by SYNKODEX. All rights reserved.</p> */}
            <p>
               © {new Date().getFullYear()} ResuMatrix by{" "}
               <span className="text-gradient font-bold">SYNKODEX</span>. All rights reserved.
            </p>
         </div>
      </div>
   </footer>
);

export default Footer;
