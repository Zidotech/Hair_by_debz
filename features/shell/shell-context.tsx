"use client";

import { createContext, useContext } from "react";

export interface ShellCtx {
  /** Page-transition navigation: fade out, push, fade in. */
  go: (href: string, opts?: { then?: () => void }) => void;
  menu: boolean;
  openMenu: () => void;
  closeMenu: () => void;
  toast: (message: string) => void;
}

export const ShellContext = createContext<ShellCtx | null>(null);

export function useShell(): ShellCtx {
  const ctx = useContext(ShellContext);
  if (!ctx) throw new Error("useShell must be used inside <AppShell>");
  return ctx;
}
