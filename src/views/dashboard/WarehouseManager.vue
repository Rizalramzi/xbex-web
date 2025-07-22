<template>
  <div class="space-y-6">
    <!-- Warehouse Manager KPIs -->
    <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-6">
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
          <div class="w-14 h-14 bg-primary-light rounded-xl flex items-center justify-center">
            <MdiIcon :path="mdiPackageVariant" :size="28" class="text-primary-color" />
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
          <div class="w-14 h-14 bg-error-light rounded-xl flex items-center justify-center">
            <MdiIcon :path="mdiAlert" :size="28" class="text-error-color" />
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

      <!-- Pending Delivery KPI -->
      <div class="card-dark p-6 relative overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer border border-transparent hover:border-primary/20">
        <div class="flex items-center justify-between">
          <div class="flex-1">
            <div class="flex items-center space-x-3 mb-3">
              <div :class="getTrafficLightClass(pendingDeliveryKPI.status)" class="w-3 h-3 rounded-full"></div>
              <h3 class="text-sm font-medium text-muted uppercase tracking-wide">Pending Delivery</h3>
            </div>
            <div class="flex items-baseline space-x-2 mb-2">
              <span class="text-3xl font-bold text-primary">{{ pendingDeliveryKPI.count }}</span>
              <span class="text-sm text-muted">orders</span>
            </div>
            <p class="text-xs text-muted">{{ pendingDeliveryKPI.message }}</p>
          </div>
          <div class="w-14 h-14 bg-warning-light rounded-xl flex items-center justify-center">
            <MdiIcon :path="mdiTruckDelivery" :size="28" class="text-warning-color" />
          </div>
        </div>
        <div class="absolute bottom-0 left-0 right-0 h-2 bg-light rounded-full">
          <div 
            :class="getProgressBarClass(pendingDeliveryKPI.status)"
            class="h-2 rounded-full transition-all duration-500 ease-out"
            :style="{ width: Math.max(pendingDeliveryKPI.percentage, 5) + '%', minWidth: '10px' }"
          ></div>
        </div>
      </div>

      <!-- Completed Delivery KPI -->
      <div class="card-dark p-6 relative overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer border border-transparent hover:border-primary/20">
        <div class="flex items-center justify-between">
          <div class="flex-1">
            <div class="flex items-center space-x-3 mb-3">
              <div :class="getTrafficLightClass(completedDeliveryKPI.status)" class="w-3 h-3 rounded-full"></div>
              <h3 class="text-sm font-medium text-muted uppercase tracking-wide">Completed Delivery</h3>
            </div>
            <div class="flex items-baseline space-x-2 mb-2">
              <span class="text-3xl font-bold text-primary">{{ completedDeliveryKPI.count }}</span>
              <span class="text-sm text-muted">orders</span>
            </div>
            <p class="text-xs text-muted">{{ completedDeliveryKPI.message }}</p>
          </div>
          <div class="w-14 h-14 bg-success-light rounded-xl flex items-center justify-center">
            <MdiIcon :path="mdiCheckCircle" :size="28" class="text-success-color" />
          </div>
        </div>
        <div class="absolute bottom-0 left-0 right-0 h-2 bg-light rounded-full">
          <div 
            :class="getProgressBarClass(completedDeliveryKPI.status)"
            class="h-2 rounded-full transition-all duration-500 ease-out"
            :style="{ width: Math.max(completedDeliveryKPI.percentage, 5) + '%', minWidth: '10px' }"
          ></div>
        </div>
      </div>
    </div>

    <!-- Item Position Section -->
    <div class="mb-6">
      <div class="card-dark">
        <div class="px-6 py-4 border-b border-light">
          <h3 class="text-lg font-semibold text-primary">Item Position</h3>
          <p class="text-sm text-muted mt-1">Critical stock items with pending deliveries and urgent work order requirements</p>
        </div>
        <div class="p-6">
          <div v-if="criticalItemPositions.length === 0" class="text-center py-8">
            <MdiIcon :path="mdiCheckCircle" :size="32" class="text-success-color mx-auto mb-2" />
            <p class="text-muted">No critical items with pending deliveries</p>
          </div>
          <div v-else class="overflow-x-auto">
            <table class="min-w-full">
              <thead>
                <tr class="border-b border-light">
                  <th class="text-left py-3 px-4 font-medium text-primary">Item Info</th>
                  <th class="text-center py-3 px-4 font-medium text-primary">SOH</th>
                  <th class="text-center py-3 px-4 font-medium text-primary">Qty Status</th>
                  <th class="text-center py-3 px-4 font-medium text-primary">WO Number</th>
                  <th class="text-center py-3 px-4 font-medium text-primary">Delivery No</th>
                  <th class="text-center py-3 px-4 font-medium text-primary">Delivery Status</th>
                  <th class="text-center py-3 px-4 font-medium text-primary">Estimated Date</th>
                  <th class="text-center py-3 px-4 font-medium text-primary">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in criticalItemPositions" :key="item.id" class="border-b border-light hover:bg-secondary-light transition-colors">
                  <!-- Item Info -->
                  <td class="py-4 px-4">
                    <div class="flex items-center space-x-3">
                      <div class="w-10 h-10 bg-primary-light rounded-lg flex items-center justify-center">
                        <MdiIcon :path="mdiPackageVariant" :size="20" class="text-primary-color" />
                      </div>
                      <div>
                        <h4 class="text-sm font-semibold text-primary">{{ item.itemName }}</h4>
                        <p class="text-xs text-muted">ID: {{ item.itemId }}</p>
                      </div>
                    </div>
                  </td>
                  
                  <!-- SOH (Stock on Hand) -->
                  <td class="py-4 px-4 text-center">
                    <span class="text-lg font-bold text-primary">{{ item.soh }}</span>
                    <p class="text-xs text-muted">{{ item.unit }}</p>
                  </td>
                  
                  <!-- Quantity Status -->
                  <td class="py-4 px-4 text-center">
                    <div class="space-y-1">
                      <span :class="getStockStatusClass(item.stockStatus)" class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium">
                        {{ item.stockStatus }}
                      </span>
                      <p class="text-xs text-muted">Needed: {{ item.neededQuantity }}</p>
                    </div>
                  </td>
                  
                  <!-- Work Order Number -->
                  <td class="py-4 px-4 text-center">
                    <div class="space-y-1">
                      <div v-for="wo in item.workOrders" :key="wo.number" class="inline-flex items-center">
                        <span class="text-sm font-medium text-primary">{{ wo.number }}</span>
                        <span :class="getPriorityClass(wo.priority)" class="ml-2 w-2 h-2 rounded-full"></span>
                      </div>
                    </div>
                  </td>
                  
                  <!-- Delivery Number -->
                  <td class="py-4 px-4 text-center">
                    <span class="text-sm font-medium text-primary">{{ item.deliveryNumber }}</span>
                  </td>
                  
                  <!-- Delivery Status -->
                  <td class="py-4 px-4 text-center">
                    <span :class="getDeliveryStatusClass(item.deliveryStatus)" class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium">
                      <span :class="getDeliveryStatusDotClass(item.deliveryStatus)" class="w-1.5 h-1.5 rounded-full mr-2"></span>
                      {{ item.deliveryStatus }}
                    </span>
                  </td>
                  
                  <!-- Estimated Date -->
                  <td class="py-4 px-4 text-center">
                    <div class="space-y-1">
                      <span class="text-sm font-medium text-primary">{{ formatDate(item.estimatedDate) }}</span>
                      <p :class="getDaysRemainingClass(item.estimatedDate)" class="text-xs">
                        {{ getDaysRemaining(item.estimatedDate) }}
                      </p>
                    </div>
                  </td>
                  
                  <!-- Actions -->
                  <td class="py-4 px-4 text-center">
                    <div class="flex items-center justify-center space-x-2">
                      <button class="p-2 text-primary hover:bg-primary-light rounded-lg transition-colors" title="Track Delivery">
                        <MdiIcon :path="mdiMapMarker" :size="16" />
                      </button>
                      <button class="p-2 text-warning hover:bg-warning-light rounded-lg transition-colors" title="Expedite">
                        <MdiIcon :path="mdiRocket" :size="16" />
                      </button>
                      <button class="p-2 text-info hover:bg-info-light rounded-lg transition-colors" title="Contact Supplier">
                        <MdiIcon :path="mdiPhone" :size="16" />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Additional Warehouse Widgets -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <!-- Urgent Deliveries Widget -->
      <div class="card-dark">
        <div class="px-6 py-4 border-b border-light">
          <div class="flex items-center space-x-2">
            <MdiIcon :path="mdiClockAlert" :size="20" class="text-error-color" />
            <h3 class="text-lg font-semibold text-primary">Urgent Deliveries</h3>
          </div>
          <p class="text-sm text-muted mt-1">Deliveries required within 24 hours</p>
        </div>
        <div class="p-6">
          <div class="space-y-3">
            <div v-for="delivery in urgentDeliveries" :key="delivery.id" class="flex items-center justify-between p-3 bg-secondary-light rounded-lg">
              <div class="flex-1">
                <h4 class="text-sm font-medium text-primary">{{ delivery.itemName }}</h4>
                <p class="text-xs text-muted">{{ delivery.supplier }} • Qty: {{ delivery.quantity }}</p>
                <p class="text-xs text-error-color">Required: {{ formatDate(delivery.requiredDate) }}</p>
              </div>
              <div class="flex items-center space-x-2">
                <span class="w-2 h-2 bg-error rounded-full animate-pulse"></span>
                <span class="text-xs font-medium text-error-color">{{ getHoursRemaining(delivery.requiredDate) }}h left</span>
              </div>
            </div>
            <div v-if="urgentDeliveries.length === 0" class="text-center py-4">
              <MdiIcon :path="mdiCheckCircle" :size="32" class="text-success-color mx-auto mb-2" />
              <p class="text-sm text-muted">No urgent deliveries</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Stock Movements Widget -->
      <div class="card-dark">
        <div class="px-6 py-4 border-b border-light">
          <div class="flex items-center space-x-2">
            <MdiIcon :path="mdiSwapHorizontal" :size="20" class="text-info-color" />
            <h3 class="text-lg font-semibold text-primary">Recent Stock Movements</h3>
          </div>
          <p class="text-sm text-muted mt-1">Latest inventory transactions</p>
        </div>
        <div class="p-6">
          <div class="space-y-3">
            <div v-for="movement in stockMovements" :key="movement.id" class="flex items-center justify-between p-3 bg-secondary-light rounded-lg">
              <div class="flex-1">
                <h4 class="text-sm font-medium text-primary">{{ movement.itemName }}</h4>
                <p class="text-xs text-muted">{{ movement.movementType }} • {{ formatDate(movement.date) }}</p>
              </div>
              <div class="text-right">
                <span :class="movement.quantity > 0 ? 'text-success-color' : 'text-error-color'" class="text-sm font-bold">
                  {{ movement.quantity > 0 ? '+' : '' }}{{ movement.quantity }}
                </span>
                <p class="text-xs text-muted">{{ movement.reference }}</p>
              </div>
            </div>
            <div v-if="stockMovements.length === 0" class="text-center py-4">
              <MdiIcon :path="mdiInformation" :size="32" class="text-info-color mx-auto mb-2" />
              <p class="text-sm text-muted">No recent movements</p>
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
import { useItemStore } from '../../stores/itemStore'
import { useTaskStore } from '../../stores/taskStore'
import { useWorkOrderStore } from '../../stores/workOrderStore'

