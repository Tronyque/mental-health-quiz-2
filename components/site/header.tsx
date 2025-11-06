"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";


function NavLink({
  href,
  label,
  onClick,
}: {
  href: string;
  label: string;
  onClick?: () => void;
}) {
  const pathname = usePathname();
  const isActive =
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(href + "/");

  return (
    <Link
      href={href}
      onClick={onClick}
      className={[
        "rounded-full px-3 py-2 text-sm transition-colors",
        isActive
          ? "bg-primary/15 text-foreground"
          : "text-muted-foreground hover:text-foreground hover:bg-muted/30",
      ].join(" ")}
    >
      {label}
    </Link>
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);

  // ferme le menu mobile à chaque navigation
  const pathname = usePathname();
  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo / Marque */}
        <Link href="/intro" className="inline-flex items-baseline gap-2">
          <span className="text-lg font-bold tracking-tight">Mental-Health-Quiz</span>
          <span className="text-xs text-muted-foreground hidden sm:inline">
            bienveillance & clarté
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-2">
          <NavLink href="/" label="Accueil" />
          <NavLink href="/intro" label="Présentation du quiz" />
          <NavLink href="/quiz" label="Questionnaire" />
        </nav>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-2">
          <ThemeToggle />
          <Link href="/quiz">
            <Button className="rounded-full px-4">Commencer</Button>
          </Link>
        </div>

        {/* Mobile toggler */}
        <button
          className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-muted/30"
          aria-label="Menu"
          onClick={() => setOpen((s) => !s)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile nav */}
      {open && (
        <div className="md:hidden border-t border-border bg-card">
          <div className="container py-3 flex flex-col gap-1">
            <NavLink href="/" label="Accueil" onClick={() => setOpen(false)} />
            <NavLink
              href="/intro"
              label="Présentation du quiz"
              onClick={() => setOpen(false)}
            />
            <NavLink
              href="/quiz"
              label="Questionnaire"
              onClick={() => setOpen(false)}
            />
            <div className="flex items-center gap-2 pt-2">
              <ThemeToggle />
              <Link href="/quiz" className="flex-1">
                <Button className="w-full rounded-full">Commencer</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
