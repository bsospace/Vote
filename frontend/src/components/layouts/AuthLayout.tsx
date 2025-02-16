import { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="h-screen flex items-center justify-center bg-gray-100 shadow-md">
      <div className="w-full max-w-md p-6 rounded-lg">
        {children}
      </div>
    </div>
  );
}