// Import MDI icons
import { 
  mdiPackageVariant,
  mdiAlert,
  mdiTruckDelivery,
  mdiCheckCircle,
  mdiMapMarker,
  mdiRocket,
  mdiPhone,
  mdiClockAlert,
  mdiSwapHorizontal,
  mdiInformation
} from '@mdi/js'

// Store instances
const itemStore = useItemStore()
const taskStore = useTaskStore()
const workOrderStore = useWorkOrderStore()

// KPI calculations
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

const pendingDeliveryKPI = computed(() => {
  // Mock data for pending deliveries
  const pendingCount = 8
  const totalDeliveries = 15
  const percentage = Math.round((pendingCount / totalDeliveries) * 100)
  
  let status = 'yellow'
  let message = 'On schedule'
  
  if (percentage > 70) {
    status = 'red'
    message = 'High pending volume'
  } else if (percentage > 50) {
    status = 'yellow'
    message = 'Monitor closely'
  } else {
    status = 'green'
    message = 'On schedule'
  }
  
  return {
    count: pendingCount,
    percentage,
    status,
    message
  }
})

const completedDeliveryKPI = computed(() => {
  // Mock data for completed deliveries
  const completedCount = 7
  const totalDeliveries = 15
  const percentage = Math.round((completedCount / totalDeliveries) * 100)
  
  let status = 'green'
  let message = 'Good performance'
  
  if (percentage < 40) {
    status = 'red'
    message = 'Below target'
  } else if (percentage < 70) {
    status = 'yellow'
    message = 'Needs improvement'
  }
  
  return {
    count: completedCount,
    percentage,
    status,
    message
  }
})

