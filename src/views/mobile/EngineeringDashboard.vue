<template>
  <div class="p-6">
    <!-- Engineering KPIs - Same as Site Manager -->
    <div class="mb-6">
      <!-- Main KPI Card Container -->
      <div class="bg-white rounded-2xl p-3 shadow-sm border border-gray-100">
        <!-- Header -->
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center space-x-2">
            <div class="w-7 h-7 bg-gradient-to-br from-petrosea-primary to-petrosea-primary-dark rounded-lg flex items-center justify-center">
              <MdiIcon :path="mdiWrench" :size="14" class="text-white" />
            </div>
            <div>
              <h3 class="text-sm font-semibold text-primary">Engineering Overview</h3>
            </div>
          </div>
          <div class="flex items-center space-x-1">
            <div :class="getOverallStatusClass()" class="w-1.5 h-1.5 rounded-full animate-pulse"></div>
            <span class="text-xs font-medium text-muted">{{ getOverallStatusText() }}</span>
          </div>
        </div>

        <!-- Minimalist KPI Grid -->
        <div class="grid grid-cols-4 gap-3">
          <!-- Active Tasks KPI -->
          <div class="text-center cursor-pointer group" @click="navigateTo('/mobile/task-management')">
            <div class="mb-2">
              <div class="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mx-auto group-hover:scale-105 transition-transform">
                <MdiIcon :path="mdiCheckboxMarkedCircle" :size="18" class="text-white" />
              </div>
            </div>
            <div :class="getKPIValueClass(engineeringKPI.activeTasksStatus)" class="text-lg font-bold">{{ engineeringKPI.activeTasks }}</div>
            <div class="text-xs text-gray-500">Active Tasks</div>
          </div>

          <!-- Work Orders KPI -->
          <div class="text-center cursor-pointer group" @click="navigateTo('/mobile/work-order')">
            <div class="mb-2">
              <div class="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mx-auto group-hover:scale-105 transition-transform">
                <MdiIcon :path="mdiClipboardList" :size="18" class="text-white" />
              </div>
            </div>
            <div :class="getKPIValueClass(engineeringKPI.workOrdersStatus)" class="text-lg font-bold">{{ engineeringKPI.assignedWorkOrders }}</div>
            <div class="text-xs text-gray-500">Work Orders</div>
          </div>

          <!-- Equipment Health KPI -->
          <div class="text-center cursor-pointer group">
            <div class="mb-2">
              <div class="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center mx-auto group-hover:scale-105 transition-transform">
                <MdiIcon :path="mdiCog" :size="18" class="text-white" />
              </div>
            </div>
            <div :class="getKPIValueClass(engineeringKPI.equipmentHealthStatus)" class="text-lg font-bold">{{ engineeringKPI.equipmentHealth }}%</div>
            <div class="text-xs text-gray-500">Equipment Health</div>
          </div>

          <!-- Pending Issues KPI -->
          <div class="text-center cursor-pointer group" @click="navigateTo('/mobile/defect-report')">
            <div class="mb-2">
              <div class="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center mx-auto group-hover:scale-105 transition-transform">
                <MdiIcon :path="mdiAlert" :size="18" class="text-white" />
              </div>
            </div>
            <div :class="getKPIValueClass(engineeringKPI.pendingItemsStatus)" class="text-lg font-bold">{{ engineeringKPI.pendingItems }}</div>
            <div class="text-xs text-gray-500">Pending Issues</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Assigned Work Orders -->
    <div class="mb-6">
      <h2 class="text-lg font-semibold text-primary mb-4">My Assigned Work Orders</h2>
      <div class="space-y-3">
        <div 
          v-for="workOrder in assignedWorkOrders" 
          :key="workOrder.id"
          @click="navigateTo(`/mobile/work-order/${workOrder.id}`)"
          class="card-dark p-4 cursor-pointer hover:bg-hover transition-colors"
        >
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-medium text-primary">{{ workOrder.title }}</span>
            <span :class="getPriorityClass(workOrder.priority)" class="px-2 py-1 text-xs font-medium rounded">
              {{ workOrder.priority }}
            </span>
          </div>
          <div class="flex items-center justify-between text-xs text-muted mb-2">
            <span>{{ workOrder.assetName }}</span>
            <span>{{ workOrder.type }}</span>
          </div>
          <div class="flex items-center justify-between text-xs mb-1">
            <span class="text-muted">Progress</span>
            <span class="text-primary">{{ workOrder.progress }}%</span>
          </div>
          <div class="w-full bg-light rounded-full h-1">
            <div 
              :class="getProgressBarClass(workOrder.status)"
              class="h-1 rounded-full transition-all duration-300"
              :style="{ width: workOrder.progress + '%' }"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useTaskStore } from '../../stores/taskStore';
import { useWorkOrderStore } from '../../stores/workOrderStore';
import MdiIcon from '../../components/MdiIcon.vue';

