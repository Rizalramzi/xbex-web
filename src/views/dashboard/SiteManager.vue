<template>
  <div class="space-y-6">
    <!-- Site Manager KPIs -->
    <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-6">
      <!-- Work Order KPI -->
      <div class="card-dark p-6 relative overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer border border-transparent hover:border-primary/20">
        <div class="flex items-center justify-between">
          <div class="flex-1">
            <div class="flex items-center space-x-3 mb-3">
              <div :class="getTrafficLightClass(workOrderKPI.status)" class="w-3 h-3 rounded-full"></div>
              <h3 class="text-sm font-medium text-muted uppercase tracking-wide">Work Orders</h3>
            </div>
            <div class="flex items-baseline space-x-3 mb-2">
              <span class="text-3xl font-semibold text-success-color">{{ workOrderKPI.completed }}</span>
              <span class="text-lg text-muted">/</span>
              <span class="text-3xl font-bold text-primary">{{ workOrderKPI.completed + workOrderKPI.uncompleted }}</span>
            </div>
            <p class="text-xs text-muted">{{ workOrderKPI.completionRate }}% completion rate</p>
          </div>
          <div class="w-14 h-14 bg-primary-light rounded-xl flex items-center justify-center">
            <MdiIcon :path="mdiClipboardList" :size="28" class="text-primary-color" />
          </div>
        </div>
        <div class="absolute bottom-0 left-0 right-0 h-2 bg-light rounded-full">
          <div 
            :class="getProgressBarClass(workOrderKPI.status)"
            class="h-2 rounded-full transition-all duration-500 ease-out"
            :style="{ width: Math.max(workOrderKPI.completionRate, 5) + '%', minWidth: '10px' }"
          ></div>
        </div>
      </div>

      <!-- Item Availability KPI -->
      <div class="card-dark p-6 relative overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer border border-transparent hover:border-primary/20">
        <div class="flex items-center justify-between">
          <div class="flex-1">
            <div class="flex items-center space-x-3 mb-3">
              <div :class="getTrafficLightClass(itemAvailabilityKPI.status)" class="w-3 h-3 rounded-full"></div>
              <h3 class="text-sm font-medium text-muted uppercase tracking-wide">Item Availability</h3>
            </div>
            <div class="flex items-baseline space-x-2 mb-2">
              <span class="text-3xl font-bold text-primary">{{ itemAvailabilityKPI.percentage }}%</span>
            </div>
            <p class="text-xs text-muted">{{ itemAvailabilityKPI.available }}/{{ itemAvailabilityKPI.total }} items available</p>
          </div>
          <div class="w-14 h-14 bg-info-light rounded-xl flex items-center justify-center">
            <MdiIcon :path="mdiPackageVariant" :size="28" class="text-info-color" />
          </div>
        </div>
        <div class="absolute bottom-0 left-0 right-0 h-2 bg-light rounded-full">
          <div 
            :class="getProgressBarClass(itemAvailabilityKPI.status)"
            class="h-2 rounded-full transition-all duration-500 ease-out"
            :style="{ width: Math.max(itemAvailabilityKPI.percentage, 5) + '%', minWidth: '10px' }"
          ></div>
        </div>
      </div>

      <!-- Critical Stock KPI -->
      <div class="card-dark p-6 relative overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer border border-transparent hover:border-primary/20">
        <div class="flex items-center justify-between">
          <div class="flex-1">
            <div class="flex items-center space-x-3 mb-3">
              <div :class="getTrafficLightClass(criticalStockKPI.status)" class="w-3 h-3 rounded-full"></div>
              <h3 class="text-sm font-medium text-muted uppercase tracking-wide">Critical Stock</h3>
            </div>
            <div class="flex items-baseline space-x-2 mb-2">
              <span class="text-3xl font-bold text-primary">{{ criticalStockKPI.count }}</span>
              <span class="text-sm text-muted">items</span>
            </div>
            <p class="text-xs text-muted">{{ criticalStockKPI.message }}</p>
          </div>
          <div class="w-14 h-14 bg-warning-light rounded-xl flex items-center justify-center">
            <MdiIcon :path="mdiAlert" :size="28" class="text-warning-color" />
          </div>
        </div>
        <div class="absolute bottom-0 left-0 right-0 h-2 bg-light rounded-full">
          <div 
            :class="getProgressBarClass(criticalStockKPI.status)"
            class="h-2 rounded-full transition-all duration-500 ease-out"
            :style="{ width: '100%' }"
          ></div>
        </div>
      </div>

      <!-- Task Completion KPI -->
      <div class="card-dark p-6 relative overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer border border-transparent hover:border-primary/20">
        <div class="flex items-center justify-between">
          <div class="flex-1">
            <div class="flex items-center space-x-3 mb-3">
              <div :class="getTrafficLightClass(taskCompletionKPI.status)" class="w-3 h-3 rounded-full"></div>
              <h3 class="text-sm font-medium text-muted uppercase tracking-wide">Task Progress</h3>
            </div>
            <div class="flex items-baseline space-x-2 mb-2">
              <span class="text-3xl font-bold text-primary">{{ taskCompletionKPI.progress }}%</span>
            </div>
            <p class="text-xs text-muted">{{ taskCompletionKPI.message }}</p>
          </div>
          <div class="w-14 h-14 bg-success-light rounded-xl flex items-center justify-center">
            <MdiIcon :path="mdiCheckCircle" :size="28" class="text-success-color" />
          </div>
        </div>
        <div class="absolute bottom-0 left-0 right-0 h-2 bg-light rounded-full">
          <div 
            :class="getProgressBarClass(taskCompletionKPI.status)"
            class="h-2 rounded-full transition-all duration-500 ease-out"
            :style="{ width: Math.max(taskCompletionKPI.progress, 5) + '%', minWidth: '10px' }"
          ></div>
        </div>
      </div>
    </div>

    <!-- Work Order Progress Section -->
    <div class="mb-6">
      <div class="card-dark">
        <div class="px-6 py-4 border-b border-light">
          <h3 class="text-lg font-semibold text-primary">Work Order Progress</h3>
          <p class="text-sm text-muted mt-1">Track completion progress of all active work orders</p>
        </div>
        <div class="p-6">
          <div v-if="workOrdersWithProgress.length === 0" class="text-center py-8">
            <p class="text-muted">No work orders available</p>
          </div>
          <div v-else class="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div v-for="workOrder in workOrdersWithProgress" :key="workOrder.id" class="bg-secondary-light rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                <div class="flex items-center justify-between mb-3">
                  <div class="flex items-center space-x-3">
                    <div class="w-10 h-10 bg-primary-light rounded-lg flex items-center justify-center flex-shrink-0">
                      <MdiIcon :path="getAssetIcon(workOrder.assetType)" :size="20" class="text-primary-color" />
                    </div>
                    <div class="min-w-0 flex-1">
                      <h4 class="text-sm font-semibold text-primary truncate">{{ workOrder.title }}</h4>
                      <p class="text-xs text-muted truncate">{{ workOrder.assetName }}</p>
                      <p class="text-xs text-muted">{{ workOrder.priority }} Priority</p>
                    </div>
                  </div>
                </div>
                <div class="mb-3">
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-lg font-bold text-primary">{{ workOrder.overallProgress }}%</span>
                    <span class="text-xs text-muted">{{ workOrder.completedTasks }}/{{ workOrder.totalTasks }} tasks</span>
                  </div>
                  <div class="relative">
                    <div class="w-full bg-light rounded-full h-3">
                      <div 
                        :class="getProgressBarClass(workOrder.status)"
                        class="h-3 rounded-full transition-all duration-500 ease-out flex items-center justify-end relative"
                        :style="{ width: Math.max(workOrder.overallProgress, 5) + '%', minWidth: '20px' }"
                      >
                        <div v-if="workOrder.overallProgress > 15" class="w-5 h-5 bg-white rounded-full shadow-sm flex items-center justify-center absolute -right-2.5">
                          <MdiIcon :path="getAssetIcon(workOrder.assetType)" :size="10" class="text-primary-color" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Three Widget Section -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      <!-- Overdue Tasks Widget -->
      <div class="card-dark">
        <div class="px-6 py-4 border-b border-light">
          <div class="flex items-center space-x-2">
            <MdiIcon :path="mdiClockAlert" :size="20" class="text-error-color" />
            <h3 class="text-lg font-semibold text-primary">Overdue Tasks</h3>
          </div>
          <p class="text-sm text-muted mt-1">Tasks that are past their deadline</p>
        </div>
        <div class="p-6">
          <div class="space-y-3">
            <div v-for="task in overdueTasks" :key="task.id" class="flex items-center justify-between p-3 bg-secondary-light rounded-lg">
              <div class="flex-1">
                <h4 class="text-sm font-medium text-primary">{{ task.title }}</h4>
                <p class="text-xs text-muted">{{ task.workOrderTitle }}</p>
                <p class="text-xs text-error-color">Due: {{ formatDate(task.expectedEndTime) }}</p>
              </div>
              <div class="flex items-center space-x-2">
                <span class="w-2 h-2 bg-error rounded-full animate-pulse"></span>
                <span class="text-xs font-medium text-error-color">{{ getDaysOverdue(task.expectedEndTime) }}d late</span>
              </div>
            </div>
            <div v-if="overdueTasks.length === 0" class="text-center py-4">
              <MdiIcon :path="mdiCheckCircle" :size="32" class="text-success-color mx-auto mb-2" />
              <p class="text-sm text-muted">No overdue tasks</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Overdue Item Fulfillment Widget -->
      <div class="card-dark">
        <div class="px-6 py-4 border-b border-light">
          <div class="flex items-center space-x-2">
            <MdiIcon :path="mdiPackageDown" :size="20" class="text-warning-color" />
            <h3 class="text-lg font-semibold text-primary">Overdue Fulfillment</h3>
          </div>
          <p class="text-sm text-muted mt-1">Items with delayed delivery or procurement</p>
        </div>
        <div class="p-6">
          <div class="space-y-3">
            <div v-for="item in overdueItems" :key="item.id" class="flex items-center justify-between p-3 bg-secondary-light rounded-lg">
              <div class="flex-1">
                <h4 class="text-sm font-medium text-primary">{{ item.itemName }}</h4>
                <p class="text-xs text-muted">{{ item.category }} • Qty: {{ item.quantityRequired }}</p>
                <p class="text-xs text-warning-color">Expected: {{ formatDate(item.expectedDelivery) }}</p>
              </div>
              <div class="flex items-center space-x-2">
                <span class="w-2 h-2 bg-warning rounded-full animate-pulse"></span>
                <span class="text-xs font-medium text-warning-color">{{ getDaysOverdue(item.expectedDelivery) }}d late</span>
              </div>
            </div>
            <div v-if="overdueItems.length === 0" class="text-center py-4">
              <MdiIcon :path="mdiCheckCircle" :size="32" class="text-success-color mx-auto mb-2" />
              <p class="text-sm text-muted">No overdue fulfillments</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Critical Stock Items Widget -->
      <div class="card-dark">
        <div class="px-6 py-4 border-b border-light">
          <div class="flex items-center space-x-2">
            <MdiIcon :path="mdiAlertOctagon" :size="20" class="text-error-color" />
            <h3 class="text-lg font-semibold text-primary">Critical Stock</h3>
          </div>
          <p class="text-sm text-muted mt-1">Items requiring immediate restocking</p>
        </div>
        <div class="p-6">
          <div class="space-y-3">
            <div v-for="item in criticalStockItems" :key="item.id" class="flex items-center justify-between p-3 bg-secondary-light rounded-lg">
              <div class="flex-1">
                <h4 class="text-sm font-medium text-primary">{{ item.itemName }}</h4>
                <p class="text-xs text-muted">{{ item.category }}</p>
                <div class="flex items-center space-x-2 mt-1">
                  <div class="w-full bg-light rounded-full h-1">
                    <div 
                      class="bg-error h-1 rounded-full"
                      :style="{ width: (item.availableQuantity / item.minimumStock) * 100 + '%' }"
                    ></div>
                  </div>
                  <span class="text-xs text-error-color whitespace-nowrap">{{ item.availableQuantity }}/{{ item.minimumStock }}</span>
                </div>
              </div>
              <div class="flex items-center space-x-2">
                <span class="w-2 h-2 bg-error rounded-full animate-pulse"></span>
                <span class="text-xs font-medium text-error-color">{{ getStockStatus(item) }}</span>
              </div>
            </div>
            <div v-if="criticalStockItems.length === 0" class="text-center py-4">
              <MdiIcon :path="mdiCheckCircle" :size="32" class="text-success-color mx-auto mb-2" />
              <p class="text-sm text-muted">All items well-stocked</p>
            </div>
          </div>
        </div>
      </div>
    </div>


  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import MdiIcon from '../../components/MdiIcon.vue'