// Critical Item Positions - Items with critical stock that have pending deliveries and are needed by urgent work orders
const criticalItemPositions = computed(() => {
  return [
    {
      id: 'ITEM-001',
      itemId: 'HYD-PUMP-001',
      itemName: 'Hydraulic Pump Assembly',
      soh: 0,
      unit: 'pcs',
      stockStatus: 'Critical',
      neededQuantity: 2,
      workOrders: [
        { number: 'WO-2024-001', priority: 'Critical' },
        { number: 'WO-2024-005', priority: 'High' }
      ],
      deliveryNumber: 'DEL-24-0045',
      deliveryStatus: 'Delayed',
      estimatedDate: '2024-06-28T00:00:00Z'
    },
    {
      id: 'ITEM-002',
      itemId: 'TRK-CHAIN-002',
      itemName: 'Track Chain Links',
      soh: 5,
      unit: 'sets',
      stockStatus: 'Critical',
      neededQuantity: 12,
      workOrders: [
        { number: 'WO-2024-003', priority: 'High' }
      ],
      deliveryNumber: 'DEL-24-0047',
      deliveryStatus: 'On Progress',
      estimatedDate: '2024-06-30T00:00:00Z'
    },
    {
      id: 'ITEM-003',
      itemId: 'ENG-FILTER-003',
      itemName: 'Engine Oil Filter',
      soh: 2,
      unit: 'pcs',
      stockStatus: 'Critical',
      neededQuantity: 15,
      workOrders: [
        { number: 'WO-2024-007', priority: 'Medium' },
        { number: 'WO-2024-009', priority: 'High' }
      ],
      deliveryNumber: 'DEL-24-0048',
      deliveryStatus: 'On Progress',
      estimatedDate: '2024-07-02T00:00:00Z'
    },
    {
      id: 'ITEM-004',
      itemId: 'HYD-HOSE-004',
      itemName: 'Hydraulic Hose Assembly',
      soh: 1,
      unit: 'pcs',
      stockStatus: 'Critical',
      neededQuantity: 6,
      workOrders: [
        { number: 'WO-2024-012', priority: 'Critical' }
      ],
      deliveryNumber: 'DEL-24-0049',
      deliveryStatus: 'Delayed',
      estimatedDate: '2024-06-29T00:00:00Z'
    }
  ]
})

