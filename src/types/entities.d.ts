export interface Author {
  id: number;
  name: string;
  bio: string;
  nationality: string;
  books?: Book[];
  created_at?: string;
  updated_at?: string;
}

export interface Publisher {
  id: number;
  name: string;
  address: string;
  website: string;
  books?: Book[];
  created_at?: string;
  updated_at?: string;
}

export interface Book {
  id: number;
  title: string;
  isbn: string;
  description: string;
  genre: string;
  year: number;
  price?: number;
  author_id: number;
  author?: Author;
  publisher_id: number;
  publisher?: Publisher;
  created_at?: string;
  updated_at?: string;
}

/** Matches the backend's Meta shape (camelCase from the API) */
export interface PaginationMeta {
  total: number;
  limit: number;
  currentPage: number;
  lastPage: number;
  from: number;
  to: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  message: string;
  statusCode: number;
  meta: PaginationMeta;
}

export interface SingleResponse<T> {
  data: T;
  message: string;
  statusCode: number;
}

export interface ApiError {
  error: string;
  message: string | string[];
  statusCode: number;
}

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  bio?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}