import { useAssetStore } from '../../stores/assetStore'
import { useWorkOrderStore } from '../../stores/workOrderStore'
import { useItemStore } from '../../stores/itemStore'
import { useTaskStore } from '../../stores/taskStore'

// Import MDI icons
import { 
  mdiClipboardList,
  mdiPackageVariant,
  mdiAlert,
  mdiCheckCircle,
  mdiExcavator,
  mdiTruck,
  mdiFactory,
  mdiClockAlert,
  mdiPackageDown,
  mdiAlertOctagon,
  mdiCog,
  mdiCrane
} from '@mdi/js'

// Store instances
const assetStore = useAssetStore()
const workOrderStore = useWorkOrderStore()
const itemStore = useItemStore()
const taskStore = useTaskStore()

// KPI calculations with traffic light indicators
const workOrderKPI = computed(() => {
  const stats = workOrderStore.workOrderStats
  if (!stats) return { uncompleted: 0, completed: 0, completionRate: 0, status: 'green' }
  
  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0
  
  let status = 'green'
  if (completionRate < 60) status = 'red'
  else if (completionRate < 80) status = 'yellow'
  
  return {
    uncompleted: stats.total - stats.completed,
    completed: stats.completed,
    completionRate,
    status
  }
})

const itemAvailabilityKPI = computed(() => {
  const stats = taskStore.itemAvailabilityStats
  if (!stats) return { available: 0, total: 0, percentage: 0, status: 'green' }
  
  let status = 'green'
  if (stats.percentage < 70) status = 'red'
  else if (stats.percentage < 90) status = 'yellow'
  
  return {
    ...stats,
    status
  }
})

