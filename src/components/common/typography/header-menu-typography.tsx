import { useMemo } from "react";

import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

import { getPathnameToTitle } from "@/utils/helpers/server";

import { HeaderTypography } from "./header-typography";

export function HeaderMenuTypography() {
  const t = useTranslations("Menu");
  const pathname = usePathname();

  const menu = useMemo(() => t(getPathnameToTitle(pathname)), [pathname, t]);

  return <HeaderTypography>{menu}</HeaderTypography>;
}