// Urgent Deliveries
const urgentDeliveries = computed(() => {
  return [
    {
      id: 'URG-001',
      itemName: 'Hydraulic Pump Assembly',
      supplier: 'PT Industrial Supply',
      quantity: 2,
      requiredDate: '2024-06-28T08:00:00Z'
    },
    {
      id: 'URG-002',
      itemName: 'Brake Pads',
      supplier: 'CV Spare Parts',
      quantity: 8,
      requiredDate: '2024-06-28T14:00:00Z'
    }
  ]
})

// Stock Movements
const stockMovements = computed(() => {
  return [
    {
      id: 'MOV-001',
      itemName: 'Engine Oil SAE 15W-40',
      movementType: 'Receipt',
      quantity: 50,
      date: '2024-06-27T10:30:00Z',
      reference: 'PO-2024-156'
    },
    {
      id: 'MOV-002',
      itemName: 'Track Chain Links',
      movementType: 'Issue',
      quantity: -4,
      date: '2024-06-27T09:15:00Z',
      reference: 'WO-2024-003'
    },
    {
      id: 'MOV-003',
      itemName: 'Air Filter Element',
      movementType: 'Receipt',
      quantity: 24,
      date: '2024-06-27T08:45:00Z',
      reference: 'PO-2024-158'
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

const getStockStatusClass = (status) => {
  switch (status) {
    case 'Critical': return 'bg-error text-white'
    case 'Low': return 'bg-warning text-white'
    case 'Normal': return 'bg-success text-white'
    default: return 'bg-muted text-white'
  }
}

const getPriorityClass = (priority) => {
  switch (priority) {
    case 'Critical': return 'bg-error'
    case 'High': return 'bg-warning'
    case 'Medium': return 'bg-info'
    case 'Low': return 'bg-success'
    default: return 'bg-muted'
  }
}

const getDeliveryStatusClass = (status) => {
  switch (status) {
    case 'On Progress': return 'bg-info-light text-info-color'
    case 'Delayed': return 'bg-error-light text-error-color'
    case 'Completed': return 'bg-success-light text-success-color'
    default: return 'bg-muted-light text-muted'
  }
}

const getDeliveryStatusDotClass = (status) => {
  switch (status) {
    case 'On Progress': return 'bg-info'
    case 'Delayed': return 'bg-error animate-pulse'
    case 'Completed': return 'bg-success'
    default: return 'bg-muted'
  }
}

const getDaysRemainingClass = (dateString) => {
  const days = getDaysRemaining(dateString, true)
  if (days < 0) return 'text-error-color font-medium'
  if (days <= 1) return 'text-warning-color font-medium'
  return 'text-muted'
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

const getDaysRemaining = (dateString, returnNumber = false) => {
  if (!dateString) return returnNumber ? 0 : 'N/A'
  const now = new Date()
  const targetDate = new Date(dateString)
  const diffTime = targetDate - now
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (returnNumber) return diffDays
  
  if (diffDays < 0) return `${Math.abs(diffDays)}d overdue`
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Tomorrow'
  return `${diffDays}d remaining`
}

const getHoursRemaining = (dateString) => {
  if (!dateString) return 0
  const now = new Date()
  const targetDate = new Date(dateString)
  const diffTime = targetDate - now
  const diffHours = Math.ceil(diffTime / (1000 * 60 * 60))
  return Math.max(0, diffHours)
}

// Ensure data is loaded when component mounts
onMounted(() => {
  if (!itemStore.items.length) itemStore.fetchItems()
  if (!taskStore.tasks.length) taskStore.fetchTasks()
  if (!workOrderStore.workOrders.length) workOrderStore.fetchWorkOrders()
})
</script>
