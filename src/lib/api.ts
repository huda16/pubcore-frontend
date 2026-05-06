import apiClient from "@/lib/axios-client";

import type {
  AuthResponse,
  Author,
  Book,
  PaginatedResponse,
  Publisher,
  SingleResponse,
} from "@/types/entities";

// ==================== Auth Endpoints ====================
export const authApi = {
  register: async (payload: {
    username: string;
    email: string;
    password: string;
    bio?: string;
  }) => {
    const res = await apiClient.post<SingleResponse<AuthResponse>>(
      "/auth/register",
      payload,
    );
    return res.data.data;
  },

  login: async (payload: { email: string; password: string }) => {
    const res = await apiClient.post<SingleResponse<AuthResponse>>(
      "/auth/login",
      payload,
    );
    return res.data.data;
  },

  logout: async () => {
    const res = await apiClient.post("/auth/logout");
    return res.data;
  },
};

// ==================== Authors Endpoints ====================
export const authorsApi = {
  list: async (params?: {
    page?: number;
    limit?: number;
    sort?: string;
    order?: "asc" | "desc";
    name?: string;
    nationality?: string;
  }) => {
    const res = await apiClient.get<PaginatedResponse<Author>>("/authors", {
      params,
    });
    return res.data;
  },

  detail: async (id: number) => {
    const res = await apiClient.get<SingleResponse<Author>>(`/authors/${id}`);
    return res.data.data;
  },

  create: async (payload: Omit<Author, "id" | "created_at" | "updated_at">) => {
    const res = await apiClient.post<SingleResponse<Author>>(
      "/authors",
      payload,
    );
    return res.data.data;
  },

  // PUT requests usually replace the whole resource, but you can use Partial for PATCH
  update: async (
    id: number,
    payload: Partial<Omit<Author, "id" | "created_at" | "updated_at">>,
  ) => {
    const res = await apiClient.put<SingleResponse<Author>>(
      `/authors/${id}`,
      payload,
    );
    return res.data.data;
  },

  delete: async (id: number) => {
    await apiClient.delete(`/authors/${id}`);
  },
};

// ==================== Publishers Endpoints ====================
export const publishersApi = {
  list: async (params?: {
    page?: number;
    limit?: number;
    sort?: string;
    order?: "asc" | "desc";
    name?: string;
  }) => {
    const res = await apiClient.get<PaginatedResponse<Publisher>>(
      "/publishers",
      { params },
    );
    return res.data;
  },

  detail: async (id: number) => {
    const res = await apiClient.get<SingleResponse<Publisher>>(
      `/publishers/${id}`,
    );
    return res.data.data;
  },

  create: async (
    payload: Omit<Publisher, "id" | "created_at" | "updated_at">,
  ) => {
    const res = await apiClient.post<SingleResponse<Publisher>>(
      "/publishers",
      payload,
    );
    return res.data.data;
  },

  update: async (
    id: number,
    payload: Partial<Omit<Publisher, "id" | "created_at" | "updated_at">>,
  ) => {
    const res = await apiClient.put<SingleResponse<Publisher>>(
      `/publishers/${id}`,
      payload,
    );
    return res.data.data;
  },

  delete: async (id: number) => {
    await apiClient.delete(`/publishers/${id}`);
  },
};

// ==================== Books Endpoints ====================
export const booksApi = {
  list: async (params?: {
    page?: number;
    limit?: number;
    sort?: string;
    order?: "asc" | "desc";
    title?: string;
    genre?: string;
    author_id?: number;
    publisher_id?: number;
    year?: number;
  }) => {
    const res = await apiClient.get<PaginatedResponse<Book>>("/books", {
      params,
    });
    return res.data;
  },

  detail: async (id: number) => {
    const res = await apiClient.get<SingleResponse<Book>>(`/books/${id}`);
    return res.data.data;
  },

  create: async (payload: Omit<Book, "id" | "created_at" | "updated_at">) => {
    const res = await apiClient.post<SingleResponse<Book>>("/books", payload);
    return res.data.data;
  },

  update: async (
    id: number,
    payload: Partial<Omit<Book, "id" | "created_at" | "updated_at">>,
  ) => {
    const res = await apiClient.put<SingleResponse<Book>>(
      `/books/${id}`,
      payload,
    );
    return res.data.data;
  },

  delete: async (id: number) => {
    await apiClient.delete(`/books/${id}`);
  },
};
