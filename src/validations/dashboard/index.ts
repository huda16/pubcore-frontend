import { z } from "zod";

export const TaskStatusEnum = z.enum(["TO_DO", "IN_PROGRESS", "DONE"]);

export const tasksSchema = z.object({
  id: z.string().uuid().nullish(),
  title: z.string().min(1).max(255),
  description: z.string().nullish(),
  status: TaskStatusEnum.nullish(),
  createdAt: z.date().nullish(),
  updatedAt: z.date().nullish(),
});

export type TasksType = z.infer<typeof tasksSchema>;

// Define the Zod schema for querying tasks.
export const queryTaskSchema = z.object({
  status: TaskStatusEnum.optional().describe("Filter tasks by status"),

  page: z.coerce // `coerce` converts the query param string to a number
    .number({ invalid_type_error: "Page must be a number" })
    .int()
    .min(1)
    .default(1) // `.default()` makes the field optional and provides a value if omitted
    .describe("Page number for pagination"),

  limit: z.coerce
    .number({ invalid_type_error: "Limit must be a number" })
    .int()
    .min(1)
    .max(100)
    .default(10)
    .describe("Number of items per page"),
});

// Infer the TypeScript type from the schema.
export type QueryTaskDto = z.infer<typeof queryTaskSchema>;
