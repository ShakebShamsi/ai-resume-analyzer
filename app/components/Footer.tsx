import { Link } from "react-router";

const Footer = () => (
   <footer className="border-t border-gray-200 bg-white px-6 py-7">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
         <div>
            <Link to="/" className="text-lg font-bold text-gradient">
               ResuMatrix
            </Link>
            <p className="mt-1 text-sm text-gray-500">
               Clearer feedback for your next career move.
            </p>
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
            <p>© {new Date().getFullYear()} ResuMatrix. All rights reserved.</p>
         </div>
      </div>
   </footer>
);

export default Footer;
