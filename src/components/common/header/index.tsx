"use client";

import { LanguageSelect } from "../select/language-select";
import { ThemeToggle } from "../toggle/theme-toggle";

export function Header() {
  return (
    <>
      <LanguageSelect />
      <ThemeToggle />
    </>
  );
}