const criticalStockKPI = computed(() => {
  const count = taskStore.criticalStockCount || 0
  
  let status = 'green'
  let message = 'Stock levels healthy'
  
  if (count > 5) {
    status = 'red'
    message = 'Urgent restocking needed'
  } else if (count > 2) {
    status = 'yellow'
    message = 'Monitor stock levels'
  }
  
  return {
    count,
    status,
    message
  }
})

const taskCompletionKPI = computed(() => {
  const progress = taskStore.taskCompletionProgress || 0
  
  let status = 'green'
  let message = 'On track'
  
  if (progress < 60) {
    status = 'red'
    message = 'Behind schedule'
  } else if (progress < 80) {
    status = 'yellow'
    message = 'Needs attention'
  }
  
  return {
    progress,
    status,
    message
  }
})

// Work Orders with Progress
const workOrdersWithProgress = computed(() => {
  const workOrders = workOrderStore.workOrders || []
  
  return workOrders.map(workOrder => {
    const tasks = taskStore.getTasksByWorkOrder(workOrder.id)
    const completedTasks = tasks.filter(task => task.status === 'completed').length
    const totalTasks = tasks.length
    const overallProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
    
    const asset = assetStore.assets.find(a => a.id === workOrder.assetId)
    const assetType = asset ? getAssetTypeFromName(asset.name) : 'truck'
    
    let status = 'green'
    if (overallProgress < 60) status = 'red'
    else if (overallProgress < 80) status = 'yellow'
    
    return {
      ...workOrder,
      overallProgress,
      completedTasks,
      totalTasks,
      assetType,
      status
    }
  })
})

