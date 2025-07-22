<template>
  <MobileLayout>
    <!-- User Info Section -->
    <template #user-info>
      <UserInfoBar />
    </template>
    
    <!-- Role-based Dashboard Components -->
    <!-- Site Manager Dashboard -->
    <SiteManagerDashboard v-if="userRole === 'site-manager'" />
    
    <!-- Engineering Dashboard -->
    <EngineeringDashboard v-else-if="userRole === 'maintenance-engineer'" />
    
    <!-- Default Dashboard (if role not specified) -->
    <div v-else class="p-6">
      <!-- Quick Stats Grid -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <!-- Active Work Orders -->
        <div class="card-dark p-5 text-center">
          <div class="w-12 h-12 bg-warning-light rounded-xl flex items-center justify-center mx-auto mb-3">
            <MdiIcon :path="mdiClipboardList" :size="24" class="text-warning-color" />
          </div>
          <div class="text-2xl font-bold text-primary mb-1">{{ stats.activeWorkOrders }}</div>
          <div class="text-sm text-muted">Active Work Orders</div>
        </div>

        <!-- Pending Tasks -->
        <div class="card-dark p-5 text-center">
          <div class="w-12 h-12 bg-info-light rounded-xl flex items-center justify-center mx-auto mb-3">
            <MdiIcon :path="mdiCheckboxMarkedCircle" :size="24" class="text-info-color" />
          </div>
          <div class="text-2xl font-bold text-primary mb-1">{{ stats.pendingTasks }}</div>
          <div class="text-sm text-muted">Pending Tasks</div>
        </div>

        <!-- Critical Assets -->
        <div class="card-dark p-5 text-center">
          <div class="w-12 h-12 bg-error-light rounded-xl flex items-center justify-center mx-auto mb-3">
            <MdiIcon :path="mdiAlert" :size="24" class="text-error-color" />
          </div>
          <div class="text-2xl font-bold text-primary mb-1">{{ stats.criticalAssets }}</div>
          <div class="text-sm text-muted">Critical Assets</div>
        </div>

        <!-- Completion Rate -->
        <div class="card-dark p-5 text-center">
          <div class="w-12 h-12 bg-success-light rounded-xl flex items-center justify-center mx-auto mb-3">
            <MdiIcon :path="mdiCheckCircle" :size="24" class="text-success-color" />
          </div>
          <div class="text-2xl font-bold text-primary mb-1">{{ stats.completionRate }}%</div>
          <div class="text-sm text-muted">Completion Rate</div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="mb-6">
        <h2 class="text-lg font-semibold text-primary mb-4">Quick Actions</h2>
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <button 
            @click="navigateTo('/mobile/work-order')"
            class="card-dark p-4 text-center hover:bg-hover transition-colors"
          >
            <MdiIcon :path="mdiClipboardList" :size="32" class="text-primary-color mx-auto mb-2" />
            <div class="text-sm font-medium text-primary">Work Orders</div>
          </button>
          
          <button 
            @click="navigateTo('/mobile/task-management')"
            class="card-dark p-4 text-center hover:bg-hover transition-colors"
          >
            <MdiIcon :path="mdiCheckboxMarkedCircle" :size="32" class="text-primary-color mx-auto mb-2" />
            <div class="text-sm font-medium text-primary">Tasks</div>
          </button>
          
          <button 
            @click="navigateTo('/mobile/defect-report')"
            class="card-dark p-4 text-center hover:bg-hover transition-colors"
          >
            <MdiIcon :path="mdiAlert" :size="32" class="text-primary-color mx-auto mb-2" />
            <div class="text-sm font-medium text-primary">Defects</div>
          </button>
          
          <button 
            @click="navigateTo('/mobile/material-status')"
            class="card-dark p-4 text-center hover:bg-hover transition-colors"
          >
            <MdiIcon :path="mdiPackageVariant" :size="32" class="text-primary-color mx-auto mb-2" />
            <div class="text-sm font-medium text-primary">Materials</div>
          </button>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="mb-6">
        <h2 class="text-lg font-semibold text-primary mb-4">Recent Activity</h2>
        <div class="space-y-3">
          <div 
            v-for="activity in recentActivities" 
            :key="activity.id"
            class="card-dark p-4 flex items-start space-x-3"
          >
            <div :class="getActivityIconClass(activity.type)" class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
              <MdiIcon :path="getActivityIcon(activity.type)" :size="16" class="text-white" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-primary">{{ activity.title }}</p>
              <p class="text-xs text-muted mt-1">{{ activity.description }}</p>
              <p class="text-xs text-muted mt-1">{{ formatTime(activity.timestamp) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Priority Work Orders -->
      <div class="mb-6">
        <h2 class="text-lg font-semibold text-primary mb-4">Priority Work Orders</h2>
        <div class="space-y-3">
          <div 
            v-for="workOrder in priorityWorkOrders" 
            :key="workOrder.id"
            @click="navigateTo(`/mobile/work-order`)"
            class="card-dark p-4 cursor-pointer hover:bg-hover transition-colors"
          >
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-medium text-primary">{{ workOrder.title }}</span>
              <span :class="getPriorityClass(workOrder.priority)" class="px-2 py-1 text-xs font-medium rounded">
                {{ workOrder.priority }}
              </span>
            </div>
            <div class="flex items-center justify-between text-xs text-muted">
              <span>{{ workOrder.asset }}</span>
              <span>Due: {{ formatDate(workOrder.dueDate) }}</span>
            </div>
            <div class="mt-2">
              <div class="flex items-center justify-between text-xs mb-1">
                <span class="text-muted">Progress</span>
                <span class="text-primary">{{ workOrder.progress }}%</span>
              </div>
              <div class="w-full bg-light rounded-full h-1">
                <div 
                  class="bg-primary-color h-1 rounded-full transition-all duration-300"
                  :style="{ width: workOrder.progress + '%' }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Role Switcher Component -->
    <RoleSwitcher 
      :current-role="currentRole" 
      @role-changed="handleRoleChange"
    />
  </MobileLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useWorkOrderStore } from '../../stores/workOrderStore';
import { useTaskStore } from '../../stores/taskStore';
import { useAssetStore } from '../../stores/assetStore';
import { useAuthStore } from '../../stores/authStore';
import MobileLayout from '../../components/MobileLayout.vue';
import UserInfoBar from '../../components/UserInfoBar.vue';
import SiteManagerDashboard from './SiteManagerDashboard.vue';
import EngineeringDashboard from './EngineeringDashboard.vue';
import RoleSwitcher from '../../components/RoleSwitcher.vue';
import MdiIcon from '../../components/MdiIcon.vue';

// Icons
import {
  mdiClipboardList,
  mdiCheckboxMarkedCircle,
  mdiAlert,
  mdiCheckCircle,
  mdiPackageVariant
} from '@mdi/js';

const router = useRouter();
const workOrderStore = useWorkOrderStore();
const taskStore = useTaskStore();
const assetStore = useAssetStore();
const authStore = useAuthStore();

// Role switcher state
const currentRole = ref('site-manager');

// User role - now uses reactive ref for switching
const userRole = computed(() => currentRole.value);

// Stats for default dashboard (when role is not site-manager or maintenance-engineer)
const stats = computed(() => ({
  activeWorkOrders: workOrderStore.workOrders.filter(wo => wo.status !== 'Completed').length,
  pendingTasks: taskStore.tasks.filter(task => task.progress < 100).length,
  criticalAssets: assetStore.assets.filter(asset => asset.status === 'Critical').length,
  completionRate: Math.round(workOrderStore.completionRate)
}));

// Recent activities
const recentActivities = ref([
  {
    id: 1,
    type: 'work_order',
    title: 'Work Order Completed',
    description: 'WO-2024-003 - Excavator Hydraulic Service completed',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
  },
  {
    id: 2,
    type: 'defect',
    title: 'New Defect Reported',
    description: 'DEF-2024-008 - Conveyor Belt Misalignment detected',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000) // 4 hours ago
  },
  {
    id: 3,
    type: 'task',
    title: 'Task Updated',
    description: 'Daily inspection task progress updated to 75%',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000) // 6 hours ago
  },
  {
    id: 4,
    type: 'material',
    title: 'Material Delivered',
    description: 'Hydraulic filters restocked - 50 units received',
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000) // 8 hours ago
  }
]);

