import api from "./axios";

const loginEnpoint:string = "/login";
const signUpEnpoint:string = "/signup"


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

export const login = (data: LoginRequest) => api.post(loginEnpoint, data);
export const signup = (data: SignUpRequest)=>api.post(signUpEnpoint, data);