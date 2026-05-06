"use client";

import { Masonry } from "@mui/lab";
import { Skeleton, Stack } from "@mui/material";

import { ListDetail } from "@/components/common/detail/list-detail";
import { LogInfo } from "@/components/common/log-info";
import { DataNotFound } from "@/components/common/misc/data-not-found";

import { useGetTask } from "@/hooks/react-query/dashboard";

import { TasksForm } from "./form";

type TasksDetailProps = {
  id: string;
  defaultIsEdit: boolean;
};

export function TasksDetail({ id, defaultIsEdit }: TasksDetailProps) {
  const getTask = useGetTask(id);

  if (getTask.isFetching) {
    return (
      <Stack gap={2}>
        <Skeleton variant="rounded" height={40} />
        <Skeleton variant="rounded" height={500} />
      </Stack>
    );
  }

  if (getTask.error?.statusCode === 404) {
    return <DataNotFound />;
  }

  return (
    <>
      {defaultIsEdit ? (
        <TasksForm
          defaultIsEdit={defaultIsEdit}
          initialData={getTask.data as any}
        />
      ) : (
        <>
          <Masonry
            columns={{ xs: 1, md: 2 }}
            spacing={4}
            sx={{ width: "auto" }}
          >
            <ListDetail
              data={getTask.data}
              translationPath="TasksPage"
              hideFields={[]}
              defaultExpanded
            />
            <LogInfo data={getTask.data} />
          </Masonry>
        </>
      )}
    </>
  );
}
