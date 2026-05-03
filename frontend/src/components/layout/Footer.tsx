import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t py-6 md:py-0" role="contentinfo">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          &copy; {new Date().getFullYear()} ElectionEdu. Built for educational purposes.
        </p>
        <nav className="flex items-center space-x-4 text-sm text-muted-foreground" aria-label="Footer Navigation">
          <a href="#" className="hover:underline underline-offset-4">Privacy Policy</a>
          <a href="#" className="hover:underline underline-offset-4">Terms of Service</a>
        </nav>
      </div>
    </footer>
  );
};