// Icons
import {
  mdiWrench,
  mdiCog,
  mdiAlert,
  mdiCheckboxMarkedCircle,
  mdiClipboardList,
  mdiViewDashboard
} from '@mdi/js';

const router = useRouter();
const taskStore = useTaskStore();
const workOrderStore = useWorkOrderStore();

// Engineering KPIs computed from stores
const engineeringKPI = computed(() => {
  const activeTasks = taskStore.tasks.filter(task => task.status === 'In Progress').length;
  const assignedWorkOrders = workOrderStore.workOrders.filter(wo => wo.assignedTo === 'Engineering Team').length;
  const equipmentHealth = 85; // Mock data - can be computed from asset store
  const pendingItems = 8; // Mock data - can be computed from defects/issues

  return {
    activeTasks,
    activeTasksStatus: activeTasks > 10 ? 'red' : activeTasks > 5 ? 'yellow' : 'green',
    assignedWorkOrders,
    workOrdersStatus: assignedWorkOrders > 15 ? 'red' : assignedWorkOrders > 8 ? 'yellow' : 'green', 
    equipmentHealth,
    equipmentHealthStatus: equipmentHealth < 70 ? 'red' : equipmentHealth < 85 ? 'yellow' : 'green',
    pendingItems,
    pendingItemsStatus: pendingItems > 10 ? 'red' : pendingItems > 5 ? 'yellow' : 'green'
  };
});

// Assigned work orders for the current user
const assignedWorkOrders = ref([
  {
    id: 'WO-2024-001',
    title: '500-Hour Preventive Maintenance',
    assetName: 'Excavator CAT 390F',
    type: 'Planned',
    priority: 'High',
    progress: 45,
    status: 'in-progress'
  },
  {
    id: 'WO-2024-003',
    title: 'Blade Replacement and Track Adjustment',
    assetName: 'Bulldozer CAT D8T',
    type: 'Preventive',
    priority: 'Medium',
    progress: 20,
    status: 'in-progress'
  },
  {
    id: 'WO-2024-005',
    title: 'Hydraulic System Leak Repair',
    assetName: 'Grader CAT 140M',
    type: 'Corrective',
    priority: 'High',
    progress: 80,
    status: 'in-progress'
  },
  {
    id: 'WO-2024-007',
    title: 'Annual Safety Inspection',
    assetName: 'Crane Liebherr LTM',
    type: 'Scheduled',
    priority: 'Critical',
    progress: 10,
    status: 'pending'
  },
  {
    id: 'WO-2024-009',
    title: 'Belt Tensioning and Roller Service',
    assetName: 'Conveyor System CS-001',
    type: 'Planned',
    priority: 'Medium',
    progress: 0,
    status: 'pending'
  }
]);

// Methods
const navigateTo = (path) => {
  router.push(path);
};

const getKPIValueClass = (status) => {
  const classes = {
    green: 'text-green-600',
    yellow: 'text-yellow-600', 
    red: 'text-red-600'
  };
  return classes[status] || 'text-gray-800';
};

const getPriorityClass = (priority) => {
  const classes = {
    Critical: 'bg-error-light text-error-color',
    High: 'bg-warning-light text-warning-color',
    Medium: 'bg-info-light text-info-color',
    Low: 'bg-success-light text-success-color'
  };
  return classes[priority] || 'bg-gray-100 text-gray-600';
};

const getProgressBarClass = (status) => {
  const classes = {
    'in-progress': 'bg-gradient-to-r from-blue-500 to-blue-400',
    'pending': 'bg-gradient-to-r from-gray-400 to-gray-300',
    'completed': 'bg-gradient-to-r from-green-500 to-green-400'
  };
  return classes[status] || 'bg-gray-400';
};

// Overall status methods for KPI header
const getOverallStatusClass = () => {
  const statuses = [
    engineeringKPI.value.activeTasksStatus,
    engineeringKPI.value.workOrdersStatus,
    engineeringKPI.value.equipmentHealthStatus,
    engineeringKPI.value.pendingItemsStatus
  ];
  
  if (statuses.includes('red')) return 'bg-red-500';
  if (statuses.includes('yellow')) return 'bg-yellow-500';
  return 'bg-green-500';
};

const getOverallStatusText = () => {
  const redCount = [
    engineeringKPI.value.activeTasksStatus,
    engineeringKPI.value.workOrdersStatus,
    engineeringKPI.value.equipmentHealthStatus,
    engineeringKPI.value.pendingItemsStatus
  ].filter(status => status === 'red').length;
  
  const yellowCount = [
    engineeringKPI.value.activeTasksStatus,
    engineeringKPI.value.workOrdersStatus,
    engineeringKPI.value.equipmentHealthStatus,
    engineeringKPI.value.pendingItemsStatus
  ].filter(status => status === 'yellow').length;
  
  if (redCount > 0) return 'Critical';
  if (yellowCount > 0) return 'Warning'; 
  return 'Good';
};

onMounted(() => {
  // Load engineering data
  taskStore.fetchTasks();
  workOrderStore.fetchWorkOrders();
});
</script>