// Priority work orders
const priorityWorkOrders = computed(() => 
  workOrderStore.workOrders
    .filter(wo => wo.priority === 'High' && wo.status !== 'Completed')
    .slice(0, 5)
    .map(wo => ({
      id: wo.id,
      title: wo.title,
      asset: wo.asset,
      priority: wo.priority,
      dueDate: wo.dueDate,
      progress: wo.progress || 0
    }))
);

// Methods
const navigateTo = (path) => {
  router.push(path);
};

// Role switching method for testing (now handles event from RoleSwitcher component)
const handleRoleChange = (role) => {
  currentRole.value = role;
  
  // Optional: Add a brief feedback to show the switch happened
  const roleNames = {
    'site-manager': 'Site Manager',
    'maintenance-engineer': 'Maintenance Engineer'
  };
  
  console.log(`Switched to ${roleNames[role]} dashboard`);
};

const getActivityIconClass = (type) => {
  const classes = {
    work_order: 'bg-primary-color',
    defect: 'bg-error-color',
    task: 'bg-info-color',
    material: 'bg-success-color'
  };
  return classes[type] || 'bg-gray-500';
};

const getActivityIcon = (type) => {
  const icons = {
    work_order: mdiClipboardList,
    defect: mdiAlert,
    task: mdiCheckboxMarkedCircle,
    material: mdiPackageVariant
  };
  return icons[type] || mdiAlert;
};

const getPriorityClass = (priority) => {
  const classes = {
    High: 'bg-error-light text-error-color',
    Medium: 'bg-warning-light text-warning-color',
    Low: 'bg-success-light text-success-color'
  };
  return classes[priority] || 'bg-gray-100 text-gray-600';
};

const formatTime = (timestamp) => {
  const now = new Date();
  const diff = now - timestamp;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  
  if (hours < 1) {
    const minutes = Math.floor(diff / (1000 * 60));
    return `${minutes}m ago`;
  } else if (hours < 24) {
    return `${hours}h ago`;
  } else {
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  }
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

onMounted(() => {
  // Load data
  workOrderStore.fetchWorkOrders();
  taskStore.fetchTasks();
  assetStore.fetchAssets();
});
</script>


