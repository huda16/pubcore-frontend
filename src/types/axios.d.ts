import "axios";
import { AxiosRequestConfig, Method } from "axios";

type FetchData = AxiosRequestConfig & {
  url: string;
  method?: Method;
  params?: Record<string, unknown>;
  isServer?: boolean;
  hideSnackbarError?: boolean;
};

declare module "axios" {
  export interface AxiosRequestConfig {
    isSkipAuth?: boolean;
  }
}
