import { apiClient } from "./api.client";

export async function forgotPasswordRequest(email: string) {
  const { data } = await apiClient.post("/auth/forgot-password", {
    email,
  });

  return data;
}

export async function resetPasswordRequest(token: string, password: string) {
  const { data } = await apiClient.post("/auth/reset-password", {
    token,
    password,
  });

  return data;
}
