import { AxiosError, HttpStatusCode } from "axios";
import { enqueueSnackbar } from "notistack";

import axios from "@/lib/axios-client";

import { FetchData } from "@/types/axios";

import { paramsSerializer } from "../helpers/client";

export const fetchData = async <R>({
  url,
  method,
  params,
  hideSnackbarError = false,
  ...rest
}: FetchData): Promise<TaskResponse<R>> => {
  try {
    const response = await axios.request<TaskResponse<R>>({
      url,
      method,
      params,
      paramsSerializer,
      ...rest,
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<CommonErrorResponse>;
    const messageTitle =
      axiosError.response?.data?.error ?? "Internal Server Error";
    const messageBody =
      axiosError.response?.data?.message &&
      !Array.isArray(axiosError.response?.data?.message)
        ? axiosError.response?.data?.message
        : "";
    const messageCurrentUrl =
      axiosError.response?.status === HttpStatusCode.Forbidden ? url : null;
    const message = [messageTitle, messageBody, messageCurrentUrl]
      .filter(Boolean)
      .join(". ");
    if (!hideSnackbarError) {
      enqueueSnackbar(message, { variant: "error" });
    }
    throw axiosError.response?.data ?? error;
  }
};

export const downloadData = async <R>({
  url,
  method,
  responseType = "blob",
  params,
  data,
  ...rest
}: FetchData) => {
  try {
    const response = await axios.request<Blob>({
      url,
      method,
      responseType,
      params,
      data,
      ...rest,
    });
    const href = window.URL.createObjectURL(response.data);

    const anchorElement = document.createElement("a");

    const contentDisposition = response.headers["content-disposition"];
    const filename = contentDisposition
      ? contentDisposition
          .split(";")
          .find((n: string) => n.includes("filename="))
          ?.replace("filename=", "")
          ?.replaceAll('"', "")
          .trim()
      : "download";

    anchorElement.href = href;
    anchorElement.download = filename;

    document.body.appendChild(anchorElement);
    anchorElement.click();

    document.body.removeChild(anchorElement);
    window.URL.revokeObjectURL(href);

    return new Blob([response.data]);
  } catch (error) {
    const axiosError = error as AxiosError<TaskResponse<R>>;
    throw axiosError.response?.data ?? error;
  }
};
