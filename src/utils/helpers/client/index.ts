import dayjs from "dayjs";
import mime from "mime-types";
import { enqueueSnackbar } from "notistack";
import { Path, UseFormSetError } from "react-hook-form";
import { FieldErrors, FieldValues } from "react-hook-form";

export type FormatType =
  | "currency"
  | "date"
  | "date-time"
  | "number"
  | "default";

export function handleFormErrorValidation<T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>,
) {
  const axiosError = error as unknown as CommonErrorResponse;
  if (Array.isArray(axiosError?.message) && axiosError?.message?.length) {
    axiosError?.message.forEach((error, index) => {
      if (error.children?.length) {
        error.children.forEach((child, childIndex) => {
          child.constraints.forEach((children, childrenIndex) => {
            setError(
              `${error.property}.${child.property}.${children.property}` as Path<T>,
              {
                type: "manual",
                message: children.constraints.map((c) => `- ${c}`).join("\n"),
              },
              { shouldFocus: childIndex === 0 && childrenIndex === 0 },
            );
          });
        });
      }
      setError(
        error.property as Path<T>,
        {
          type: "manual",
          message: error.constraints.map((c) => `- ${c}`).join("\n"),
        },
        { shouldFocus: index === 0 },
      );
    });
  }
}

export const onError = <T extends FieldValues>(errors: FieldErrors<T>) => {
  const errorWithoutRef = Object.entries(errors).filter(([, value]) => {
    return typeof value === "object" && value !== null && !("ref" in value);
  }) as Array<[string, { message?: string }]>;

  errorWithoutRef.forEach(([key, value]) => {
    if (value.message) {
      enqueueSnackbar(`${key}: ${value.message}`, { variant: "error" });
    }
  });
};

export const formatDate = ({
  date,
  format = "LL",
  locale = "en",
}: {
  date: string | null;
  format?: string;
  locale?: string | ILocale;
}) => {
  return date !== null && date !== undefined
    ? dayjs(date).locale(locale).format(format)
    : "-";
};

export const formatDateTime = ({
  date,
  format = "LL HH:mm:ss",
  locale = "en",
}: {
  date: string | null;
  format?: string;
  locale?: string | ILocale;
}) => {
  return date !== null && date !== undefined
    ? dayjs(date).locale(locale).format(format)
    : "-";
};

export const formatNumber = (
  value?: string | number | null,
  locale: string = "en",
) => {
  return value !== null && value !== undefined
    ? new Intl.NumberFormat(locale).format(Number(value))
    : "-";
};

export const formatCurrency = ({
  value,
  locale = "en",
  options,
}: {
  value?: string | number | null;
  locale?: string;
  options?: Intl.NumberFormatOptions;
}) => {
  return value !== null && value !== undefined
    ? new Intl.NumberFormat(locale, {
        style: "currency",
        currency: "IDR",
        ...options,
      }).format(Number(value))
    : "-";
};

export const formatListDetailValue = ({
  value,
  key,
  formatType = "default",
  locale,
  customFormatter,
}: {
  value: any;
  key: string;
  formatType?: FormatType;
  locale?: string;
  customFormatter?: (value: any) => string | number;
}): string | number => {
  if (customFormatter) {
    return customFormatter(value);
  }

  if (formatType === "date" && dayjs(value).isValid()) {
    return formatDate({ date: value, locale });
  }

  if (
    (formatType === "date-time" || key.toLowerCase().includes("date")) &&
    dayjs(value).isValid()
  ) {
    return formatDateTime({ date: value, locale });
  }

  if (
    formatType === "currency" ||
    ["price", "amount"].some((keyword) => key.toLowerCase().includes(keyword))
  ) {
    return formatCurrency({ value, locale });
  }

  if (formatType === "number" || typeof value === "number") {
    return formatNumber(value, locale);
  }

  if (typeof value === "boolean") {
    return value ? "✅" : "❌";
  }

  if (value === null || value === undefined) {
    return "-";
  }

  return value?.toString();
};

export const paramsSerializer = (params: Record<string, unknown>) => {
  const serializedParams = Object.keys(params).reduce<Record<string, any>>(
    (acc, key) => {
      const value = params[key];

      if (value === undefined || (Array.isArray(value) && value.length === 0))
        return acc;

      if (Array.isArray(value)) {
        acc[key] = JSON.stringify(value);
      } else {
        acc[key] = value;
      }

      return acc;
    },
    {},
  );

  return new URLSearchParams(serializedParams).toString();
};

export const difference = ({ a, b }: { a: any[]; b: any[] }) =>
  a.filter((x) => !b.includes(x));

export const isImageFile = (file: string | File): boolean => {
  if (!file) return false;

  if (typeof file === "string") {
    const mimeType = mime.lookup(file);
    return !!(mimeType && mimeType.startsWith("image/"));
  } else if (file instanceof File) {
    return file.type.startsWith("image/");
  }

  return false;
};

export const getCurrencySymbol = (
  locale: Intl.LocalesArgument,
  currency: string | undefined,
) => {
  return (0)
    .toLocaleString(locale, {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
    .replace(/\d/g, "")
    .trim();
};

export const getIsHasColumnFilters = (
  searchParams: URLSearchParams,
  key: string,
) => {
  return searchParams.get("column-filters")?.includes(key);
};
