declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXTAUTH_URL: string;
      NEXTAUTH_SECRET: string;
      API_BASE_URL: string;
      API_ALT_BASE_URL: string;
      GOOGLE_ANALYTICS_ID: string;
      GOOGLE_MAPS_API_KEY: string;
      GOOGLE_RECAPTCHA_SITE_KEY: string;
    }
  }
}

export {};
