import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useTaskStore = defineStore('task', () => {
  const tasks = ref([])
  const taskItems = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Mock data for tasks
  const mockTasks = [
    {
      "id": "TASK-001",
      "workOrderId": "WO-2024-001",
      "taskNumber": 1,
      "title": "Engine Oil and Filter Change",
      "description": "Drain old engine oil, replace oil filter, and refill with specified grade oil",
      "type": "maintenance",
      "priority": "High",
      "status": "completed",
      "assignedTo": "Michael Torres",
      "estimatedDuration": 120,
      "actualDuration": 105,
      "progressPercentage": 100,
      "completedBy": "Michael Torres"
    },
    {
      "id": "TASK-002",
      "workOrderId": "WO-2024-001",
      "taskNumber": 2,
      "title": "Hydraulic System Inspection",
      "description": "Check hydraulic fluid levels, inspect hoses and connections for leaks",
      "type": "inspection",
      "priority": "High",
      "status": "in-progress",
      "assignedTo": "Sarah Johnson",
      "estimatedDuration": 90,
      "actualDuration": null,
      "progressPercentage": 65,
      "completedBy": null
    },
    {
      "id": "TASK-003",
      "workOrderId": "WO-2024-001",
      "taskNumber": 3,
      "title": "Track Chain and Sprocket Inspection",
      "description": "Inspect track chains for wear, check sprocket alignment and lubrication",
      "type": "inspection",
      "priority": "Medium",
      "status": "scheduled",
      "assignedTo": "David Chen",
      "estimatedDuration": 75,
      "actualDuration": null,
      "progressPercentage": 0,
      "completedBy": null
    },
    {
      "id": "TASK-004",
      "workOrderId": "WO-2024-002",
      "taskNumber": 1,
      "title": "Transmission Disassembly",
      "description": "Remove transmission from vehicle and disassemble for inspection",
      "type": "repair",
      "priority": "Critical",
      "status": "completed",
      "assignedTo": "Robert Miller",
      "estimatedDuration": 300,
      "actualDuration": 285,
      "progressPercentage": 100,
      "completedBy": "Robert Miller"
    },
    {
      "id": "TASK-005",
      "workOrderId": "WO-2024-002",
      "taskNumber": 2,
      "title": "Replace Faulty Components",
      "description": "Replace damaged transmission components identified during inspection",
      "type": "repair",
      "priority": "Critical",
      "status": "completed",
      "assignedTo": "Robert Miller",
      "estimatedDuration": 240,
      "actualDuration": 255,
      "progressPercentage": 100,
      "completedBy": "Robert Miller"
    },
    {
      "id": "TASK-006",
      "workOrderId": "WO-2024-003",
      "taskNumber": 1,
      "title": "Brake System Service",
      "description": "Replace brake pads and inspect brake system components",
      "type": "maintenance",
      "priority": "High",
      "status": "in-progress",
      "assignedTo": "Lisa Wang",
      "estimatedDuration": 180,
      "actualDuration": null,
      "progressPercentage": 40,
      "completedBy": null
    },
    {
      "id": "TASK-007",
      "workOrderId": "WO-2024-004",
      "taskNumber": 1,
      "title": "Cooling System Maintenance",
      "description": "Flush cooling system and replace coolant",
      "type": "maintenance",
      "priority": "Medium",
      "status": "scheduled",
      "assignedTo": "Mark Thompson",
      "estimatedDuration": 120,
      "actualDuration": null,
      "progressPercentage": 0,
      "completedBy": null
    },
    {
      "id": "TASK-008",
      "workOrderId": "WO-2024-005",
      "taskNumber": 1,
      "title": "Belt Replacement",
      "description": "Replace worn drive belts on crusher",
      "type": "repair",
      "priority": "High",
      "status": "in-progress",
      "assignedTo": "James Anderson",
      "estimatedDuration": 90,
      "actualDuration": null,
      "progressPercentage": 75,
      "completedBy": null
    }
  ]

  // Mock data for task items
  const mockTaskItems = [
    {
      "id": "ITEM-001",
      "taskId": "TASK-001",
      "itemCode": "OIL-15W40-20L",
      "itemName": "Engine Oil 15W-40",
      "quantityRequired": 32,
      "stockStatus": "available",
      "availableQuantity": 180,
      "minimumStock": 50
    },
    {
      "id": "ITEM-002",
      "taskId": "TASK-001",
      "itemCode": "FILTER-OIL-CAT390F",
      "itemName": "Oil Filter CAT 390F",
      "quantityRequired": 1,
      "stockStatus": "available",
      "availableQuantity": 25,
      "minimumStock": 5
    },
    {
      "id": "ITEM-003",
      "taskId": "TASK-002",
      "itemCode": "FLUID-HYD-AW68",
      "itemName": "Hydraulic Fluid AW68",
      "quantityRequired": 15,
      "stockStatus": "available",
      "availableQuantity": 95,
      "minimumStock": 30
    },
    {
      "id": "ITEM-004",
      "taskId": "TASK-006",
      "itemCode": "BRAKE-PAD-HEAVY",
      "itemName": "Heavy Duty Brake Pads",
      "quantityRequired": 4,
      "stockStatus": "low",
      "availableQuantity": 3,
      "minimumStock": 8
    },
    {
      "id": "ITEM-005",
      "taskId": "TASK-007",
      "itemCode": "COOLANT-50-50",
      "itemName": "Engine Coolant 50/50",
      "quantityRequired": 25,
      "stockStatus": "available",
      "availableQuantity": 80,
      "minimumStock": 20
    },
    {
      "id": "ITEM-006",
      "taskId": "TASK-008",
      "itemCode": "BELT-DRIVE-1200",
      "itemName": "Drive Belt 1200mm",
      "quantityRequired": 2,
      "stockStatus": "critical",
      "availableQuantity": 1,
      "minimumStock": 3
    }
  ]

  // Computed properties for KPIs
  const taskStats = computed(() => {
    const completed = tasks.value.filter(t => t.status === 'completed').length
    const total = tasks.value.length
    const uncompleted = total - completed
    
    return {
      total,
      completed,
      uncompleted,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
    }
  })

  const taskCompletionProgress = computed(() => {
    if (tasks.value.length === 0) return 0
    
    const totalProgress = tasks.value.reduce((sum, task) => sum + task.progressPercentage, 0)
    return Math.round(totalProgress / tasks.value.length)
  })

  const itemAvailabilityStats = computed(() => {
    if (taskItems.value.length === 0) return { available: 0, total: 0, percentage: 0 }
    
    const availableItems = taskItems.value.filter(item => 
      item.availableQuantity >= item.quantityRequired
    ).length
    
    const total = taskItems.value.length
    const percentage = total > 0 ? Math.round((availableItems / total) * 100) : 0
    
    return {
      available: availableItems,
      total,
      percentage
    }
  })

  const criticalStockCount = computed(() => {
    return taskItems.value.filter(item => 
      item.stockStatus === 'critical' || 
      item.availableQuantity < item.minimumStock
    ).length
  })

  // Actions
  const fetchTasks = async () => {
    loading.value = true
    error.value = null
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300))
      tasks.value = mockTasks
      taskItems.value = mockTaskItems
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  const getTasksByWorkOrder = (workOrderId) => {
    return tasks.value.filter(task => task.workOrderId === workOrderId)
  }

  const getItemsByTask = (taskId) => {
    return taskItems.value.filter(item => item.taskId === taskId)
  }

  return {
    tasks,
    taskItems,
    loading,
    error,
    taskStats,
    taskCompletionProgress,
    itemAvailabilityStats,
    criticalStockCount,
    fetchTasks,
    getTasksByWorkOrder,
    getItemsByTask
  }
})
