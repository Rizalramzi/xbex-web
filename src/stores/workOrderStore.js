import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useWorkOrderStore = defineStore('workOrder', () => {
  const workOrders = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Mock data - in real app this would fetch from API
  const mockWorkOrders = [
    {
      "id": "WO-2024-001",
      "assetId": "AST-001",
      "assetName": "Excavator CAT 390F",
      "type": "planned",
      "priority": "High",
      "status": "in-progress",
      "title": "500-Hour Preventive Maintenance",
      "description": "Comprehensive 500-hour service including engine oil change, hydraulic system check, track inspection, and electrical system diagnostics.",
      "requestedBy": "John Doe",
      "assignedTo": "Maintenance Team A",
      "createdDate": "2024-06-20T08:00:00Z",
      "scheduledStartDate": "2024-06-25T06:00:00Z",
      "scheduledEndDate": "2024-06-25T18:00:00Z",
      "actualStartDate": "2024-06-25T06:15:00Z",
      "actualEndDate": null,
      "estimatedCost": 3500.00,
      "actualCost": 2800.00,
      "maintenanceType": "Preventive",
      "workCategory": "Mechanical",
      "location": "Pit Area A"
    },
    {
      "id": "WO-2024-002",
      "assetId": "AST-002",
      "assetName": "Dump Truck CAT 773G",
      "type": "unplanned",
      "priority": "Critical",
      "status": "completed",
      "title": "Transmission Repair",
      "description": "Emergency repair due to transmission failure during hauling operation.",
      "requestedBy": "Mike Johnson",
      "assignedTo": "Emergency Response Team",
      "createdDate": "2024-06-18T14:30:00Z",
      "scheduledStartDate": "2024-06-18T15:00:00Z",
      "scheduledEndDate": "2024-06-19T12:00:00Z",
      "actualStartDate": "2024-06-18T15:45:00Z",
      "actualEndDate": "2024-06-19T10:30:00Z",
      "estimatedCost": 8500.00,
      "actualCost": 9200.00,
      "maintenanceType": "Corrective",
      "workCategory": "Powertrain",
      "location": "Haul Road 1"
    },
    {
      "id": "WO-2024-003",
      "assetId": "AST-003",
      "assetName": "Bulldozer CAT D8T",
      "type": "planned",
      "priority": "Medium",
      "status": "in-progress",
      "title": "Blade Replacement and Track Adjustment",
      "description": "Replace worn cutting edge, adjust track tension, and perform hydraulic cylinder seal replacement.",
      "requestedBy": "Sarah Wilson",
      "assignedTo": "Track Team B",
      "createdDate": "2024-06-22T10:00:00Z",
      "scheduledStartDate": "2024-06-27T08:00:00Z",
      "scheduledEndDate": "2024-06-28T16:00:00Z",
      "actualStartDate": "2024-06-27T08:30:00Z",
      "actualEndDate": null,
      "estimatedCost": 4200.00,
      "actualCost": 3800.00,
      "maintenanceType": "Preventive",
      "workCategory": "Undercarriage",
      "location": "Stockpile Area"
    },
    {
      "id": "WO-2024-004",
      "assetId": "AST-004",
      "assetName": "Water Truck Volvo FMX",
      "type": "planned",
      "priority": "Low",
      "status": "scheduled",
      "title": "Routine Service and Pump Inspection",
      "description": "Standard service including oil change, filter replacement, brake inspection, and water pump performance check.",
      "requestedBy": "David Brown",
      "assignedTo": "Service Team C",
      "createdDate": "2024-06-25T09:00:00Z",
      "scheduledStartDate": "2024-07-02T07:00:00Z",
      "scheduledEndDate": "2024-07-02T15:00:00Z",
      "actualStartDate": null,
      "actualEndDate": null,
      "estimatedCost": 1800.00,
      "actualCost": 0.00,
      "maintenanceType": "Preventive",
      "workCategory": "Vehicle Service",
      "location": "Maintenance Shop"
    },
    {
      "id": "WO-2024-005",
      "assetId": "AST-005",
      "assetName": "Grader CAT 140M",
      "type": "unplanned",
      "priority": "High",
      "status": "pending",
      "title": "Hydraulic System Leak Repair",
      "description": "Investigate and repair hydraulic fluid leak from main lift cylinders.",
      "requestedBy": "Lisa Garcia",
      "assignedTo": "Hydraulics Specialist",
      "createdDate": "2024-06-26T11:15:00Z",
      "scheduledStartDate": "2024-06-28T13:00:00Z",
      "scheduledEndDate": "2024-06-28T17:00:00Z",
      "actualStartDate": null,
      "actualEndDate": null,
      "estimatedCost": 2500.00,
      "actualCost": 0.00,
      "maintenanceType": "Corrective",
      "workCategory": "Hydraulics",
      "location": "Haul Road 2"
    },
    {
      "id": "WO-2024-006",
      "assetId": "AST-006",
      "assetName": "Drill Rig Atlas Copco ROC L8",
      "type": "planned",
      "priority": "Medium",
      "status": "completed",
      "title": "Drill Bit Replacement and Engine Service",
      "description": "Replace worn drill bits, service air compressor, change engine oil and filters.",
      "requestedBy": "Robert Chen",
      "assignedTo": "Drilling Team A",
      "createdDate": "2024-06-15T08:00:00Z",
      "scheduledStartDate": "2024-06-20T06:00:00Z",
      "scheduledEndDate": "2024-06-20T14:00:00Z",
      "actualStartDate": "2024-06-20T06:00:00Z",
      "actualEndDate": "2024-06-20T13:45:00Z",
      "estimatedCost": 5200.00,
      "actualCost": 4950.00,
      "maintenanceType": "Preventive",
      "workCategory": "Drilling Equipment",
      "location": "Blast Area B"
    },
    {
      "id": "WO-2024-007",
      "assetId": "AST-007",
      "assetName": "Compactor CAT CS74B",
      "type": "planned",
      "priority": "Low",
      "status": "scheduled",
      "title": "Vibration System Maintenance",
      "description": "Service vibration system, check drum bearings, replace worn vibration pads.",
      "requestedBy": "Emma Davis",
      "assignedTo": "Compaction Team",
      "createdDate": "2024-06-24T10:30:00Z",
      "scheduledStartDate": "2024-07-01T08:00:00Z",
      "scheduledEndDate": "2024-07-01T16:00:00Z",
      "actualStartDate": null,
      "actualEndDate": null,
      "estimatedCost": 2200.00,
      "actualCost": 0.00,
      "maintenanceType": "Preventive",
      "workCategory": "Vibration System",
      "location": "Road Construction"
    },
    {
      "id": "WO-2024-008",
      "assetId": "AST-008",
      "assetName": "Wheel Loader CAT 980M",
      "type": "unplanned",
      "priority": "Medium",
      "status": "in-progress",
      "title": "Bucket Cylinder Seal Replacement",
      "description": "Replace leaking bucket cylinder seals after operator reported hydraulic fluid loss.",
      "requestedBy": "James Miller",
      "assignedTo": "Hydraulic Team B",
      "createdDate": "2024-06-23T15:20:00Z",
      "scheduledStartDate": "2024-06-26T09:00:00Z",
      "scheduledEndDate": "2024-06-26T17:00:00Z",
      "actualStartDate": "2024-06-26T09:15:00Z",
      "actualEndDate": null,
      "estimatedCost": 1800.00,
      "actualCost": 1650.00,
      "maintenanceType": "Corrective",
      "workCategory": "Hydraulics",
      "location": "Loading Area"
    },
    {
      "id": "WO-2024-009",
      "assetId": "AST-009",
      "assetName": "Excavator Komatsu PC800",
      "type": "unplanned",
      "priority": "Critical",
      "status": "in-progress",
      "title": "Engine Overhaul",
      "description": "Complete engine overhaul due to excessive smoke and power loss.",
      "requestedBy": "Kevin Lee",
      "assignedTo": "Engine Specialist Team",
      "createdDate": "2024-06-21T16:00:00Z",
      "scheduledStartDate": "2024-06-24T07:00:00Z",
      "scheduledEndDate": "2024-06-28T17:00:00Z",
      "actualStartDate": "2024-06-24T07:30:00Z",
      "actualEndDate": null,
      "estimatedCost": 25000.00,
      "actualCost": 22500.00,
      "maintenanceType": "Overhaul",
      "workCategory": "Engine",
      "location": "Heavy Maintenance Bay"
    },
    {
      "id": "WO-2024-010",
      "assetId": "AST-010",
      "assetName": "Dump Truck Hitachi EH3500",
      "type": "planned",
      "priority": "High",
      "status": "completed",
      "title": "Tire Replacement and Brake Service",
      "description": "Replace four rear tires showing excessive wear, service brake system.",
      "requestedBy": "Anna Rodriguez",
      "assignedTo": "Tire and Brake Team",
      "createdDate": "2024-06-16T09:00:00Z",
      "scheduledStartDate": "2024-06-22T08:00:00Z",
      "scheduledEndDate": "2024-06-22T18:00:00Z",
      "actualStartDate": "2024-06-22T08:00:00Z",
      "actualEndDate": "2024-06-22T17:30:00Z",
      "estimatedCost": 45000.00,
      "actualCost": 43500.00,
      "maintenanceType": "Preventive",
      "workCategory": "Tires and Brakes",
      "location": "Tire Shop"
    },
    {
      "id": "WO-2024-011",
      "assetId": "AST-011",
      "assetName": "Crusher Plant Metso C130",
      "type": "planned",
      "priority": "Medium",
      "status": "scheduled",
      "title": "Jaw Plate Replacement and Lubrication Service",
      "description": "Replace worn jaw plates, service lubrication system, check belt tensions.",
      "requestedBy": "Tom Anderson",
      "assignedTo": "Crushing Plant Team",
      "createdDate": "2024-06-19T11:00:00Z",
      "scheduledStartDate": "2024-06-30T06:00:00Z",
      "scheduledEndDate": "2024-06-30T18:00:00Z",
      "actualStartDate": null,
      "actualEndDate": null,
      "estimatedCost": 8500.00,
      "actualCost": 0.00,
      "maintenanceType": "Preventive",
      "workCategory": "Crushing Equipment",
      "location": "Crushing Plant 1"
    },
    {
      "id": "WO-2024-012",
      "assetId": "AST-012",
      "assetName": "Conveyor Belt System CB-A1",
      "type": "unplanned",
      "priority": "High",
      "status": "pending",
      "title": "Belt Splice Repair",
      "description": "Emergency repair of belt splice failure at transfer point.",
      "requestedBy": "Maria Santos",
      "assignedTo": "Belt Maintenance Team",
      "createdDate": "2024-06-27T13:45:00Z",
      "scheduledStartDate": "2024-06-28T20:00:00Z",
      "scheduledEndDate": "2024-06-29T04:00:00Z",
      "actualStartDate": null,
      "actualEndDate": null,
      "estimatedCost": 12000.00,
      "actualCost": 0.00,
      "maintenanceType": "Emergency",
      "workCategory": "Belt Systems",
      "location": "Transport Line A"
    },
    {
      "id": "WO-2024-013",
      "assetId": "AST-013",
      "assetName": "Generator CAT 3516B",
      "type": "planned",
      "priority": "High",
      "status": "completed",
      "title": "Annual Generator Overhaul",
      "description": "Complete annual service including engine overhaul, alternator service, control system calibration.",
      "requestedBy": "Chris Taylor",
      "assignedTo": "Power Systems Team",
      "createdDate": "2024-06-10T08:00:00Z",
      "scheduledStartDate": "2024-06-17T08:00:00Z",
      "scheduledEndDate": "2024-06-19T17:00:00Z",
      "actualStartDate": "2024-06-17T08:00:00Z",
      "actualEndDate": "2024-06-19T16:45:00Z",
      "estimatedCost": 15000.00,
      "actualCost": 14200.00,
      "maintenanceType": "Overhaul",
      "workCategory": "Power Generation",
      "location": "Power House 1"
    }
  ]

  // Computed properties for dashboard statistics
  const workOrderStats = computed(() => {
    const total = workOrders.value.length
    const completed = workOrders.value.filter(wo => wo.status === 'completed').length
    const inProgress = workOrders.value.filter(wo => wo.status === 'in-progress').length
    const scheduled = workOrders.value.filter(wo => wo.status === 'scheduled').length
    const pending = workOrders.value.filter(wo => wo.status === 'pending').length
    const planned = workOrders.value.filter(wo => wo.type === 'planned').length
    const unplanned = workOrders.value.filter(wo => wo.type === 'unplanned').length
    
    return {
      total,
      completed,
      inProgress,
      scheduled,
      pending,
      planned,
      unplanned,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
    }
  })

  const workOrdersByPriority = computed(() => {
    const priorities = ['Critical', 'High', 'Medium', 'Low']
    return priorities.map(priority => ({
      name: priority,
      value: workOrders.value.filter(wo => wo.priority === priority).length
    }))
  })

  const workOrdersByCategory = computed(() => {
    const categories = {}
    workOrders.value.forEach(wo => {
      if (categories[wo.workCategory]) {
        categories[wo.workCategory]++
      } else {
        categories[wo.workCategory] = 1
      }
    })
    
    return Object.entries(categories).map(([name, value]) => ({ name, value }))
  })

  const costAnalysis = computed(() => {
    const totalEstimated = workOrders.value.reduce((sum, wo) => sum + wo.estimatedCost, 0)
    const totalActual = workOrders.value.reduce((sum, wo) => sum + wo.actualCost, 0)
    const variance = totalEstimated - totalActual
    const variancePercentage = totalEstimated > 0 ? ((variance / totalEstimated) * 100) : 0
    
    return {
      totalEstimated,
      totalActual,
      variance,
      variancePercentage: Math.round(variancePercentage * 100) / 100
    }
  })

  // Actions
  const fetchWorkOrders = async () => {
    loading.value = true
    error.value = null
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      workOrders.value = mockWorkOrders
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  const getWorkOrderById = (id) => {
    return workOrders.value.find(wo => wo.id === id)
  }

  const getWorkOrdersByAsset = (assetId) => {
    return workOrders.value.filter(wo => wo.assetId === assetId)
  }

  return {
    workOrders,
    loading,
    error,
    workOrderStats,
    workOrdersByPriority,
    workOrdersByCategory,
    costAnalysis,
    fetchWorkOrders,
    getWorkOrderById,
    getWorkOrdersByAsset
  }
})
