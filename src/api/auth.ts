import api from "./axios";

/* ---------- endpoints ---------- */

const loginEnpoint:string = "/login";
const signUpEnpoint:string = "/signup"
const getFilesEnpoint:string = "/files"
const uploadFilesEndpoint: string = getFilesEnpoint;

/* ---------- request types ---------- */

export interface LoginRequest{
    email: string;
    password: string;
}

export interface SignUpRequest{
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

export interface Photo {
  file_id: number;
  file_name: string;
  storage_key: string;
}

export interface ApiResponse {
  data: Photo[];
  next_cursor: number;
}

/* ---------- api calls ---------- */
export const login = (data: LoginRequest) => api.post(loginEnpoint, data);
export const signup = (data: SignUpRequest)=>api.post(signUpEnpoint, data);
export const getFiles = (params: GetFilesParams)=>api.get<ApiResponse>(getFilesEnpoint, {params})
export const uploadFile = (formData: FormData) => api.post(uploadFilesEndpoint, formData);