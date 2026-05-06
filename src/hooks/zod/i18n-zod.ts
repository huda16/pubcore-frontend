import { useEffect } from "react";

import { useTranslations } from "next-intl";

import { z } from "zod";

import { makeZodI18nMap } from "./zod-error-map";

export const useI18nZodErrors = (namespace: string) => {
  const t = useTranslations("zod");
  const tForm = useTranslations(namespace);
  const tCustom = useTranslations("CustomFormErrors");

  useEffect(() => {
    z.setErrorMap(makeZodI18nMap({ t, tForm, tCustom }));

    return () => {
      z.setErrorMap(z.defaultErrorMap);
    };
  }, [t, tForm, tCustom]);
};
