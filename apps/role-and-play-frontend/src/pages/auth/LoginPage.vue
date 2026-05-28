<template>
  <v-app>
    <div class="rp-auth-page">
      <div class="rp-auth-card">
        <div class="text-center mb-8">
          <img
            src="../../assets/branding/logo-icon.png"
            alt="Rol&Play"
            class="rp-auth-logo"
          />

          <p class="rp-auth-subtitle">Bienvenido aventurero</p>
        </div>

        <v-form @submit.prevent="handleLogin">
          <v-text-field
            v-model="form.identifier"
            label="Correo electrónico"
            prepend-inner-icon="mdi-email-outline"
            variant="outlined"
            class="rp-input mb-4"
            hide-details="auto"
          />

          <v-text-field
            v-model="form.password"
            label="Contraseña"
            prepend-inner-icon="mdi-lock-outline"
            :append-inner-icon="
              showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'
            "
            :type="showPassword ? 'text' : 'password'"
            variant="outlined"
            class="rp-input mb-2"
            hide-details="auto"
            @click:append-inner="showPassword = !showPassword"
          />

          <div class="d-flex justify-end mb-6">
            <RouterLink to="/forgot-password" class="auth-link">
              ¿Has olvidado tu contraseña?
            </RouterLink>
          </div>

          <v-alert
            v-if="authStore.error"
            type="error"
            variant="tonal"
            class="mb-4"
          >
            {{ authStore.error }}
          </v-alert>

          <v-btn
            type="submit"
            size="x-large"
            class="rp-button-primary login-button mb-6"
            :loading="authStore.isLoading"
          >
            Entrar
          </v-btn>

          <div class="text-center auth-footer">
            <span> ¿No tienes cuenta? </span>

            <RouterLink to="/register" class="auth-link ml-2">
              Regístrate
            </RouterLink>
          </div>
        </v-form>
      </div>
    </div>
  </v-app>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRouter } from "vue-router";

import { useAuthStore } from "../../stores/auth/auth.store";

const router = useRouter();
const authStore = useAuthStore();
const showPassword = ref(false);

const form = reactive({
  identifier: "",
  password: "",
});

async function handleLogin() {
  try {
    await authStore.login(form);

    router.push("/home");
  } catch (error) {
    console.error(error);
  }
}
</script>

<style scoped lang="scss">
.auth-link {
  color: var(--rp-gold-primary);

  font-weight: 500;

  transition: var(--rp-transition-fast);

  &:hover {
    opacity: 0.8;
  }
}

.auth-footer {
  color: var(--rp-text-secondary);
}

.login-button {
  width: 100%;
}
</style>