// Overdue Tasks
const overdueTasks = computed(() => {
  const now = new Date()
  return (taskStore.tasks || [])
    .filter(task => {
      if (task.status === 'completed') return false
      if (!task.expectedEndTime) return false
      return new Date(task.expectedEndTime) < now
    })
    .map(task => {
      const workOrder = workOrderStore.workOrders.find(wo => wo.id === task.workOrderId)
      return {
        ...task,
        workOrderTitle: workOrder ? workOrder.title : 'Unknown Work Order'
      }
    })
    .slice(0, 5)
})

// Mock overdue items (since we don't have delivery dates in current data)
const overdueItems = computed(() => {
  const mockOverdueItems = [
    {
      id: 'OVERDUE-001',
      itemName: 'Hydraulic Pump Assembly',
      category: 'Hydraulic Components',
      quantityRequired: 1,
      expectedDelivery: '2024-06-20T00:00:00Z'
    },
    {
      id: 'OVERDUE-002',
      itemName: 'Track Chain Links',
      category: 'Track System',
      quantityRequired: 24,
      expectedDelivery: '2024-06-18T00:00:00Z'
    }
  ]
  return mockOverdueItems
})

// Critical Stock Items
const criticalStockItems = computed(() => {
  return (taskStore.taskItems || [])
    .filter(item => 
      item.stockStatus === 'critical' || 
      item.availableQuantity < item.minimumStock
    )
    .slice(0, 5)
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

const getAssetTypeFromName = (assetName) => {
  const name = assetName.toLowerCase()
  if (name.includes('excavator')) return 'excavator'
  if (name.includes('truck') || name.includes('dump')) return 'truck'
  if (name.includes('drill')) return 'drill'
  if (name.includes('crusher')) return 'crusher'
  if (name.includes('crane')) return 'crane'
  return 'truck'
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

const getDaysOverdue = (dateString) => {
  if (!dateString) return 0
  const now = new Date()
  const dueDate = new Date(dateString)
  const diffTime = now - dueDate
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return Math.max(0, diffDays)
}

const getStockStatus = (item) => {
  const percentage = (item.availableQuantity / item.minimumStock) * 100
  if (percentage <= 25) return 'Critical'
  if (percentage <= 50) return 'Low'
  return 'Warning'
}

// Ensure data is loaded when component mounts
onMounted(() => {
  // These should be called from the parent Dashboard component, but ensure they're loaded
  if (!assetStore.assets.length) assetStore.fetchAssets()
  if (!workOrderStore.workOrders.length) workOrderStore.fetchWorkOrders()
  if (!taskStore.tasks.length) taskStore.fetchTasks()
  if (!itemStore.items.length) itemStore.fetchItems()
})
</script>
