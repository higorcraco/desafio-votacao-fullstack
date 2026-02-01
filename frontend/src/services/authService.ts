import type { LoginRequest, User } from "../types";
import api from "./api";

export const authService = {
  login: async (cpf: string): Promise<User> => {
    const response = await api.post<User>("/auth/login", {
      cpf,
    } as LoginRequest);
    return response.data;
  },
};
