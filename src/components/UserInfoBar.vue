<template>
  <div class="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
    <div class="grid grid-cols-2 gap-4">
      <!-- Left Side: User & Site Info -->
      <div class="space-y-2">
        <div class="flex items-center space-x-2">
          <div class="w-8 h-8 bg-gradient-to-br from-petrosea-primary to-petrosea-primary-dark rounded-lg flex items-center justify-center">
            <MdiIcon :path="mdiAccount" :size="14" class="text-white" />
          </div>
          <div>
            <p class="text-sm font-semibold text-gray-900">{{ currentUser.name }}</p>
            <p class="text-xs text-gray-600">{{ currentUser.role }}</p>
          </div>
        </div>
        
        <div class="flex items-center space-x-2">
          <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
            <MdiIcon :path="mdiMapMarker" :size="14" class="text-white" />
          </div>
          <div>
            <p class="text-sm font-medium text-gray-900">{{ currentSite.name }}</p>
            <p class="text-xs text-gray-600">{{ currentSite.location }}</p>
          </div>
        </div>
      </div>

      <!-- Right Side: Date & Shift Info -->
      <div class="space-y-2">
        <div class="flex items-center space-x-2">
          <div class="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
            <MdiIcon :path="mdiCalendarClock" :size="14" class="text-white" />
          </div>
          <div>
            <p class="text-sm font-medium text-gray-900">{{ formatDate(currentDate) }}</p>
            <p class="text-xs text-gray-600">{{ formatTime(currentDate) }}</p>
          </div>
        </div>
        
        <div class="flex items-center space-x-2">
          <div class="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
            <MdiIcon :path="mdiClockOutline" :size="14" class="text-white" />
          </div>
          <div>
            <p class="text-sm font-medium text-gray-900">{{ currentShift.name }}</p>
            <p class="text-xs text-gray-600">{{ getShiftTime() }}</p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Status Indicators -->
    <div class="mt-3 pt-3 border-t border-gray-100">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <div class="flex items-center space-x-1">
            <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span class="text-xs font-medium text-gray-600">System Online</span>
          </div>
          <div class="flex items-center space-x-1">
            <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span class="text-xs font-medium text-gray-600">Connected</span>
          </div>
        </div>
        <div class="text-xs text-gray-500">
          Last sync: {{ getLastSyncTime() }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useAuthStore } from '../stores/authStore';
import { useSiteStore } from '../stores/siteStore';
import MdiIcon from './MdiIcon.vue';

// Icons
import {
  mdiAccount,
  mdiMapMarker,
  mdiCalendarClock,
  mdiClockOutline
} from '@mdi/js';

const authStore = useAuthStore();
const siteStore = useSiteStore();

// Reactive state
const currentDate = ref(new Date());

// Computed properties
const currentUser = computed(() => authStore.user);
const currentSite = computed(() => {
  const siteInfo = siteStore.getSiteInfo();
  return siteInfo ? {
    name: siteInfo.name,
    location: siteInfo.description
  } : {
    name: 'Unknown Site',
    location: 'No location'
  };
});

const currentShift = computed(() => {
  // Get current shift based on time
  const now = currentDate.value;
  const currentHour = now.getHours();
  
  let shiftName;
  let shiftTime;
  
  if (currentHour >= 6 && currentHour < 14) {
    shiftName = 'Day Shift';
    shiftTime = '06:00 - 14:00';
  } else if (currentHour >= 14 && currentHour < 22) {
    shiftName = 'Evening Shift';
    shiftTime = '14:00 - 22:00';
  } else {
    shiftName = 'Night Shift';
    shiftTime = '22:00 - 06:00';
  }
  
  return {
    name: shiftName,
    time: shiftTime,
    date: now
  };
});

// Methods
const formatDate = (date) => {
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const formatTime = (date) => {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
};

const getShiftTime = () => {
  return currentShift.value.time;
};

const getLastSyncTime = () => {
  const lastSync = new Date(Date.now() - 2 * 60 * 1000); // 2 minutes ago
  return lastSync.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
};

// Update time every minute
let timeInterval;

onMounted(() => {
  timeInterval = setInterval(() => {
    currentDate.value = new Date();
  }, 60000); // Update every minute
});

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval);
  }
});
</script>

