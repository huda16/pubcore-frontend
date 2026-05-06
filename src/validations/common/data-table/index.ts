import dayjs from "dayjs";
import { z } from "zod";

export const MRT_SortingStateSchema = z
  .array(
    z.object({
      id: z.string(),
      desc: z.boolean(),
    }),
  )
  .default([]);

export type MRT_SortingStateType = z.infer<typeof MRT_SortingStateSchema>;

export const MRT_ColumnFiltersStateSchema = z
  .array(
    z.object({
      id: z.string(),
      value: z.union([
        z.boolean(),
        z.number(),
        z.string(),
        z.array(z.union([z.literal(""), z.undefined()])).transform(() => []),
        z
          .array(
            z.union([
              z.null(),
              z.literal(""),
              z.undefined(),
              z.coerce
                .date()
                .refine((value) => dayjs(value).isValid())
                .transform((value) => dayjs(value)),
              z.string(),
            ]),
          )
          .nonempty(),
      ]),
    }),
  )
  .default([]);

export type MRT_ColumnFiltersStateType = z.infer<
  typeof MRT_ColumnFiltersStateSchema
>;

export const MRT_ColumnFilterFnsStateSchema = z.record(z.string(), z.string());

export type MRT_ColumnFilterFnsStateType = z.infer<
  typeof MRT_ColumnFilterFnsStateSchema
>;

export const MRT_PaginationStateSchema = z.object({
  pageIndex: z.number().default(0),
  pageSize: z.number().default(10),
});

export type MRT_PaginationStateType = z.infer<typeof MRT_PaginationStateSchema>;
