import { LoginResponse } from "./types";

export interface AuthContextValue {
    isAuthorized: boolean;
    login: (token: LoginResponse) => void;
    logout: () => void;
}