<template>
  <v-app>
    <div class="rp-auth-page">
      <div class="rp-auth-card">
        <div class="text-center mb-4">
          <img
            src="../../assets/branding/logo-icon.png"
            alt="Rol&Play"
            class="rp-auth-logo"
          />

          <p class="rp-auth-subtitle">Crea tu cuenta y comienza tu aventura</p>
        </div>

        <v-form @submit.prevent="handleRegister">
          <v-text-field
            v-model="form.email"
            label="Correo electrónico"
            prepend-inner-icon="mdi-email-outline"
            variant="outlined"
            class="rp-input mb-4"
            hide-details="auto"
            :error-messages="authStore.fieldErrors.email"
          />

          <v-text-field
            v-model="form.username"
            label="Nombre de usuario"
            prepend-inner-icon="mdi-account-outline"
            variant="outlined"
            class="rp-input mb-4"
            hide-details="auto"
            :error-messages="authStore.fieldErrors.username"
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
            class="rp-input mb-6"
            hide-details="auto"
            @click:append-inner="showPassword = !showPassword"
          />

          <v-alert
            v-if="authStore.error"
            type="error"
            variant="tonal"
            class="mb-4"
          >
            {{ authStore.error }}
          </v-alert>
          <v-alert
            v-if="authStore.fieldErrors.email"
            type="error"
            variant="tonal"
            class="email-conflict-message mb-4"
          >
            {{ authStore.fieldErrors.email }}

            <RouterLink to="/login" class="auth-link ml-1">
              Inicia sesión
            </RouterLink>

            <span>o</span>

            <RouterLink to="/forgot-password" class="auth-link ml-1">
              recupera tu contraseña
            </RouterLink>
          </v-alert>
          <v-btn
            type="submit"
            block
            size="x-large"
            class="rp-button-primary mb-6"
            :loading="authStore.isLoading"
          >
            Registrarse
          </v-btn>

          <div class="text-center auth-footer">
            <span>¿Ya tienes cuenta?</span>

            <RouterLink to="/login" class="auth-link ml-2">
              Inicia sesión
            </RouterLink>
          </div>
        </v-form>
      </div>
    </div>
  </v-app>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";

import { useAuthStore } from "../../stores/auth/auth.store";

const router = useRouter();
const authStore = useAuthStore();

const showPassword = ref(false);

const form = reactive({
  email: "",
  username: "",
  password: "",
});

async function handleRegister() {
  try {
    await authStore.register(form);

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

.email-conflict-message {
  font-size: 0.9rem;
  text-align: center;
}
</style>
