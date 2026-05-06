"use server";

import { cookies } from "next/headers";

import { NEXT_LOCALE_COOKIE_NAME } from "@/constants/app-constants";

import { Locale, defaultLocale } from "@/i18n/config";

export async function getUserLocale() {
  return (await cookies()).get(NEXT_LOCALE_COOKIE_NAME)?.value || defaultLocale;
}

export async function setUserLocale(locale: Locale) {
  (await cookies()).set(NEXT_LOCALE_COOKIE_NAME, locale);
}
