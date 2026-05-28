import { apiClient } from './api.client';
import type {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  AuthUser,
} from '@/types/auth.types';

export async function loginRequest(payload: LoginPayload) {
  const { data } = await apiClient.post('/auth/login', payload);
  return data;
}

export async function registerRequest(payload: RegisterPayload) {
  const { data } = await apiClient.post<AuthResponse>('/auth/register', payload);
  return data;
}

export async function meRequest() {
  const { data } = await apiClient.get<AuthUser>('/auth/me');
  return data;
}