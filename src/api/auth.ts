import api from "./axios";

/* ---------- endpoints ---------- */

const loginEnpoint: string = "/login";
const signUpEnpoint: string = "/signup"
const getFilesEnpoint: string = "/files"
const uploadFilesEndpoint: string = getFilesEnpoint;
const googleLoginEndpoint: string = "/google";


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
  profile_pic?: File | null;
}

export interface GetFilesParams {
  limit: number;
  cursor?: number;
}

export interface GoogleLoginRequest {
  token: string;
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
// export const signup = (data: SignUpRequest) => api.post(signUpEnpoint, data);
export const signup = (data: SignUpRequest) => {
  const formData = new FormData();

  formData.append("email", data.email);
  formData.append("password", data.password);
  formData.append("first_name", data.first_name);
  formData.append("last_name", data.last_name);

  if (data.profile_pic) {
    formData.append("profile_pic", data.profile_pic);
  }

  return api.post(signUpEnpoint, formData);
};

export const getFiles = (params: GetFilesParams) => api.get<ApiResponse>(getFilesEnpoint, { params })
export const uploadFile = (formData: FormData) => api.post(uploadFilesEndpoint, formData);
export const deleteFile = (fileId: number) => api.delete(`${getFilesEnpoint}/${fileId}`);
export const googleLogin = (data: GoogleLoginRequest) => api.post(googleLoginEndpoint, data);