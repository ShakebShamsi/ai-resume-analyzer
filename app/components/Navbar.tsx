import { Link } from "react-router";

const Navbar = () => {
   return (
      <nav className="navbar" aria-label="Main navigation">
         <Link to="/" className="flex min-w-0 items-center gap-3" aria-label="ResuMatrix home">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#D9EFE6] text-base font-bold text-[#123F3B]">
               <img src="public/favicon.ico" alt="logo"  />
            </span>
            <span className="min-w-0">
               <span className="block text-lg font-bold text-white">ResuMatrix</span>
               <span className="hidden text-xs text-[#C9DBD6] sm:block">Resume intelligence, refined</span>
            </span>
         </Link>
         <div className="flex shrink-0 items-center gap-2 sm:gap-4">
            <Link
               to="/"
               className="hidden rounded-md px-3 py-2 text-sm font-medium text-[#E4EFEB] transition-colors hover:bg-white/10 sm:inline-flex"
            >
               Applications
            </Link>
            <Link
               to="/upload"
               className="inline-flex min-h-11 items-center justify-center rounded-md bg-[#D9EFE6] px-4 py-2 text-sm font-bold text-[#123F3B] transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D9EFE6]"
            >
               Upload resume
            </Link>
         </div>
      </nav>
   )
}
export default Navbar
