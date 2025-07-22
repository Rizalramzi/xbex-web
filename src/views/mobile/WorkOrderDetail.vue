<template>
  <MobileLayout>
    <div class="p-6">
      <!-- Header with Back Button -->
      <div class="flex items-center mb-6">
        <button 
          @click="goBack" 
          class="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3 hover:bg-gray-200 transition-colors"
        >
          <MdiIcon :path="mdiArrowLeft" :size="18" class="text-gray-600" />
        </button>
        <div>
          <h1 class="text-xl font-bold text-primary">Work Order Details</h1>
          <p class="text-sm text-muted">{{ workOrder?.id || 'Loading...' }}</p>
        </div>
      </div>

      <!-- Tab Navigation -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6">
        <div class="grid grid-cols-6 gap-1">
        <button 
            v-for="tab in tabs" 
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
            'flex flex-col items-center p-3 rounded-lg transition-all duration-200',
            activeTab === tab.id 
                ? 'bg-primary text-white shadow-sm' 
                : 'text-gray-600 hover:bg-gray-50'
            ]"
        >
            <MdiIcon :path="tab.icon" :size="20" class="mb-1" />
            <span class="text-xs font-medium">{{ tab.label }}</span>
        </button>
        </div>
    </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>

      <!-- Work Order Not Found -->
      <div v-else-if="!workOrder" class="text-center py-20">
        <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <MdiIcon :path="mdiAlertCircle" :size="32" class="text-gray-400" />
        </div>
        <h3 class="text-lg font-semibold text-gray-600 mb-2">Work Order Not Found</h3>
        <p class="text-gray-500 mb-4">The requested work order could not be found.</p>
        <button 
          @click="goBack"
          class="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          Go Back
        </button>
      </div>

      <!-- Work Order Details -->
      <div v-else class="space-y-6">
        <!-- Tab Content -->
        <div class="space-y-6">
          <!-- Info Tab -->
          <div v-if="activeTab === 'info'" class="flex flex-col gap-4">
            <!-- Status and Priority Header -->
            <div class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div class="flex items-center justify-between mb-3">
                <h2 class="text-lg font-bold text-primary">{{ workOrder.title }}</h2>
                <span :class="getPriorityClass(workOrder.priority)" class="px-3 py-1 text-xs font-medium rounded-full">
                  {{ workOrder.priority }}
                </span>
              </div>
              <div class="flex items-center justify-between mb-4">
                <span :class="getStatusClass(workOrder.status)" class="px-3 py-1 text-sm font-medium rounded-full">
                  {{ formatStatus(workOrder.status) }}
                </span>
                <span class="text-sm text-muted">{{ workOrder.type.toUpperCase() }}</span>
              </div>
              
              <!-- Progress Bar -->
              <div class="mb-3">
                <div class="flex items-center justify-between text-sm mb-1">
                  <span class="font-medium text-gray-700">Progress</span>
                  <span class="font-bold text-primary">{{ workOrder.progress || 0 }}%</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    :class="getProgressBarClass(workOrder.status)"
                    class="h-2 rounded-full transition-all duration-500"
                    :style="{ width: (workOrder.progress || 0) + '%' }"
                  ></div>
                </div>
              </div>
            </div>

            <!-- Asset Information -->
            <div class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h3 class="text-lg font-semibold text-primary mb-3 flex items-center">
            <MdiIcon :path="mdiCog" :size="20" class="text-primary mr-2" />
            Asset Information
          </h3>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-xs font-medium text-gray-500 uppercase tracking-wide">Asset Name</label>
              <p class="text-sm font-medium text-gray-900">{{ workOrder.assetName }}</p>
            </div>
            <div>
              <label class="text-xs font-medium text-gray-500 uppercase tracking-wide">Asset ID</label>
              <p class="text-sm font-medium text-gray-900">{{ workOrder.assetId }}</p>
            </div>
            <div>
              <label class="text-xs font-medium text-gray-500 uppercase tracking-wide">Location</label>
              <p class="text-sm font-medium text-gray-900">{{ workOrder.location }}</p>
            </div>
            <div>
              <label class="text-xs font-medium text-gray-500 uppercase tracking-wide">Category</label>
              <p class="text-sm font-medium text-gray-900">{{ workOrder.workCategory }}</p>
            </div>
          </div>
        </div>

            <!-- Work Order Details -->
            <div class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <h3 class="text-lg font-semibold text-primary mb-3 flex items-center">
                <MdiIcon :path="mdiClipboardText" :size="20" class="text-primary mr-2" />
                Work Details
              </h3>
              <div class="space-y-4">
                <div>
                  <label class="text-xs font-medium text-gray-500 uppercase tracking-wide">Description</label>
                  <p class="text-sm text-gray-900 mt-1 leading-relaxed">{{ workOrder.description }}</p>
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="text-xs font-medium text-gray-500 uppercase tracking-wide">Maintenance Type</label>
                    <p class="text-sm font-medium text-gray-900">{{ workOrder.maintenanceType }}</p>
                  </div>
                  <div>
                    <label class="text-xs font-medium text-gray-500 uppercase tracking-wide">Work Category</label>
                    <p class="text-sm font-medium text-gray-900">{{ workOrder.workCategory }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Schedule & Timeline -->
            <div class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <h3 class="text-lg font-semibold text-primary mb-3 flex items-center">
                <MdiIcon :path="mdiCalendarClock" :size="20" class="text-primary mr-2" />
                Schedule & Timeline
              </h3>
              <div class="space-y-4">
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="text-xs font-medium text-gray-500 uppercase tracking-wide">Created Date</label>
                    <p class="text-sm font-medium text-gray-900">{{ formatDate(workOrder.createdDate) }}</p>
                  </div>
                  <div v-if="workOrder.scheduledStartDate">
                    <label class="text-xs font-medium text-gray-500 uppercase tracking-wide">Scheduled Start</label>
                    <p class="text-sm font-medium text-gray-900">{{ formatDate(workOrder.scheduledStartDate) }}</p>
                  </div>
                </div>
                <div class="grid grid-cols-2 gap-4" v-if="workOrder.scheduledEndDate || workOrder.actualStartDate">
                  <div v-if="workOrder.scheduledEndDate">
                    <label class="text-xs font-medium text-gray-500 uppercase tracking-wide">Scheduled End</label>
                    <p class="text-sm font-medium text-gray-900">{{ formatDate(workOrder.scheduledEndDate) }}</p>
                  </div>
                  <div v-if="workOrder.actualStartDate">
                    <label class="text-xs font-medium text-gray-500 uppercase tracking-wide">Actual Start</label>
                    <p class="text-sm font-medium text-gray-900">{{ formatDate(workOrder.actualStartDate) }}</p>
                  </div>
                </div>
                <div v-if="workOrder.actualEndDate">
                  <div>
                    <label class="text-xs font-medium text-gray-500 uppercase tracking-wide">Actual End</label>
                    <p class="text-sm font-medium text-gray-900">{{ formatDate(workOrder.actualEndDate) }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Team Tab -->
          <div v-if="activeTab === 'team'" class="flex flex-col gap-4">
            <!-- Team and Assignment -->
            <div class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <h3 class="text-lg font-semibold text-primary mb-3 flex items-center">
                <MdiIcon :path="mdiAccountGroup" :size="20" class="text-primary mr-2" />
                Assignment
              </h3>
              <div class="grid grid-cols-1 gap-4">
                <div>
                  <label class="text-xs font-medium text-gray-500 uppercase tracking-wide">Assigned To</label>
                  <p class="text-sm font-medium text-gray-900">{{ workOrder.assignedTo }}</p>
                </div>
                <div>
                  <label class="text-xs font-medium text-gray-500 uppercase tracking-wide">Requested By</label>
                  <p class="text-sm font-medium text-gray-900">{{ workOrder.requestedBy }}</p>
                </div>
              </div>
            </div>

            <!-- Team Members -->
            <div class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <h3 class="text-lg font-semibold text-primary mb-3 flex items-center">
                <MdiIcon :path="mdiAccountMultiple" :size="20" class="text-primary mr-2" />
                Team Members
              </h3>
              <div class="space-y-3">
                <div v-for="member in teamMembers" :key="member.id" class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div class="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                    <span class="text-white font-medium text-sm">{{ member.initials }}</span>
                  </div>
                  <div class="flex-1">
                    <p class="text-sm font-medium text-gray-900">{{ member.name }}</p>
                    <p class="text-xs text-gray-500">{{ member.role }}</p>
                  </div>
                  <span :class="member.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'" class="px-2 py-1 text-xs font-medium rounded">
                    {{ member.status }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Task Tab -->
          <div v-if="activeTab === 'task'">
            <!-- Work Order Tasks -->
            <div class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <h3 class="text-lg font-semibold text-primary mb-3 flex items-center">
                <MdiIcon :path="mdiFormatListChecks" :size="20" class="text-primary mr-2" />
                Related Tasks
              </h3>
              <div class="space-y-3">
                <div 
                  v-for="task in relatedTasks" 
                  :key="task.id" 
                  @click="navigateToTask(task.id)"
                  class="border border-gray-200 rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-sm font-medium text-gray-900">{{ task.title }}</span>
                    <span :class="getTaskStatusClass(task.status)" class="px-2 py-1 text-xs font-medium rounded">
                      {{ task.status }}
                    </span>
                  </div>
                  <div class="flex items-center justify-between text-xs mb-2">
                    <span class="text-gray-500">Assigned to: {{ task.assignedTo }}</span>
                    <span class="text-gray-500">Priority: {{ task.priority }}</span>
                  </div>
                  <div class="flex items-center justify-between text-xs mb-1">
                    <span class="text-gray-500">Progress</span>
                    <span class="text-primary font-medium">{{ task.progress }}%</span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-1">
                    <div 
                      class="bg-blue-500 h-1 rounded-full transition-all duration-300"
                      :style="{ width: task.progress + '%' }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Material Tab -->
          <div v-if="activeTab === 'material'">
            <!-- Required Materials -->
            <div class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <h3 class="text-lg font-semibold text-primary mb-3 flex items-center">
                <MdiIcon :path="mdiPackageVariant" :size="20" class="text-primary mr-2" />
                Required Materials
              </h3>
              <div class="space-y-3">
                <div v-for="material in requiredMaterials" :key="material.id" class="border border-gray-200 rounded-lg p-3">
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-sm font-medium text-gray-900">{{ material.name }}</span>
                    <span :class="getMaterialStatusClass(material.status)" class="px-2 py-1 text-xs font-medium rounded">
                      {{ material.status }}
                    </span>
                  </div>
                  <div class="grid grid-cols-3 gap-2 text-xs text-gray-500">
                    <div>
                      <span class="block">Qty Required</span>
                      <span class="font-medium text-gray-900">{{ material.qtyRequired }}</span>
                    </div>
                    <div>
                      <span class="block">Available</span>
                      <span class="font-medium text-gray-900">{{ material.qtyAvailable }}</span>
                    </div>
                    <div>
                      <span class="block">Unit</span>
                      <span class="font-medium text-gray-900">{{ material.unit }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Defect Tab -->
          <div v-if="activeTab === 'defect'">
            <!-- Related Defects -->
            <div class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <h3 class="text-lg font-semibold text-primary mb-3 flex items-center">
                <MdiIcon :path="mdiAlert" :size="20" class="text-primary mr-2" />
                Related Defects
              </h3>
              <div class="space-y-3">
                <div v-for="defect in relatedDefects" :key="defect.id" class="border border-gray-200 rounded-lg p-3">
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-sm font-medium text-gray-900">{{ defect.title }}</span>
                    <span :class="getDefectSeverityClass(defect.severity)" class="px-2 py-1 text-xs font-medium rounded">
                      {{ defect.severity }}
                    </span>
                  </div>
                  <p class="text-xs text-gray-600 mb-2">{{ defect.description }}</p>
                  <div class="flex items-center justify-between text-xs text-gray-500">
                    <span>Reported: {{ formatDate(defect.reportedDate) }}</span>
                    <span :class="defect.resolved ? 'text-green-600' : 'text-red-600'" class="font-medium">
                      {{ defect.resolved ? 'Resolved' : 'Open' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Sync Tab -->
          <div v-if="activeTab === 'sync'">
            <!-- Sync Status -->
            <div class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <h3 class="text-lg font-semibold text-primary mb-3 flex items-center">
                <MdiIcon :path="mdiSync" :size="20" class="text-primary mr-2" />
                Sync Status
              </h3>
              <div class="space-y-4">
                <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div class="flex items-center space-x-3">
                    <MdiIcon :path="mdiCloudUpload" :size="20" class="text-blue-500" />
                    <div>
                      <p class="text-sm font-medium text-gray-900">Last Sync</p>
                      <p class="text-xs text-gray-500">{{ formatDate(lastSyncDate) }}</p>
                    </div>
                  </div>
                  <span class="bg-green-100 text-green-800 px-2 py-1 text-xs font-medium rounded">Synced</span>
                </div>
                
                <div class="space-y-2">
                  <div v-for="syncItem in syncItems" :key="syncItem.type" class="flex items-center justify-between p-2 border border-gray-200 rounded">
                    <span class="text-sm text-gray-700">{{ syncItem.label }}</span>
                    <span :class="syncItem.synced ? 'text-green-600' : 'text-yellow-600'" class="text-xs font-medium">
                      {{ syncItem.synced ? 'Synced' : 'Pending' }}
                    </span>
                  </div>
                </div>

                <button 
                  @click="syncWorkOrder"
                  class="w-full bg-blue-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center justify-center"
                >
                  <MdiIcon :path="mdiSync" :size="18" class="mr-2" />
                  Sync Now
                </button>
              </div>
            </div>          
        </div>
        </div>

        
      </div>
    </div>
  </MobileLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useWorkOrderStore } from '../../stores/workOrderStore';
import MobileLayout from '../../components/MobileLayout.vue';
import MdiIcon from '../../components/MdiIcon.vue';

// Icons
import {
  mdiArrowLeft,
  mdiCog,
  mdiClipboardText,
  mdiAccountGroup,
  mdiAccountMultiple,
  mdiCalendarClock,
  mdiCurrencyUsd,
  mdiPencil,
  mdiFormatListChecks,
  mdiAlertCircle,
  mdiInformationOutline,
  mdiClipboardCheck,
  mdiPackageVariant,
  mdiAlert,
  mdiSync,
  mdiCloudUpload
} from '@mdi/js';

const route = useRoute();
const router = useRouter();
const workOrderStore = useWorkOrderStore();

const loading = ref(true);
const activeTab = ref('info');
const workOrderId = computed(() => route.params.id);

// Tab configuration
const tabs = ref([
  { id: 'info', label: 'Info', icon: mdiInformationOutline },
  { id: 'team', label: 'Team', icon: mdiAccountGroup },
  { id: 'task', label: 'Task', icon: mdiClipboardCheck },
  { id: 'material', label: 'Material', icon: mdiPackageVariant },
  { id: 'defect', label: 'Defect', icon: mdiAlert },
  { id: 'sync', label: 'Sync', icon: mdiSync }
]);

// Mock data for tabs
const teamMembers = ref([
  { id: 1, name: 'John Smith', role: 'Lead Technician', initials: 'JS', status: 'available' },
  { id: 2, name: 'Maria Garcia', role: 'Mechanic', initials: 'MG', status: 'busy' },
  { id: 3, name: 'David Chen', role: 'Electrician', initials: 'DC', status: 'available' },
  { id: 4, name: 'Sarah Johnson', role: 'Inspector', initials: 'SJ', status: 'available' }
]);

const relatedTasks = ref([
  { id: 'TSK-001', title: 'Engine Oil Change', status: 'completed', assignedTo: 'John Smith', priority: 'High', progress: 100 },
  { id: 'TSK-002', title: 'Hydraulic System Check', status: 'in-progress', assignedTo: 'Maria Garcia', priority: 'Medium', progress: 75 },
  { id: 'TSK-003', title: 'Track Inspection', status: 'pending', assignedTo: 'David Chen', priority: 'Low', progress: 0 },
  { id: 'TSK-004', title: 'Electrical Diagnostics', status: 'in-progress', assignedTo: 'Sarah Johnson', priority: 'High', progress: 45 }
]);

const requiredMaterials = ref([
  { id: 1, name: 'Engine Oil 15W-40', qtyRequired: 20, qtyAvailable: 25, unit: 'Liters', status: 'available' },
  { id: 2, name: 'Hydraulic Fluid', qtyRequired: 50, qtyAvailable: 30, unit: 'Liters', status: 'shortage' },
  { id: 3, name: 'Air Filter', qtyRequired: 2, qtyAvailable: 5, unit: 'Pieces', status: 'available' },
  { id: 4, name: 'Spark Plugs', qtyRequired: 6, qtyAvailable: 0, unit: 'Pieces', status: 'out-of-stock' }
]);

const relatedDefects = ref([
  { 
    id: 1, 
    title: 'Hydraulic Leak', 
    description: 'Minor hydraulic fluid leak detected near main cylinder', 
    severity: 'Medium', 
    reportedDate: '2024-06-25T10:30:00Z',
    resolved: false 
  },
  { 
    id: 2, 
    title: 'Engine Noise', 
    description: 'Unusual engine noise during startup', 
    severity: 'Low', 
    reportedDate: '2024-06-20T08:15:00Z',
    resolved: true 
  }
]);

const lastSyncDate = ref('2024-06-27T09:15:00Z');
const syncItems = ref([
  { type: 'work-order', label: 'Work Order Data', synced: true },
  { type: 'tasks', label: 'Task Updates', synced: true },
  { type: 'materials', label: 'Material Status', synced: false },
  { type: 'defects', label: 'Defect Reports', synced: true },
  { type: 'team', label: 'Team Assignments', synced: false }
]);

// Get work order from store
const workOrder = computed(() => {
  return workOrderStore.workOrders.find(wo => wo.id === workOrderId.value);
});

// Methods
const goBack = () => {
  router.go(-1);
};

const syncWorkOrder = () => {
  // Mock sync functionality
  syncItems.value.forEach(item => {
    item.synced = true;
  });
  lastSyncDate.value = new Date().toISOString();
};

const editWorkOrder = () => {
  router.push(`/work-order`);
};

const viewTasks = () => {
  router.push(`/mobile/task-management`);
};

const navigateToTask = (taskId) => {
  router.push(`/mobile/work-order/${workOrderId.value}/task/${taskId}`);
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const formatCurrency = (amount) => {
  return amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const formatStatus = (status) => {
  return status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
};

const getPriorityClass = (priority) => {
  const classes = {
    Critical: 'bg-red-100 text-red-800',
    High: 'bg-orange-100 text-orange-800',
    Medium: 'bg-yellow-100 text-yellow-800',
    Low: 'bg-green-100 text-green-800'
  };
  return classes[priority] || 'bg-gray-100 text-gray-800';
};

const getStatusClass = (status) => {
  const classes = {
    'scheduled': 'bg-blue-100 text-blue-800',
    'in-progress': 'bg-orange-100 text-orange-800',
    'completed': 'bg-green-100 text-green-800',
    'pending': 'bg-yellow-100 text-yellow-800',
    'on-hold': 'bg-gray-100 text-gray-800',
    'cancelled': 'bg-red-100 text-red-800'
  };
  return classes[status] || 'bg-gray-100 text-gray-800';
};

const getProgressBarClass = (status) => {
  const classes = {
    'scheduled': 'bg-gradient-to-r from-blue-500 to-blue-400',
    'in-progress': 'bg-gradient-to-r from-orange-500 to-orange-400',
    'completed': 'bg-gradient-to-r from-green-500 to-green-400',
    'pending': 'bg-gradient-to-r from-yellow-500 to-yellow-400',
    'on-hold': 'bg-gradient-to-r from-gray-500 to-gray-400',
    'cancelled': 'bg-gradient-to-r from-red-500 to-red-400'
  };
  return classes[status] || 'bg-gray-400';
};

const getTaskStatusClass = (status) => {
  const classes = {
    'completed': 'bg-green-100 text-green-800',
    'in-progress': 'bg-blue-100 text-blue-800',
    'pending': 'bg-yellow-100 text-yellow-800',
    'cancelled': 'bg-red-100 text-red-800'
  };
  return classes[status] || 'bg-gray-100 text-gray-800';
};

const getMaterialStatusClass = (status) => {
  const classes = {
    'available': 'bg-green-100 text-green-800',
    'shortage': 'bg-yellow-100 text-yellow-800',
    'out-of-stock': 'bg-red-100 text-red-800'
  };
  return classes[status] || 'bg-gray-100 text-gray-800';
};

const getDefectSeverityClass = (severity) => {
  const classes = {
    'Critical': 'bg-red-100 text-red-800',
    'High': 'bg-orange-100 text-orange-800',
    'Medium': 'bg-yellow-100 text-yellow-800',
    'Low': 'bg-green-100 text-green-800'
  };
  return classes[severity] || 'bg-gray-100 text-gray-800';
};

onMounted(async () => {
  loading.value = true;
  await workOrderStore.fetchWorkOrders();
  loading.value = false;
});
</script>
