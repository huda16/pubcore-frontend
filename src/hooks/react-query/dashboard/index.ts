import { useMutation, useQuery } from "@tanstack/react-query";

import { queryClient } from "@/lib/react-query";

import { fetchData } from "@/utils/fetcher";

import { QueryTaskDto, TasksType } from "@/validations/dashboard";

export const useGetTasks = (params: Partial<QueryTaskDto>) => {
  return useQuery({
    queryKey: ["getTasks", params],
    queryFn: () => {
      return fetchData<TasksType[]>({
        url: "/tasks",
        params,
      });
    },
  });
};

export const useGetTask = (id: string) => {
  return useQuery({
    queryKey: ["getTask", id],
    queryFn: () => {
      return fetchData<TasksType>({
        url: `/tasks/${id}`,
      });
    },
  });
};

export const useCreateTask = () => {
  return useMutation({
    mutationKey: ["createTask"],
    mutationFn: ({ data }: { data: TasksType }) => {
      return fetchData<TasksType>({
        url: "/tasks",
        method: "POST",
        data,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getTasks"],
      });
    },
  });
};

export const useUpdateTask = () => {
  return useMutation({
    mutationKey: ["updateTask"],
    mutationFn: ({ id, data }: { id: string; data: TasksType }) => {
      return fetchData<TasksType>({
        url: `/tasks/${id}`,
        method: "PATCH",
        data,
      });
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: ["getTasks"],
      });
      queryClient.invalidateQueries({
        queryKey: ["getTask", id],
      });
    },
  });
};

export const useDeleteTask = () => {
  return useMutation({
    mutationKey: ["deleteTask"],
    mutationFn: ({ id }: { id: string[] }) => {
      return Promise.allSettled(
        id.map((id) => {
          return fetchData<string>({
            url: `/tasks/${id}`,
            method: "DELETE",
          });
        }),
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getTasks"],
      });
    },
  });
};
