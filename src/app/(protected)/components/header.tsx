import Link from "next/link";
import React from "react";
import ModeToggle from "./theme-switcher";
import UserNav from "./user-nav";

interface HeaderProps {
  title: string;
  children?: React.ReactNode;
}

export default function Header({ title, children }: HeaderProps) {
  return (
    <header className="flex justify-between items-center p-5 pb-8">
      <Link
        href="/dashboard"
        className="text-2xl uppercase font-bold no-underline"
      >
        {title}
      </Link>
      <div className="flex-grow flex justify-center">{children}</div>
      <div className="flex items-center space-x-4">
        <ModeToggle />
        <UserNav />
      </div>
    </header>
  );
}
