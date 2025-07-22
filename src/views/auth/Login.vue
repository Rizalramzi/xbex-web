<template>
  <div class="min-h-screen bg-app flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <!-- Login Card -->      <div class="card-dark shadow-xl transform transition-all duration-300 hover:shadow-2xl">
        <!-- Logo/Image Section -->
        <div class="text-center px-6 pt-8 pb-6">          
          <div class="mx-auto flex justify-center">
            <img 
              :src="logoImage" 
              alt="ARFS Logo" 
              class="w-24 h-24 transition-transform duration-300 hover:scale-105"
            />
          </div>
          <h2 class="mt-6 text-2xl font-bold" style="color: var(--text-primary);">
            Welcome Back
          </h2>
          <p class="mt-2 text-sm" style="color: var(--text-muted);">
            Sign in to your Asset Management account
          </p>
        </div>

        <!-- Login Method Selection -->
        <div v-if="!loginMethod" class="px-6 pb-8">
          <button @click="selectLoginMethod('sso')" class="btn-custom-primary w-full mb-4 cursor-pointer">
            Single Sign On
          </button>
          <button @click="selectLoginMethod('manual')" class="btn-custom-secondary w-full cursor-pointer">
            Manual Credentials
          </button>
        </div>

        <!-- Switch Login Method Button -->
        <div v-if="loginMethod || showSsoConfirm" class="px-6 pt-2 pb-2">
          <button
            v-if="loginMethod === 'manual'"
            @click="resetLoginMethod"
            type="button"
            class="w-full btn-custom-secondary mb-4 cursor-pointer"
            style="display: none;"
          >
            ← Use Single Sign On
          </button>
          <button
            v-else-if="showSsoConfirm"
            @click="resetLoginMethod"
            type="button"
            class="w-full btn-custom-secondary mb-4 cursor-pointer"
          >
            ← Use Manual Credentials
          </button>
        </div>

        <!-- SSO Confirmation Modal -->
        <div v-if="showSsoConfirm" 
          class="fixed inset-0 flex items-center justify-center z-50" 
          style="background-color: rgba(0, 0, 0, 0.8);">
          <div class="rounded-lg shadow-lg p-8 max-w-sm w-full" style="background-color: var(--color-bgpopup);">
            <h3 class="text-lg font-semibold mb-4" style="color: var(--text-primary);">Redirect to SSO Portal</h3>
            <p class="mb-6 text-sm" style="color: var(--text-muted);">
              You will be redirected to the Single Sign On portal to continue authentication.
            </p>
            <div class="flex justify-end space-x-3">
              <button @click="showSsoConfirm = false" class="btn btn-secondary cursor-pointer">Cancel</button>
              <button @click="redirectToSso" class="btn btn-primary cursor-pointer">Continue</button>
            </div>
          </div>
        </div>

        <!-- Manual Login Form -->
        <div v-if="loginMethod === 'manual'" class="px-6 pb-8">
          <form class="space-y-6" @submit.prevent="handleLogin">
            <div>
              <label for="loginId" class="block text-sm font-medium mb-2" style="color: var(--text-primary);">
                Login ID
              </label>
              <input 
                id="loginId" 
                v-model="loginId" 
                name="loginId" 
                type="text" 
                autocomplete="username" 
                required 
                class="form-input-dark w-full"
                placeholder="Enter your Login ID"
              />
            </div>

            <div>
              <label for="password" class="block text-sm font-medium mb-2" style="color: var(--text-primary);">
                Password
              </label>
              <input 
                id="password" 
                v-model="password" 
                name="password" 
                type="password" 
                autocomplete="current-password" 
                required 
                class="form-input-dark w-full"
                placeholder="Enter your password"
              />
            </div>

            <!-- Error Message -->
            <div v-if="loginError" class="text-sm p-3 rounded-md" style="background-color: var(--color-error-light); color: var(--color-error);">
              {{ loginError }}
            </div>

            <!-- Login Button -->
            <div>
              <button 
                type="submit" 
                :disabled="isLoading"
                class="btn-custom-primary w-full cursor-pointer"
              >
                <span v-if="isLoading" class="flex items-center justify-center">
                  <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
                <span v-else>Sign In</span>
              </button>
            </div>

            <!-- Switch to SSO Button -->
            <div>
              <button
                @click="resetLoginMethod"
                type="button"
                class="w-full btn-custom-secondary cursor-pointer"
              >
                ← Use Single Sign On
              </button>
            </div>

            <!-- Test Account Info -->
            <div class="text-center pt-4 border-t" style="border-color: var(--border-light);">
              <!-- Auth Links -->
              <div class="flex justify-between items-center text-sm">
                <router-link 
                  to="/forgot-password" 
                  class="font-medium transition-colors hover:opacity-80 cursor-pointer" 
                  style="color: var(--color-primary);"
                >
                  Forgot Password?
                </router-link>
              </div>
            </div>
          </form>
        </div>
      </div>

      <!-- Footer -->
      <div class="text-center">
        <p class="text-xs" style="color: var(--text-muted);">
          © 2025 ARFS
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/authStore';
import logoImage from '../../assets/images/logo.svg';

const router = useRouter();
const authStore = useAuthStore();

const loginMethod = ref('manual'); // 'sso' or 'manual'
const showSsoConfirm = ref(false);

const loginId = ref('');
const password = ref('');
const loginError = ref('');

const isLoading = computed(() => authStore.loading);

const selectLoginMethod = (method) => {
  if (method === 'sso') {
    showSsoConfirm.value = true;
  } else {
    loginMethod.value = 'manual';
  }
};

const redirectToSso = () => {
  // Simulate SSO redirect
  showSsoConfirm.value = false;
  // In production, redirect to SSO portal URL
  window.location.href = 'https://sso.yourcompany.com';
};

const handleLogin = async () => {
  if (!loginId.value || !password.value) {
    loginError.value = 'Please enter both Login ID and password';
    return;
  }

  // Simulate login with Login ID as username
  const success = await authStore.login({
    email: loginId.value, // For mock, treat loginId as email/username
    password: password.value
  });

  if (success) {
    router.push('/dashboard');
  } else {
    loginError.value = authStore.error || 'Login failed. Please try again.';
  }
};

const resetLoginMethod = () => {
  loginMethod.value = null;
  showSsoConfirm.value = false;
};
</script>
