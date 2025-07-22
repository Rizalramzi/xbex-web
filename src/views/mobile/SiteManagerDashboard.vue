<template>
  <div class="p-6">
    <!-- Site Manager KPIs - Streamlined Design -->
    <div class="mb-6">
      <!-- Simplified KPI Container -->
      <div class="bg-white rounded-xl p-4 shadow-sm">
        <!-- Compact Header -->
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-sm font-semibold text-gray-800">Site Overview</h3>
          <div class="flex items-center space-x-1">
            <div :class="getOverallStatusClass()" class="w-1.5 h-1.5 rounded-full"></div>
            <span class="text-xs text-gray-600">{{ getOverallStatusText() }}</span>
          </div>
        </div>

        <!-- Minimalist KPI Grid -->
        <div class="grid grid-cols-4 gap-3">
          <!-- Work Orders KPI -->
          <div class="text-center cursor-pointer group" @click="navigateTo('/mobile/work-order')">
            <div class="mb-2">
              <div class="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mx-auto group-hover:scale-105 transition-transform">
                <MdiIcon :path="mdiClipboardList" :size="18" class="text-white" />
              </div>
            </div>
            <div :class="getKPIValueClass(workOrderKPI.status)" class="text-lg font-bold">{{ workOrderKPI.completionRate }}%</div>
            <div class="text-xs text-gray-500">Work Orders</div>
          </div>

          <!-- Item Availability KPI -->
          <div class="text-center cursor-pointer group" @click="navigateTo('/mobile/material-status')">
            <div class="mb-2">
              <div class="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mx-auto group-hover:scale-105 transition-transform">
                <MdiIcon :path="mdiPackageVariant" :size="18" class="text-white" />
              </div>
            </div>
            <div :class="getKPIValueClass(itemAvailabilityKPI.status)" class="text-lg font-bold">{{ itemAvailabilityKPI.percentage }}%</div>
            <div class="text-xs text-gray-500">Items Available</div>
          </div>

          <!-- Critical Stock KPI -->
          <div class="text-center cursor-pointer group" @click="navigateTo('/mobile/material-status')">
            <div class="mb-2">
              <div class="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center mx-auto group-hover:scale-105 transition-transform">
                <MdiIcon :path="mdiAlert" :size="18" class="text-white" />
              </div>
            </div>
            <div :class="getKPIValueClass(criticalStockKPI.status)" class="text-lg font-bold">{{ criticalStockKPI.count }}</div>
            <div class="text-xs text-gray-500">Critical Items</div>
          </div>

          <!-- Task Progress KPI -->
          <div class="text-center cursor-pointer group" @click="navigateTo('/mobile/task-management')">
            <div class="mb-2">
              <div class="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center mx-auto group-hover:scale-105 transition-transform">
                <MdiIcon :path="mdiCheckCircle" :size="18" class="text-white" />
              </div>
            </div>
            <div :class="getKPIValueClass(taskCompletionKPI.status)" class="text-lg font-bold">{{ taskCompletionKPI.progress }}%</div>
            <div class="text-xs text-gray-500">Task Progress</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Site Manager Quick Actions -->
    <div class="mb-6">
      <h2 class="text-lg font-semibold text-primary mb-4">Site Management</h2>
      <div class="grid grid-cols-4 gap-2">
        <button 
          @click="navigateTo('/mobile/work-order')"
          class="p-3 text-center hover:bg-gray-50 transition-all duration-300 group rounded-lg"
        >
          <div class="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
            <MdiIcon :path="mdiClipboardList" :size="16" class="text-white" />
          </div>
          <div class="text-xs font-medium text-blue-700">Work Orders</div>
        </button>
        
        <button 
          @click="navigateTo('/mobile/material-status')"
          class="p-3 text-center hover:bg-gray-50 transition-all duration-300 group rounded-lg"
        >
          <div class="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
            <MdiIcon :path="mdiPackageVariant" :size="16" class="text-white" />
          </div>
          <div class="text-xs font-medium text-green-700">Materials</div>
        </button>
        
        <button 
          @click="navigateTo('/mobile/defect-report')"
          class="p-3 text-center hover:bg-gray-50 transition-all duration-300 group rounded-lg"
        >
          <div class="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
            <MdiIcon :path="mdiAlert" :size="16" class="text-white" />
          </div>
          <div class="text-xs font-medium text-red-700">Defects</div>
        </button>
        
        <button 
          @click="navigateTo('/mobile/reports')"
          class="p-3 text-center hover:bg-gray-50 transition-all duration-300 group rounded-lg"
        >
          <div class="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
            <MdiIcon :path="mdiChartLine" :size="16" class="text-white" />
          </div>
          <div class="text-xs font-medium text-purple-700">Reports</div>
        </button>
      </div>
    </div>

    <!-- Priority Work Orders -->
    <div class="mb-6">
      <h2 class="text-lg font-semibold text-primary mb-4">Priority Work Orders</h2>
      <div class="space-y-3">
        <div 
          v-for="workOrder in priorityWorkOrders" 
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

    <!-- Critical Issues -->
    <div class="mb-6">
      <h2 class="text-lg font-semibold text-primary mb-4">Critical Issues</h2>
      <div class="space-y-3">
        <div 
          v-for="issue in criticalIssues" 
          :key="issue.id"
          class="card-dark p-4"
        >
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-medium text-primary">{{ issue.title }}</span>
            <span :class="getSeverityClass(issue.severity)" class="px-2 py-1 text-xs font-medium rounded">
              {{ issue.severity }}
            </span>
          </div>
          <div class="flex items-center justify-between text-xs text-muted">
            <span>{{ issue.equipment }}</span>
            <span>{{ formatTime(issue.reportedAt) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="mb-6">
      <h2 class="text-lg font-semibold text-primary mb-4">Recent Activity</h2>
      <div class="space-y-3">
        <div 
          v-for="activity in recentActivity" 
          :key="activity.id"
          class="card-dark p-4"
        >
          <div class="flex items-start space-x-3">
            <div :class="getActivityIconClass(activity.type)" class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
              <MdiIcon :path="getActivityIcon(activity.type)" :size="16" class="text-white" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm text-primary">{{ activity.description }}</p>
              <p class="text-xs text-muted">{{ formatTime(activity.timestamp) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>


  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useWorkOrderStore } from '../../stores/workOrderStore';
import { useItemStore } from '../../stores/itemStore';
import { useTaskStore } from '../../stores/taskStore';
import MdiIcon from '../../components/MdiIcon.vue';

// Icons
import {
  mdiClipboardList,
  mdiPackageVariant,
  mdiAlert,
  mdiCheckCircle,
  mdiChartLine,
  mdiWrench,
  mdiClockAlert,
  mdiCheckboxMarkedCircle,
  mdiViewDashboard
} from '@mdi/js';

const router = useRouter();
const workOrderStore = useWorkOrderStore();
const itemStore = useItemStore();
const taskStore = useTaskStore();

// Site Manager KPIs computed from stores
const workOrderKPI = computed(() => {
  const completed = workOrderStore.workOrders.filter(wo => wo.status === 'completed').length;
  const uncompleted = workOrderStore.workOrders.filter(wo => wo.status !== 'completed').length;
  const total = completed + uncompleted;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
  
  let status = 'green';
  if (completionRate < 70) status = 'red';
  else if (completionRate < 85) status = 'yellow';
  
  return { completed, uncompleted, completionRate, status };
});

const itemAvailabilityKPI = computed(() => {
  const available = itemStore.items.filter(item => item.stockStatus === 'in-stock').length;
  const total = itemStore.items.length;
  const percentage = total > 0 ? Math.round((available / total) * 100) : 0;
  
  let status = 'green';
  if (percentage < 70) status = 'red';
  else if (percentage < 85) status = 'yellow';
  
  return { available, total, percentage, status };
});

const criticalStockKPI = computed(() => {
  const criticalItems = itemStore.items.filter(item => 
    item.stockStatus === 'out-of-stock' || 
    item.stockStatus === 'low-stock'
  ).length;
  
  let status = 'green';
  let message = 'All items stocked';
  
  if (criticalItems > 10) {
    status = 'red';
    message = 'Immediate attention needed';
  } else if (criticalItems > 5) {
    status = 'yellow';
    message = 'Monitor closely';
  }
  
  return { count: criticalItems, message, status };
});

const taskCompletionKPI = computed(() => {
  const tasks = taskStore.tasks;
  if (tasks.length === 0) return { progress: 0, message: 'No tasks', status: 'green' };
  
  const totalProgress = tasks.reduce((sum, task) => sum + (task.progressPercentage || 0), 0);
  const progress = Math.round(totalProgress / tasks.length);
  
  let status = 'green';
  let message = 'On track';
  
  if (progress < 60) {
    status = 'red';
    message = 'Behind schedule';
  } else if (progress < 80) {
    status = 'yellow';
    message = 'Monitor progress';
  }
  
  return { progress, message, status };
});

// Priority work orders
const priorityWorkOrders = ref([
  {
    id: 'WO-2024-002',
    title: 'Transmission Repair',
    assetName: 'Dump Truck CAT 773G',
    type: 'Corrective',
    priority: 'Critical',
    progress: 90,
    status: 'in-progress'
  },
  {
    id: 'WO-2024-006',
    title: 'Jaw Crusher Maintenance',
    assetName: 'Jaw Crusher JC-001',
    type: 'Preventive',
    priority: 'High',
    progress: 85,
    status: 'in-progress'
  },
  {
    id: 'WO-2024-004',
    title: 'Routine Service and Pump Inspection',
    assetName: 'Water Truck Volvo FMX',
    type: 'Scheduled',
    priority: 'Low',
    progress: 15,
    status: 'scheduled'
  }
]);

// Critical issues
const criticalIssues = ref([
  {
    id: 1,
    title: 'Hydraulic System Leak',
    equipment: 'Excavator EX-005',
    severity: 'Critical',
    reportedAt: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
  },
  {
    id: 2,
    title: 'Brake System Warning',
    equipment: 'Dump Truck DT-012',
    severity: 'High',
    reportedAt: new Date(Date.now() - 4 * 60 * 60 * 1000) // 4 hours ago
  },
  {
    id: 3,
    title: 'Belt Tension Issue',
    equipment: 'Conveyor CB-003',
    severity: 'Medium',
    reportedAt: new Date(Date.now() - 6 * 60 * 60 * 1000) // 6 hours ago
  }
]);

// Recent activity
const recentActivity = ref([
  {
    id: 1,
    type: 'work-order',
    description: 'Work Order WO-2025-001 completed by Maintenance Team A',
    timestamp: new Date(Date.now() - 30 * 60 * 1000) // 30 minutes ago
  },
  {
    id: 2,
    type: 'defect',
    description: 'New defect reported on Crusher CR-008',
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000) // 1 hour ago
  },
  {
    id: 3,
    type: 'task',
    description: 'Hydraulic inspection task started on Excavator EX-001',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
  },
  {
    id: 4,
    type: 'work-order',
    description: 'Work Order WO-2025-004 assigned to Technical Team B',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000) // 3 hours ago
  }
]);

// Methods
const navigateTo = (path) => {
  router.push(path);
};

const getTrafficLightClass = (status) => {
  const classes = {
    green: 'bg-success',
    yellow: 'bg-warning',
    red: 'bg-error'
  };
  return classes[status] || 'bg-gray-400';
};

const getKPIValueClass = (status) => {
  const classes = {
    green: 'text-green-600',
    yellow: 'text-yellow-600', 
    red: 'text-red-600'
  };
  return classes[status] || 'text-gray-800';
};

const getProgressBarClass = (status) => {
  const classes = {
    green: 'bg-gradient-to-r from-success to-success-light',
    yellow: 'bg-gradient-to-r from-warning to-warning-light',
    red: 'bg-gradient-to-r from-error to-error-light'
  };
  return classes[status] || 'bg-gray-400';
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

const getSeverityClass = (severity) => {
  const classes = {
    Critical: 'bg-error-light text-error-color',
    High: 'bg-warning-light text-warning-color',
    Medium: 'bg-info-light text-info-color',
    Low: 'bg-success-light text-success-color'
  };
  return classes[severity] || 'bg-gray-100 text-gray-600';
};

const getActivityIconClass = (type) => {
  const classes = {
    'work-order': 'bg-primary',
    'defect': 'bg-error',
    'task': 'bg-info'
  };
  return classes[type] || 'bg-gray-500';
};

const getActivityIcon = (type) => {
  const icons = {
    'work-order': mdiClipboardList,
    'defect': mdiAlert,
    'task': mdiCheckboxMarkedCircle
  };
  return icons[type] || mdiClipboardList;
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

// Overall status methods for compact KPI header
const getOverallStatusClass = () => {
  const statuses = [
    workOrderKPI.value.status,
    itemAvailabilityKPI.value.status,
    criticalStockKPI.value.status,
    taskCompletionKPI.value.status
  ];
  
  if (statuses.includes('red')) return 'bg-error';
  if (statuses.includes('yellow')) return 'bg-warning';
  return 'bg-success';
};

const getOverallStatusText = () => {
  const redCount = [
    workOrderKPI.value.status,
    itemAvailabilityKPI.value.status,
    criticalStockKPI.value.status,
    taskCompletionKPI.value.status
  ].filter(status => status === 'red').length;
  
  const yellowCount = [
    workOrderKPI.value.status,
    itemAvailabilityKPI.value.status,
    criticalStockKPI.value.status,
    taskCompletionKPI.value.status
  ].filter(status => status === 'yellow').length;
  
  if (redCount > 0) return 'Critical';
  if (yellowCount > 0) return 'Warning'; 
  return 'Good';
};

onMounted(() => {
  // Load site manager data
  workOrderStore.fetchWorkOrders();
  itemStore.fetchItems();
  taskStore.fetchTasks();
});
</script>
