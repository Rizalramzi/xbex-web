<template>  <nav class="bg-header text-primary border-b border-light">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <span class="text-xl font-bold text-primary-color">XiBex</span>
          </div>
          <div v-if="isAuthenticated" class="hidden md:block">
            <div class="ml-10 flex items-baseline space-x-4">
              <router-link 
                v-for="item in navigation" 
                :key="item.name" 
                :to="item.href" 
                :class="[
                  $route.path.startsWith(item.href) ? 'bg-primary text-inverse' : 'text-secondary hover:bg-primary-light hover:text-primary',
                  'px-3 py-2 rounded-md text-sm font-medium transition-all duration-200'
                ]"
              >
                {{ item.name }}
              </router-link>
            </div>
          </div>
        </div>
        <div v-if="isAuthenticated" class="hidden md:block">
          <div class="ml-4 flex items-center md:ml-6">
            <div class="ml-3 relative">
              <div>
                <button 
                  @click="logout" 
                  class="bg-error hover:bg-error-hover p-2 rounded-md text-inverse focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-error transition-all duration-200"
                >
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div v-if="isAuthenticated" class="-mr-2 flex md:hidden">
          <!-- Mobile menu button -->
          <button 
            @click="isMobileMenuOpen = !isMobileMenuOpen" 
            class="bg-header inline-flex items-center justify-center p-2 rounded-md text-secondary hover:text-primary hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200"
          >
            <span class="sr-only">Open main menu</span>
            <!-- Menu icon -->
            <svg v-if="!isMobileMenuOpen" class="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <!-- Close icon -->
            <svg v-else class="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile menu, show/hide based on menu state -->
    <div v-if="isAuthenticated && isMobileMenuOpen" class="md:hidden border-t border-light">
      <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-header">
        <router-link 
          v-for="item in navigation" 
          :key="item.name" 
          :to="item.href" 
          :class="[
            $route.path.startsWith(item.href) ? 'bg-primary text-inverse' : 'text-secondary hover:bg-primary-light hover:text-primary',
            'block px-3 py-2 rounded-md text-base font-medium transition-all duration-200'
          ]"
          @click="isMobileMenuOpen = false"
        >
          {{ item.name }}
        </router-link>
        <button 
          @click="logout" 
          class="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-error hover:bg-error-light hover:text-error transition-all duration-200"
        >
          Logout
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/authStore';
import menuData from '../assets/data/menu.json';

const router = useRouter();
const authStore = useAuthStore();
const isMobileMenuOpen = ref(false);
const navigation = ref([]);

const isAuthenticated = computed(() => authStore.isAuthenticated);

onMounted(() => {
  navigation.value = menuData;
});

const logout = async () => {
  await authStore.logout();
  router.push('/login');
};
</script>
