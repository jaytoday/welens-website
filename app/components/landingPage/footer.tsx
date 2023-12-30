import React from "react";

const TwitterIcon = () => {
  return (
    <svg  xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0 1.95-2.48 9.16 9.16 0 0 1-2.89 1.1 4.52 4.52 0 0 0-7.72 4.1 12.87 12.87 0 0 1-9.34-4.75 4.52 4.52 0 0 0 1.4 6.05A4.41 4.41 0 0 1 .64 9.86v.05a4.5 4.5 0 0 0 3.62 4.42 4.47 4.47 0 0 1-2.07.08 4.52 4.52 0 0 0 4.22 3.14 9.06 9.06 0 0 1-5.6 1.95A8.9 8.9 0 0 1 0 20.47a12.94 12.94 0 0 0 7 2.05c8.39 0 13-6.94 13-12.94v-.59A9 9 0 0 0 23 3z"></path>
    </svg>
  );
};

const LandingPageFooter = () => {
    const currentYear = new Date().getFullYear();

  return (
    <footer className="text-gray-400">
      <div className="max-w-7xl mx-auto py-4 px-4 overflow-hidden sm:px-6 lg:px-8">
        <nav
          className="-mx-5 -my-2 flex flex-wrap justify-center"
          aria-label="Footer"
        >
          <div className="px-5 py-2 flex items-center">
            <a target="_blank" href="https://twitter.com/WeLens"><TwitterIcon /></a>
            <span className="pl-1 -mt-1 ml-2 font-bold text-sm text-gray-500">&copy; {currentYear} WeLens</span>
          </div>
        </nav>
      </div>
    </footer>
  );
};


export default LandingPageFooter;