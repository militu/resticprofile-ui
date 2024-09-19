import React from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthenticationLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen flex-col bg-background dark:bg-background lg:flex-row">
      <div className="flex flex-grow items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="max-w-md mx-auto mt-8 p-6 bg-white dark:bg-foreground rounded-lg shadow-md">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthenticationLayout;
