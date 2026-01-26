import api from "./axios";

/* ---------- endpoints ---------- */

const loginEnpoint: string = "/login";
const signUpEnpoint: string = "/signup"
const getFilesEnpoint: string = "/files"
const uploadFilesEndpoint: string = getFilesEnpoint;


/* ---------- types ---------- */

export interface Photo {
  file_id: number;
  file_name: string;
  file_size: number;
  mime_type: string;
  storage_key: string;
  created_at: string;
  updated_at: string;
  created_by: number;
}

export interface User {
  user_id: number;
  first_name: string;
  last_name: string;
  hashed_password: string;
  email: string;
  profile_pic: string;
  created_at: string;
  updated_at: string;
}

/* ---------- request types ---------- */

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignUpRequest {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

export interface GetFilesParams {
  limit: number;
  cursor?: number;
}

/* ---------- response types ---------- */

export interface LoginResponse {
  user: User;
  token: string;
}

export interface ApiResponse {
  data: Photo[];
  next_cursor: number;
}

/* ---------- api calls ---------- */
export const login = (data: LoginRequest) => api.post(loginEnpoint, data);
export const signup = (data: SignUpRequest) => api.post(signUpEnpoint, data);
export const getFiles = (params: GetFilesParams) => api.get<ApiResponse>(getFilesEnpoint, { params })
export const uploadFile = (formData: FormData) => api.post(uploadFilesEndpoint, formData);