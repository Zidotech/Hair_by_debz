"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { useShell } from "../shell-context";

type Props = Omit<ComponentProps<typeof Link>, "href"> & {
  href: string;
  /** Runs once the destination page has mounted. */
  then?: () => void;
};

/** A real <a href> (middle-click, SEO, prefetch) that plays the design's page transition. */
export function NavLink({ href, then, onClick, children, ...rest }: Props) {
  const { go } = useShell();
  return (
    <Link
      href={href}
      {...rest}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
        e.preventDefault();
        go(href, { then });
      }}
    >
      {children}
    </Link>
  );
}
