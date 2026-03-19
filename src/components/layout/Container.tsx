import { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  className?: string;
  clean?: boolean; // If true, removes padding for full-width items
}

export function Container({ children, className = "", clean = false }: ContainerProps) {
  return (
    <div className={`
      max-w-[1400px] 
      mx-auto 
      ${clean ? "px-0" : "px-4 md:px-6"} 
      ${className}
    `}>
      {children}
    </div>
  );
}