"use client";

import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

import { NavigateNext } from "@mui/icons-material";
import {
  Breadcrumbs as BaseBreadcrumbs,
  Link,
  Typography,
} from "@mui/material";

import { kebabToTitleCase } from "@/utils/helpers/server";

type BreadcrumbsProps = {
  customLastPath?: string;
};

export function Breadcrumbs({ customLastPath }: BreadcrumbsProps) {
  const pathname = usePathname();
  const t = useTranslations("Menu");

  const parsedPathName = pathname
    .split("/")
    .filter(Boolean)
    .map(kebabToTitleCase);

  return (
    <BaseBreadcrumbs
      separator={<NavigateNext fontSize="small" />}
      aria-label="breadcrumb"
    >
      {parsedPathName.map((path, index) =>
        index === parsedPathName.length - 1 ? (
          <Typography
            key={index}
            textTransform="capitalize"
            color={
              index === parsedPathName.length - 1 ? "text.primary" : "inherit"
            }
          >
            {index === parsedPathName.length - 1 && customLastPath
              ? customLastPath
              : t(path)}
          </Typography>
        ) : (
          <Link
            key={index}
            color="inherit"
            underline="hover"
            href={`/${parsedPathName
              .slice(0, index + 1)
              .join("/")
              .toLowerCase()
              .replaceAll(" ", "-")}`}
          >
            {t(path)}
          </Link>
        ),
      )}
    </BaseBreadcrumbs>
  );
}
