<template>
  <!-- Role Switcher for Testing - Elegant Fixed Position -->
  <div class="fixed bottom-20 left-4 right-4 z-30">
    <div class="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 p-4 transition-all duration-300">
      <div class="flex items-center justify-between mb-3">
        <div class="flex items-center space-x-2">
          <div class="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center">
            <MdiIcon :path="mdiTestTube" :size="14" class="text-amber-600" />
          </div>
          <div>
            <h3 class="text-sm font-semibold text-gray-800">Test Mode</h3>
            <p class="text-xs text-gray-500">Role Switcher</p>
          </div>
        </div>
        <button 
          @click="showRoleSwitcher = !showRoleSwitcher"
          :class="[
            'px-3 py-1 text-xs rounded-full transition-all duration-200',
            showRoleSwitcher 
              ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          ]"
        >
          {{ showRoleSwitcher ? 'Hide' : 'Show' }}
        </button>
      </div>
      
      <div v-if="showRoleSwitcher" class="space-y-3 animate-fadeIn">
        <div class="text-xs text-gray-600 bg-blue-50 rounded-lg p-2 border border-blue-100">
          <div class="flex items-center space-x-1 mb-1">
            <MdiIcon :path="mdiAlert" :size="12" class="text-blue-500" />
            <span class="font-medium text-blue-700">Demo Purpose Only</span>
          </div>
          <p>Switch between user roles to preview different dashboard layouts and features.</p>
        </div>
        
        <div class="space-y-2">
          <button 
            v-for="role in availableRoles" 
            :key="role.value"
            @click="switchRole(role.value)"
            :class="[
              'w-full flex items-center justify-between px-3 py-2.5 text-sm rounded-lg transition-all duration-200 transform hover:scale-[1.02]',
              currentRole === role.value 
                ? 'bg-gradient-to-r from-petrosea-primary to-petrosea-primary-dark text-gray-400 shadow-md ring-2 ring-petrosea-primary/20' 
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
            ]"
          >
            <div class="flex items-center space-x-3">
              <div :class="[
                'w-8 h-8 rounded-lg flex items-center justify-center',
                currentRole === role.value ? 'bg-white/20' : 'bg-white'
              ]">
                <MdiIcon 
                  :path="role.icon" 
                  :size="16" 
                  :class="currentRole === role.value ? 'text-gray-400' : 'text-gray-600'"
                />
              </div>
              <div class="text-left">
                <div class="font-medium">{{ role.label }}</div>
                <div :class="currentRole === role.value ? 'text-gray-400/80' : 'text-gray-500'" class="text-xs">
                  {{ role.value === 'site-manager' ? 'KPI Overview & Management' : 
                     role.value === 'maintenance-engineer' ? 'Tasks & Equipment Focus' : 
                     'General Dashboard View' }}
                </div>
              </div>
            </div>
            <div v-if="currentRole === role.value" class="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import MdiIcon from './MdiIcon.vue';

// Icons
import {
  mdiTestTube,
  mdiAlert,
  mdiShield,
  mdiCog,
  mdiAccount
} from '@mdi/js';

// Props
const props = defineProps({
  currentRole: {
    type: String,
    required: true
  }
});

// Emits
const emit = defineEmits(['role-changed']);

// Local state
const showRoleSwitcher = ref(false);

// Available roles for testing
const availableRoles = ref([
  {
    value: 'site-manager',
    label: 'Site Manager',
    icon: mdiShield
  },
  {
    value: 'maintenance-engineer', 
    label: 'Maintenance Engineer',
    icon: mdiCog
  },
]);

// Methods
const switchRole = (role) => {
  emit('role-changed', role);
  
  // Optional: Add a brief feedback to show the switch happened
  const roleNames = {
    'site-manager': 'Site Manager',
    'maintenance-engineer': 'Maintenance Engineer', 
    'other': 'Default Dashboard'
  };
  
  console.log(`Switched to ${roleNames[role]} dashboard`);
};
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}
</style>
