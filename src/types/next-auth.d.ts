import { ProfileType } from "@/validations/me";

declare module "next-auth" {
  interface Session {
    accessToken: string;
    accessTokenExpiresAt: number;
    refreshToken: string;
    refreshTokenExpiresAt: number;
    client: string;
    user: ProfileType;
    error: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken: string;
    accessTokenExpiresAt: number;
    refreshToken: string;
    refreshTokenExpiresAt: number;
    client: string;
    user: ProfileType;
    error: string;
  }
}

declare module "next-auth" {
  type User = ProfileType;
}
