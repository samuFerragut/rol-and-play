export interface AuthUser {
  id: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
}

export interface AuthResponse {
  accessToken: string;
  user: AuthUser;
}

export interface LoginPayload {
  identifier: string;
  password: string;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
}
