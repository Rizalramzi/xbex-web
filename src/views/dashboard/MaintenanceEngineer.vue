<template>
  <div class="space-y-6">
    <!-- Maintenance Engineer KPIs -->
    <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-6">
      <!-- Today's Tasks KPI -->
      <div class="card-dark p-6 relative overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer border border-transparent hover:border-primary/20">
        <div class="flex items-center justify-between">
          <div class="flex-1">
            <div class="flex items-center space-x-3 mb-3">
              <div :class="getTrafficLightClass(todaysTasksKPI.status)" class="w-3 h-3 rounded-full"></div>
              <h3 class="text-sm font-medium text-muted uppercase tracking-wide">Today's Tasks</h3>
            </div>
            <div class="flex items-baseline space-x-3 mb-2">
              <span class="text-3xl font-semibold text-success-color">{{ todaysTasksKPI.completed }}</span>
              <span class="text-lg text-muted">/</span>
              <span class="text-3xl font-bold text-primary">{{ todaysTasksKPI.total }}</span>
            </div>
            <p class="text-xs text-muted">{{ todaysTasksKPI.completionRate }}% completion rate</p>
          </div>
          <div class="w-14 h-14 bg-primary-light rounded-xl flex items-center justify-center">
            <MdiIcon :path="mdiClipboardCheck" :size="28" class="text-primary-color" />
          </div>
        </div>
        <div class="absolute bottom-0 left-0 right-0 h-2 bg-light rounded-full">
          <div 
            :class="getProgressBarClass(todaysTasksKPI.status)"
            class="h-2 rounded-full transition-all duration-500 ease-out"
            :style="{ width: Math.max(todaysTasksKPI.completionRate, 5) + '%', minWidth: '10px' }"
          ></div>
        </div>
      </div>

      <!-- Items Ready KPI -->
      <div class="card-dark p-6 relative overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer border border-transparent hover:border-primary/20">
        <div class="flex items-center justify-between">
          <div class="flex-1">
            <div class="flex items-center space-x-3 mb-3">
              <div :class="getTrafficLightClass(itemsReadyKPI.status)" class="w-3 h-3 rounded-full"></div>
              <h3 class="text-sm font-medium text-muted uppercase tracking-wide">Items Ready</h3>
            </div>
            <div class="flex items-baseline space-x-2 mb-2">
              <span class="text-3xl font-bold text-primary">{{ itemsReadyKPI.percentage }}%</span>
            </div>
            <p class="text-xs text-muted">{{ itemsReadyKPI.ready }}/{{ itemsReadyKPI.total }} items available</p>
          </div>
          <div class="w-14 h-14 bg-success-light rounded-xl flex items-center justify-center">
            <MdiIcon :path="mdiPackageCheck" :size="28" class="text-success-color" />
          </div>
        </div>
        <div class="absolute bottom-0 left-0 right-0 h-2 bg-light rounded-full">
          <div 
            :class="getProgressBarClass(itemsReadyKPI.status)"
            class="h-2 rounded-full transition-all duration-500 ease-out"
            :style="{ width: Math.max(itemsReadyKPI.percentage, 5) + '%', minWidth: '10px' }"
          ></div>
        </div>
      </div>

      <!-- Blocked Tasks KPI -->
      <div class="card-dark p-6 relative overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer border border-transparent hover:border-primary/20">
        <div class="flex items-center justify-between">
          <div class="flex-1">
            <div class="flex items-center space-x-3 mb-3">
              <div :class="getTrafficLightClass(blockedTasksKPI.status)" class="w-3 h-3 rounded-full"></div>
              <h3 class="text-sm font-medium text-muted uppercase tracking-wide">Blocked Tasks</h3>
            </div>
            <div class="flex items-baseline space-x-2 mb-2">
              <span class="text-3xl font-bold text-primary">{{ blockedTasksKPI.count }}</span>
              <span class="text-sm text-muted">tasks</span>
            </div>
            <p class="text-xs text-muted">{{ blockedTasksKPI.message }}</p>
          </div>
          <div class="w-14 h-14 bg-warning-light rounded-xl flex items-center justify-center">
            <MdiIcon :path="mdiLock" :size="28" class="text-warning-color" />
          </div>
        </div>
        <div class="absolute bottom-0 left-0 right-0 h-2 bg-light rounded-full">
          <div 
            :class="getProgressBarClass(blockedTasksKPI.status)"
            class="h-2 rounded-full transition-all duration-500 ease-out"
            :style="{ width: '100%' }"
          ></div>
        </div>
      </div>

      <!-- Efficiency Rating KPI -->
      <div class="card-dark p-6 relative overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer border border-transparent hover:border-primary/20">
        <div class="flex items-center justify-between">
          <div class="flex-1">
            <div class="flex items-center space-x-3 mb-3">
              <div :class="getTrafficLightClass(efficiencyKPI.status)" class="w-3 h-3 rounded-full"></div>
              <h3 class="text-sm font-medium text-muted uppercase tracking-wide">Efficiency</h3>
            </div>
            <div class="flex items-baseline space-x-2 mb-2">
              <span class="text-3xl font-bold text-primary">{{ efficiencyKPI.rating }}%</span>
            </div>
            <p class="text-xs text-muted">{{ efficiencyKPI.message }}</p>
          </div>
          <div class="w-14 h-14 bg-info-light rounded-xl flex items-center justify-center">
            <MdiIcon :path="mdiSpeedometer" :size="28" class="text-info-color" />
          </div>
        </div>
        <div class="absolute bottom-0 left-0 right-0 h-2 bg-light rounded-full">
          <div 
            :class="getProgressBarClass(efficiencyKPI.status)"
            class="h-2 rounded-full transition-all duration-500 ease-out"
            :style="{ width: Math.max(efficiencyKPI.rating, 5) + '%', minWidth: '10px' }"
          ></div>
        </div>
      </div>
    </div>

    <!-- My Tasks for Today Section -->
    <div class="mb-6">
      <div class="card-dark">
        <div class="px-6 py-4 border-b border-light">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-semibold text-primary">My Tasks for Today</h3>
              <p class="text-sm text-muted mt-1">Tasks assigned to me for {{ formatDate(new Date()) }}</p>
            </div>
            <div class="flex items-center space-x-2">
              <span class="text-sm text-muted">Filter:</span>
              <select v-model="taskFilter" class="bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary shadow-sm">
                <option value="all">All Tasks</option>
                <option value="ready">Ready to Start</option>
                <option value="blocked">Blocked</option>
                <option value="in-progress">In Progress</option>
              </select>
            </div>
          </div>
        </div>
        <div class="p-6">
          <div v-if="filteredTodaysTasks.length === 0" class="text-center py-8">
            <MdiIcon :path="mdiCheckCircle" :size="32" class="text-success-color mx-auto mb-2" />
            <p class="text-muted">No tasks for today</p>
          </div>
          <div v-else class="space-y-4">
            <div v-for="task in filteredTodaysTasks" :key="task.id" class="bg-secondary-light rounded-lg p-4 border-l-4" :class="getTaskBorderClass(task.status)">
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <div class="flex items-center space-x-3 mb-2">
                    <div class="w-10 h-10 bg-primary-light rounded-lg flex items-center justify-center">
                      <MdiIcon :path="getAssetIcon(task.assetType)" :size="20" class="text-primary-color" />
                    </div>
                    <div class="flex-1">
                      <h4 class="text-sm font-semibold text-primary">{{ task.title }}</h4>
                      <p class="text-xs text-muted">{{ task.workOrderTitle }} • {{ task.assetName }}</p>
                      <div class="flex items-center space-x-4 mt-1">
                        <span :class="getTaskStatusClass(task.status)" class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium">
                          {{ task.status }}
                        </span>
                        <span :class="getPriorityClass(task.priority)" class="text-xs font-medium">
                          {{ task.priority }} Priority
                        </span>
                        <span class="text-xs text-muted">{{ task.estimatedDuration }}h</span>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Task Progress -->
                  <div class="mb-3">
                    <div class="flex items-center justify-between mb-1">
                      <span class="text-xs text-muted">Progress</span>
                      <span class="text-xs font-medium text-primary">{{ task.progress }}%</span>
                    </div>
                    <div class="w-full bg-light rounded-full h-2">
                      <div 
                        :class="getProgressBarClass(task.progressStatus)"
                        class="h-2 rounded-full transition-all duration-300"
                        :style="{ width: task.progress + '%' }"
                      ></div>
                    </div>
                  </div>

                  <!-- Required Items -->
                  <div class="mb-3">
                    <h5 class="text-xs font-medium text-primary mb-2">Required Items:</h5>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div v-for="item in task.requiredItems" :key="item.id" class="flex items-center justify-between p-2 bg-dark rounded">
                        <div class="flex items-center space-x-2">
                          <span :class="getItemStatusDot(item.status)" class="w-2 h-2 rounded-full"></span>
                          <span class="text-xs text-primary">{{ item.name }}</span>
                        </div>
                        <div class="flex items-center space-x-1">
                          <span class="text-xs text-muted">{{ item.needed }}</span>
                          <span :class="getItemStatusClass(item.status)" class="text-xs font-medium">
                            {{ item.status }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Action Buttons -->
                  <div class="flex items-center space-x-2">
                    <button v-if="task.status === 'Not Started'" :disabled="!canStartTask(task)" 
                            :class="canStartTask(task) ? 'btn-primary' : 'btn-disabled'" class="text-xs px-3 py-1">
                      <MdiIcon :path="mdiPlay" :size="14" class="mr-1" />
                      Start Task
                    </button>
                    <button v-if="task.status === 'In Progress'" class="btn-success text-xs px-3 py-1">
                      <MdiIcon :path="mdiCheck" :size="14" class="mr-1" />
                      Complete
                    </button>
                    <button v-if="task.status === 'Blocked'" class="btn-warning text-xs px-3 py-1">
                      <MdiIcon :path="mdiAlertCircle" :size="14" class="mr-1" />
                      Request Items
                    </button>
                    <button class="btn-secondary text-xs px-3 py-1">
                      <MdiIcon :path="mdiInformation" :size="14" class="mr-1" />
                      Details
                    </button>
                  </div>
                </div>

                <!-- Time Info -->
                <div class="text-right ml-4">
                  <p class="text-xs text-muted">Scheduled</p>
                  <p class="text-sm font-medium text-primary">{{ formatTime(task.scheduledTime) }}</p>
                  <p class="text-xs text-muted mt-1">Duration: {{ task.estimatedDuration }}h</p>
                  <div v-if="task.status === 'In Progress'" class="mt-2">
                    <p class="text-xs text-info-color">Started {{ getElapsedTime(task.startTime) }} ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Additional Engineer Widgets -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <!-- Missing Items Alert Widget -->
      <div class="card-dark">
        <div class="px-6 py-4 border-b border-light">
          <div class="flex items-center space-x-2">
            <MdiIcon :path="mdiAlertCircle" :size="20" class="text-error-color" />
            <h3 class="text-lg font-semibold text-primary">Missing Items Alert</h3>
          </div>
          <p class="text-sm text-muted mt-1">Items needed but not available</p>
        </div>
        <div class="p-6">
          <div class="space-y-3">
            <div v-for="item in missingItems" :key="item.id" class="flex items-center justify-between p-3 bg-secondary-light rounded-lg">
              <div class="flex-1">
                <h4 class="text-sm font-medium text-primary">{{ item.itemName }}</h4>
                <p class="text-xs text-muted">Needed for: {{ item.taskTitle }}</p>
                <p class="text-xs text-error-color">Required: {{ item.neededQuantity }} • Available: {{ item.availableQuantity }}</p>
              </div>
              <div class="flex items-center space-x-2">
                <span class="w-2 h-2 bg-error rounded-full animate-pulse"></span>
                <button class="btn-warning text-xs px-2 py-1">Request</button>
              </div>
            </div>
            <div v-if="missingItems.length === 0" class="text-center py-4">
              <MdiIcon :path="mdiCheckCircle" :size="32" class="text-success-color mx-auto mb-2" />
              <p class="text-sm text-muted">All required items available</p>
            </div>
          </div>
        </div>
      </div>

      <!-- My Work Orders Widget -->
      <div class="card-dark">
        <div class="px-6 py-4 border-b border-light">
          <div class="flex items-center space-x-2">
            <MdiIcon :path="mdiClipboardList" :size="20" class="text-info-color" />
            <h3 class="text-lg font-semibold text-primary">My Active Work Orders</h3>
          </div>
          <p class="text-sm text-muted mt-1">Work orders assigned to me</p>
        </div>
        <div class="p-6">
          <div class="space-y-3">
            <div v-for="wo in myWorkOrders" :key="wo.id" class="flex items-center justify-between p-3 bg-secondary-light rounded-lg">
              <div class="flex-1">
                <h4 class="text-sm font-medium text-primary">{{ wo.title }}</h4>
                <p class="text-xs text-muted">{{ wo.assetName }} • {{ wo.type }}</p>
                <div class="flex items-center space-x-2 mt-1">
                  <div class="w-full bg-light rounded-full h-1">
                    <div 
                      :class="getProgressBarClass(wo.status)"
                      class="h-1 rounded-full"
                      :style="{ width: wo.progress + '%' }"
                    ></div>
                  </div>
                  <span class="text-xs text-muted whitespace-nowrap">{{ wo.progress }}%</span>
                </div>
              </div>
              <div class="text-right ml-4">
                <span :class="getPriorityClass(wo.priority)" class="text-xs font-medium">{{ wo.priority }}</span>
                <p class="text-xs text-muted">{{ wo.tasksCompleted }}/{{ wo.totalTasks }} tasks</p>
              </div>
            </div>
            <div v-if="myWorkOrders.length === 0" class="text-center py-4">
              <MdiIcon :path="mdiInformation" :size="32" class="text-info-color mx-auto mb-2" />
              <p class="text-sm text-muted">No active work orders</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import MdiIcon from '../../components/MdiIcon.vue'
import { useTaskStore } from '../../stores/taskStore'
import { useWorkOrderStore } from '../../stores/workOrderStore'
import { useAssetStore } from '../../stores/assetStore'

// Import MDI icons
import { 
  mdiClipboardCheck,
  mdiPackageCheck,
  mdiLock,
  mdiSpeedometer,
  mdiCheckCircle,
  mdiPlay,
  mdiCheck,
  mdiAlertCircle,
  mdiInformation,
  mdiClipboardList,
  mdiExcavator,
  mdiTruck,
  mdiFactory,
  mdiCog,
  mdiCrane
} from '@mdi/js'

// Store instances
const taskStore = useTaskStore()
const workOrderStore = useWorkOrderStore()
const assetStore = useAssetStore()

// Task filter
const taskFilter = ref('all')

// Current engineer (mock data - in real app this would come from auth)
const currentEngineer = ref({
  id: 'ENG-001',
  name: 'Ahmad Suryanto',
  specialization: 'Heavy Equipment'
})

// Today's tasks for the current engineer
const todaysTasks = computed(() => {
  // Mock data representing tasks assigned to current engineer for today
  return [
    {
      id: 'TASK-001',
      title: 'Replace Hydraulic Pump',
      workOrderTitle: 'WO-2024-001 - Excavator Maintenance',
      assetName: 'Excavator CAT 336',
      assetType: 'excavator',
      status: 'Not Started',
      priority: 'Critical',
      progress: 0,
      progressStatus: 'red',
      estimatedDuration: 4,
      scheduledTime: '08:00',
      startTime: null,
      requiredItems: [
        { id: 'ITEM-001', name: 'Hydraulic Pump Assembly', needed: '1 pcs', status: 'Not Available' },
        { id: 'ITEM-002', name: 'Hydraulic Oil', needed: '20L', status: 'Available' },
        { id: 'ITEM-003', name: 'Gasket Set', needed: '1 set', status: 'Available' }
      ]
    },
    {
      id: 'TASK-002',
      title: 'Engine Oil Change',
      workOrderTitle: 'WO-2024-005 - Truck Preventive Maintenance',
      assetName: 'Dump Truck DT-45',
      assetType: 'truck',
      status: 'In Progress',
      priority: 'Medium',
      progress: 65,
      progressStatus: 'yellow',
      estimatedDuration: 2,
      scheduledTime: '10:00',
      startTime: '2024-06-27T10:15:00Z',
      requiredItems: [
        { id: 'ITEM-004', name: 'Engine Oil SAE 15W-40', needed: '25L', status: 'Available' },
        { id: 'ITEM-005', name: 'Oil Filter', needed: '2 pcs', status: 'Available' }
      ]
    },
    {
      id: 'TASK-003',
      title: 'Track Chain Replacement',
      workOrderTitle: 'WO-2024-003 - Excavator Track Repair',
      assetName: 'Excavator CAT 320',
      assetType: 'excavator',
      status: 'Blocked',
      priority: 'High',
      progress: 25,
      progressStatus: 'red',
      estimatedDuration: 6,
      scheduledTime: '13:00',
      startTime: '2024-06-27T13:00:00Z',
      requiredItems: [
        { id: 'ITEM-006', name: 'Track Chain Links', needed: '12 sets', status: 'Partially Available' },
        { id: 'ITEM-007', name: 'Track Bolts', needed: '48 pcs', status: 'Not Available' }
      ]
    },
    {
      id: 'TASK-004',
      title: 'Air Filter Replacement',
      workOrderTitle: 'WO-2024-007 - Generator Maintenance',
      assetName: 'Generator GEN-002',
      assetType: 'factory',
      status: 'Not Started',
      priority: 'Low',
      progress: 0,
      progressStatus: 'green',
      estimatedDuration: 1,
      scheduledTime: '15:30',
      startTime: null,
      requiredItems: [
        { id: 'ITEM-008', name: 'Air Filter Element', needed: '2 pcs', status: 'Available' }
      ]
    }
  ]
})

// Filtered tasks based on selected filter
const filteredTodaysTasks = computed(() => {
  if (taskFilter.value === 'all') return todaysTasks.value
  
  const statusMap = {
    'ready': 'Not Started',
    'blocked': 'Blocked',
    'in-progress': 'In Progress'
  }
  
  return todaysTasks.value.filter(task => task.status === statusMap[taskFilter.value])
})

// KPI calculations
const todaysTasksKPI = computed(() => {
  const total = todaysTasks.value.length
  const completed = todaysTasks.value.filter(t => t.status === 'Completed').length
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0
  
  let status = 'green'
  if (completionRate < 60) status = 'red'
  else if (completionRate < 80) status = 'yellow'
  
  return {
    total,
    completed,
    completionRate,
    status
  }
})

const itemsReadyKPI = computed(() => {
  const allItems = todaysTasks.value.flatMap(task => task.requiredItems)
  const readyItems = allItems.filter(item => item.status === 'Available')
  const percentage = allItems.length > 0 ? Math.round((readyItems.length / allItems.length) * 100) : 100
  
  let status = 'green'
  if (percentage < 70) status = 'red'
  else if (percentage < 90) status = 'yellow'
  
  return {
    ready: readyItems.length,
    total: allItems.length,
    percentage,
    status
  }
})

const blockedTasksKPI = computed(() => {
  const count = todaysTasks.value.filter(t => t.status === 'Blocked').length
  
  let status = 'green'
  let message = 'All tasks can proceed'
  
  if (count > 2) {
    status = 'red'
    message = 'Multiple tasks blocked'
  } else if (count > 0) {
    status = 'yellow'
    message = 'Some tasks blocked'
  }
  
  return {
    count,
    status,
    message
  }
})

const efficiencyKPI = computed(() => {
  // Mock efficiency calculation based on completed tasks vs. planned tasks
  const rating = 87
  
  let status = 'green'
  let message = 'Excellent performance'
  
  if (rating < 70) {
    status = 'red'
    message = 'Needs improvement'
  } else if (rating < 85) {
    status = 'yellow'
    message = 'Good performance'
  }
  
  return {
    rating,
    status,
    message
  }
})

// Missing items that are blocking tasks
const missingItems = computed(() => {
  const missing = []
  todaysTasks.value.forEach(task => {
    task.requiredItems.forEach(item => {
      if (item.status === 'Not Available' || item.status === 'Partially Available') {
        missing.push({
          id: item.id,
          itemName: item.name,
          taskTitle: task.title,
          neededQuantity: item.needed,
          availableQuantity: item.status === 'Partially Available' ? 'Partial' : '0',
          taskId: task.id
        })
      }
    })
  })
  return missing
})

// Work orders assigned to current engineer
const myWorkOrders = computed(() => {
  return [
    {
      id: 'WO-2024-001',
      title: 'Excavator CAT 336 Maintenance',
      assetName: 'Excavator CAT 336',
      type: 'Preventive',
      priority: 'Critical',
      progress: 25,
      status: 'yellow',
      tasksCompleted: 1,
      totalTasks: 4
    },
    {
      id: 'WO-2024-005',
      title: 'Dump Truck DT-45 Service',
      assetName: 'Dump Truck DT-45',
      type: 'Preventive',
      priority: 'Medium',
      progress: 75,
      status: 'green',
      tasksCompleted: 3,
      totalTasks: 4
    },
    {
      id: 'WO-2024-003',
      title: 'Excavator CAT 320 Track Repair',
      assetName: 'Excavator CAT 320',
      type: 'Corrective',
      priority: 'High',
      progress: 40,
      status: 'red',
      tasksCompleted: 2,
      totalTasks: 5
    }
  ]
})

// Helper functions
const getTrafficLightClass = (status) => {
  switch (status) {
    case 'green': return 'bg-success shadow-success/50 shadow-lg animate-pulse'
    case 'yellow': return 'bg-warning shadow-warning/50 shadow-lg animate-pulse'
    case 'red': return 'bg-error shadow-error/50 shadow-lg animate-pulse'
    default: return 'bg-muted'
  }
}

const getProgressBarClass = (status) => {
  switch (status) {
    case 'green': return 'bg-gradient-to-r from-green-500 to-green-400'
    case 'yellow': return 'bg-gradient-to-r from-yellow-500 to-yellow-400'
    case 'red': return 'bg-gradient-to-r from-red-500 to-red-400'
    default: return 'bg-gradient-to-r from-gray-400 to-gray-300'
  }
}

const getTaskBorderClass = (status) => {
  switch (status) {
    case 'Not Started': return 'border-info'
    case 'In Progress': return 'border-warning'
    case 'Blocked': return 'border-error'
    case 'Completed': return 'border-success'
    default: return 'border-muted'
  }
}

const getTaskStatusClass = (status) => {
  switch (status) {
    case 'Not Started': return 'bg-info-light text-info-color'
    case 'In Progress': return 'bg-warning-light text-warning-color'
    case 'Blocked': return 'bg-error-light text-error-color'
    case 'Completed': return 'bg-success-light text-success-color'
    default: return 'bg-muted-light text-muted'
  }
}

const getPriorityClass = (priority) => {
  switch (priority) {
    case 'Critical': return 'text-error-color'
    case 'High': return 'text-warning-color'
    case 'Medium': return 'text-info-color'
    case 'Low': return 'text-success-color'
    default: return 'text-muted'
  }
}

const getItemStatusClass = (status) => {
  switch (status) {
    case 'Available': return 'text-success-color'
    case 'Partially Available': return 'text-warning-color'
    case 'Not Available': return 'text-error-color'
    default: return 'text-muted'
  }
}

const getItemStatusDot = (status) => {
  switch (status) {
    case 'Available': return 'bg-success'
    case 'Partially Available': return 'bg-warning'
    case 'Not Available': return 'bg-error animate-pulse'
    default: return 'bg-muted'
  }
}

const getAssetIcon = (assetType) => {
  switch (assetType) {
    case 'excavator': return mdiExcavator
    case 'truck': return mdiTruck
    case 'drill': return mdiCog
    case 'crusher': return mdiFactory
    case 'crane': return mdiCrane
    default: return mdiFactory
  }
}

const canStartTask = (task) => {
  return task.requiredItems.every(item => item.status === 'Available')
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })
}

const formatTime = (timeString) => {
  return timeString
}

const getElapsedTime = (startTime) => {
  if (!startTime) return '0h'
  const now = new Date()
  const start = new Date(startTime)
  const diffHours = Math.floor((now - start) / (1000 * 60 * 60))
  const diffMinutes = Math.floor(((now - start) % (1000 * 60 * 60)) / (1000 * 60))
  
  if (diffHours > 0) {
    return `${diffHours}h ${diffMinutes}m`
  } else {
    return `${diffMinutes}m`
  }
}

// Ensure data is loaded when component mounts
onMounted(() => {
  if (!taskStore.tasks.length) taskStore.fetchTasks()
  if (!workOrderStore.workOrders.length) workOrderStore.fetchWorkOrders()
  if (!assetStore.assets.length) assetStore.fetchAssets()
})
</script>
