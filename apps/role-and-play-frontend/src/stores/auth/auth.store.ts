import { defineStore } from "pinia";
import { loginRequest, registerRequest, meRequest } from "../../api/auth.api";
import type {
  AuthUser,
  LoginPayload,
  RegisterPayload,
} from "../../types/auth.types";

interface AuthFieldErrors {
  email: string | null;
  username: string | null;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  fieldErrors: AuthFieldErrors;
}

export const useAuthStore = defineStore("auth", {
  state: (): AuthState => ({
    user: JSON.parse(localStorage.getItem("rolplay_user") || "null"),
    token: localStorage.getItem("rolplay_token"),
    isLoading: false,
    error: null,
    fieldErrors: {
      email: null,
      username: null,
    } as {
      email: string | null;
      username: string | null;
    },
  }),

  getters: {
    isAuthenticated: (state) => Boolean(state.token && state.user),
  },

  actions: {
    async login(payload: LoginPayload) {
      this.isLoading = true;
      this.error = null;

      try {
        const response = await loginRequest(payload);

        this.token = response.accessToken;
        this.user = response.user;

        localStorage.setItem("rolplay_token", response.accessToken);
        localStorage.setItem("rolplay_user", JSON.stringify(response.user));

        return response;
      } catch {
        this.error = "Credenciales incorrectas.";
        throw new Error(this.error);
      } finally {
        this.isLoading = false;
      }
    },

    async register(payload: RegisterPayload) {
      this.isLoading = true;
      this.error = null;
      this.fieldErrors.email = null;
      this.fieldErrors.username = null;

      try {
        const response = await registerRequest(payload);

        this.token = response.accessToken;
        this.user = response.user;

        localStorage.setItem("rolplay_token", response.accessToken);
        localStorage.setItem("rolplay_user", JSON.stringify(response.user));

        return response;
      } catch (error: any) {
        const backendError = error.response?.data;

        if (backendError?.field === "email") {
          this.fieldErrors.email = backendError.message;
          this.error = null;
        } else if (backendError?.field === "username") {
          this.fieldErrors.username = backendError.message;
          this.error = null;
        } else {
          this.error = "No se pudo crear la cuenta.";
        }

        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    logout() {
      this.user = null;
      this.token = null;

      localStorage.removeItem("rolplay_token");
      localStorage.removeItem("rolplay_user");
    },

    async fetchMe() {
      if (!this.token) return null;

      this.isLoading = true;

      try {
        const user = await meRequest();

        this.user = user;
        localStorage.setItem("rolplay_user", JSON.stringify(user));

        return user;
      } catch {
        this.logout();
        return null;
      } finally {
        this.isLoading = false;
      }
    },
  },
});
