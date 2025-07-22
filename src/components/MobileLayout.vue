<template>
  <div class="min-h-screen bg-app flex flex-col">
    <!-- Mobile Header - Fixed Position with Petrosea Green Gradient -->
    <div class="fixed top-0 left-0 right-0 z-40 px-4 py-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 flex-shrink-0">
      <div class="flex items-center space-x-3">
        <!-- Search Type Dropdown -->
        <div class="relative">
          <select 
            v-model="searchCategory"
            class="appearance-none bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-3 py-2 pr-8 text-sm text-white font-medium focus:outline-none focus:ring-2 focus:ring-white/30 focus:bg-white/20 transition-all"
          >
            <option value="workorder" class="text-gray-800">Work Order</option>
            <option value="item" class="text-gray-800">Item</option>
            <option value="asset" class="text-gray-800">Asset</option>
            <option value="employee" class="text-gray-800">Employee</option>
          </select>
          <div class="absolute inset-y-0 right-2 flex items-center pointer-events-none">
            <MdiIcon :path="mdiChevronDown" :size="16" class="text-white/70" />
          </div>
        </div>
        
        <!-- Search Input -->
        <div class="relative flex-1">
          <input 
            type="text" 
            :placeholder="getSearchPlaceholder()"
            class="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-2 text-sm text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/30 focus:bg-white/20 transition-all"
            v-model="searchQuery"
            @input="handleSearch"
            @focus="handleSearch"
            @blur="() => setTimeout(() => showAutocomplete.value = false, 200)"
          >
          
          <!-- Search Results Dropdown -->
          <div v-if="showAutocomplete && searchResults.length > 0" class="absolute left-0 right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-gray-200 z-50 max-h-64 overflow-auto">
            <div v-for="item in searchResults" :key="item.id || item.sku || item.title" @mousedown.prevent="selectAutocomplete(item)" class="px-4 py-3 cursor-pointer hover:bg-gray-50 text-sm border-b border-gray-100 last:border-b-0">
              <template v-if="searchCategory === 'asset'">
                <div class="font-medium text-gray-900">{{ item.name }}</div>
                <div class="text-xs text-gray-600 mt-1">{{ item.code }} • {{ item.location }}</div>
              </template>
              <template v-else-if="searchCategory === 'item'">
                <div class="font-medium text-gray-900">{{ item.name }}</div>
                <div class="text-xs text-gray-600 mt-1">SKU: {{ item.sku }} • {{ item.category }}</div>
              </template>
              <template v-else-if="searchCategory === 'workorder'">
                <div class="font-medium text-gray-900">{{ item.title }}</div>
                <div class="text-xs text-gray-600 mt-1">{{ item.id }} • {{ item.status }}</div>
              </template>
              <template v-else-if="searchCategory === 'employee'">
                <div class="font-medium text-gray-900">{{ item.name }}</div>
                <div class="text-xs text-gray-600 mt-1">ID: {{ item.id }} • {{ item.department }}</div>
              </template>
            </div>
          </div>
        </div>

        <!-- User Avatar -->
        <div class="relative" ref="userMenuRef">
          <button 
            @click="showUserMenu = !showUserMenu"
            class="w-10 h-10 bg-white/20 backdrop-blur-sm border-2 border-white/30 rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-200"
          >
            <span class="text-sm font-bold text-white">{{ userInitials }}</span>
          </button>
          
          <!-- User Dropdown -->
          <div v-if="showUserMenu" class="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 z-50">
            <div class="p-4 border-b border-gray-100">
              <p class="text-sm font-medium text-gray-900">{{ currentUser.name }}</p>
              <p class="text-xs text-gray-600">{{ currentUser.role }}</p>
              <p class="text-xs text-gray-600 mt-1">{{ currentSite.name }} • {{ currentShift.name }}</p>
            </div>
            <div class="p-2">
              <button 
                @click="logout"
                class="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center"
              >
                <MdiIcon :path="mdiLogout" :size="16" class="mr-2" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content Area with Top/Bottom Padding for Fixed Header/Footer -->
    <div class="flex-1 overflow-auto pt-20 pb-20">
      <!-- User Info Section (Optional) -->
      <slot name="user-info" />
      
      <!-- Main Content -->
      <slot />
    </div>

    <!-- Bottom Navigation - Fixed Position -->
    <div class="fixed bottom-0 left-0 right-0 z-40 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] border-t border-gray-200 flex-shrink-0">
      <div class="grid grid-cols-6 h-16">
        <button 
          v-for="navItem in bottomNavItems" 
          :key="navItem.path"
          @click="navigateTo(navItem.path)"
          :class="[
            'flex flex-col items-center justify-center space-y-1 transition-colors px-1',
            ($route.path === navItem.path || 
             ($route.path === '/mobile/dashboard' && navItem.path === '/mobile/dashboard')) 
              ? 'text-emerald-600' 
              : 'text-gray-500 hover:text-emerald-600'
          ]"
        >
          <MdiIcon :path="navItem.icon" :size="20" />
          <span class="text-xs font-medium">{{ navItem.label }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '../stores/authStore';
import { useSiteStore } from '../stores/siteStore';
import MdiIcon from './MdiIcon.vue';
import searchData from '../assets/data/search.json';

// Icons
import {
  mdiChevronDown,
  mdiHome,
  mdiSync,
  mdiLogout,
  mdiCheckboxMarkedCircle,
  mdiPackageVariant,
  mdiBookOpenPageVariant,
  mdiAlertOctagon
} from '@mdi/js';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const siteStore = useSiteStore();

// Reactive state
const showUserMenu = ref(false);
const userMenuRef = ref(null);

// Search functionality
const searchCategory = ref('workorder');
const searchQuery = ref('');
const searchResults = ref([]);
const showAutocomplete = ref(false);

// Computed properties
const currentUser = computed(() => authStore.user);
const currentSite = computed(() => siteStore.currentSite);
const userInitials = computed(() => {
  const name = currentUser.value?.name || 'User';
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
});

const currentShift = computed(() => {
  // Get current shift based on time
  const now = new Date();
  const currentHour = now.getHours();
  
  let shiftName;
  if (currentHour >= 6 && currentHour < 14) {
    shiftName = 'Day Shift';
  } else if (currentHour >= 14 && currentHour < 22) {
    shiftName = 'Evening Shift';
  } else {
    shiftName = 'Night Shift';
  }
  
  return {
    name: shiftName,
    date: now
  };
});

// Bottom navigation items
const bottomNavItems = [
  { path: '/mobile/dashboard', icon: mdiHome, label: 'Home' },
  { path: '/mobile/sync-data', icon: mdiSync, label: 'Sync' },
  { path: '/mobile/task-management', icon: mdiCheckboxMarkedCircle, label: 'My Task' },
  { path: '/mobile/material-status', icon: mdiPackageVariant, label: 'Material' },
  { path: '/mobile/knowledge-base', icon: mdiBookOpenPageVariant, label: 'Knowledge Base' },
  { path: '/mobile/defect-report', icon: mdiAlertOctagon, label: 'Defects' }
];

// Methods
const navigateTo = (path) => {
  router.push(path);
};

const logout = async () => {
  showUserMenu.value = false;
  await authStore.logout();
  router.push('/mobile/login');
};

// Search functionality
const handleSearch = () => {
  const query = searchQuery.value.trim().toLowerCase();
  if (!query) {
    searchResults.value = [];
    showAutocomplete.value = false;
    return;
  }
  
  const cat = searchCategory.value;
  let results = [];
  
  if (searchData[cat]) {
    if (cat === 'asset') {
      results = searchData.asset.filter(a =>
        a.name.toLowerCase().includes(query) ||
        a.code.toLowerCase().includes(query) ||
        a.location.toLowerCase().includes(query)
      );
    } else if (cat === 'item') {
      results = searchData.item.filter(i =>
        i.name.toLowerCase().includes(query) ||
        i.sku.toLowerCase().includes(query) ||
        i.category.toLowerCase().includes(query)
      );
    } else if (cat === 'workorder') {
      results = searchData.workorder.filter(w =>
        w.id.toLowerCase().includes(query) ||
        w.title.toLowerCase().includes(query) ||
        w.status.toLowerCase().includes(query)
      );
    } else if (cat === 'employee') {
      results = searchData.employee.filter(e =>
        e.name.toLowerCase().includes(query) ||
        e.id.toLowerCase().includes(query) ||
        e.department.toLowerCase().includes(query)
      );
    }
  }
  
  searchResults.value = results.slice(0, 6);
  showAutocomplete.value = searchResults.value.length > 0;
};

const selectAutocomplete = (item) => {
  searchQuery.value = item.name || item.title || item.id;
  showAutocomplete.value = false;
  
  // Navigate based on category and item
  if (searchCategory.value === 'workorder') {
    router.push('/mobile/work-order');
  } else if (searchCategory.value === 'asset') {
    router.push('/mobile/assets');
  } else if (searchCategory.value === 'item') {
    router.push('/mobile/material-status');
  }
};

const getSearchPlaceholder = () => {
  const placeholders = {
    asset: 'Search assets...',
    item: 'Search items...',
    workorder: 'Search work orders...',
    employee: 'Search employees...'
  };
  return placeholders[searchCategory.value] || 'Search...';
};

// Close user menu when clicking outside
const handleClickOutside = (event) => {
  if (userMenuRef.value && !userMenuRef.value.contains(event.target)) {
    showUserMenu.value = false;
  }
};

onMounted(() => {
  // Add click outside listener
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
/* Tablet-specific optimizations */
@media (max-width: 1024px) {
  .min-h-screen {
    min-height: 100vh;
    min-height: 100dvh;
  }
}

/* Ensure proper tap targets for tablet */
button {
  min-height: 44px;
}

/* Bottom navigation */
.grid-cols-6 > button {
  min-height: 64px;
}

/* Smooth transitions */
* {
  -webkit-tap-highlight-color: transparent;
}

/* Custom scrollbar for mobile */
::-webkit-scrollbar {
  width: 4px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: var(--border-medium);
  border-radius: 2px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--text-muted);
}
</style>
