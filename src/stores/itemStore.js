import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useItemStore = defineStore('item', () => {
  const items = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Mock data for item availability
  const mockItems = [
    {
      "id": "ITEM-001",
      "itemCode": "OIL-15W40-20L",
      "itemName": "Engine Oil 15W-40",
      "category": "Lubricants",
      "stockStatus": "available",
      "availableQuantity": 180,
      "minimumStock": 50,
      "unitCost": 15.50
    },
    {
      "id": "ITEM-002",
      "itemCode": "FILTER-OIL-CAT390F",
      "itemName": "Oil Filter CAT 390F",
      "category": "Filters",
      "stockStatus": "available",
      "availableQuantity": 25,
      "minimumStock": 5,
      "unitCost": 85.00
    },
    {
      "id": "ITEM-003",
      "itemCode": "GASKET-DRAIN-M14",
      "itemName": "Drain Plug Gasket M14",
      "category": "Gaskets & Seals",
      "stockStatus": "available",
      "availableQuantity": 150,
      "minimumStock": 50,
      "unitCost": 2.50
    },
    {
      "id": "ITEM-004",
      "itemCode": "FLUID-HYD-AW68",
      "itemName": "Hydraulic Fluid AW68",
      "category": "Hydraulic Fluids",
      "stockStatus": "available",
      "availableQuantity": 95,
      "minimumStock": 30,
      "unitCost": 18.75
    },
    {
      "id": "ITEM-005",
      "itemCode": "SOLENOID-TRANS-CAT773G",
      "itemName": "Transmission Solenoid CAT 773G",
      "category": "Electronic Components",
      "stockStatus": "available",
      "availableQuantity": 3,
      "minimumStock": 2,
      "unitCost": 450.00
    },
    {
      "id": "ITEM-006",
      "itemCode": "FLUID-TRANS-ATF",
      "itemName": "Automatic Transmission Fluid",
      "category": "Transmission Fluids",
      "stockStatus": "available",
      "availableQuantity": 120,
      "minimumStock": 40,
      "unitCost": 22.00
    },
    {
      "id": "ITEM-007",
      "itemCode": "FILTER-TRANS-CAT773G",
      "itemName": "Transmission Filter CAT 773G",
      "category": "Filters",
      "stockStatus": "available",
      "availableQuantity": 8,
      "minimumStock": 3,
      "unitCost": 125.00
    },
    {
      "id": "ITEM-008",
      "itemCode": "BLADE-EDGE-D8T",
      "itemName": "Cutting Edge CAT D8T",
      "category": "Wear Parts",
      "stockStatus": "available",
      "availableQuantity": 4,
      "minimumStock": 2,
      "unitCost": 280.00
    },
    {
      "id": "ITEM-009",
      "itemCode": "BOLT-GRADE8-M20X80",
      "itemName": "Grade 8 Bolt M20x80",
      "category": "Fasteners",
      "stockStatus": "available",
      "availableQuantity": 200,
      "minimumStock": 50,
      "unitCost": 12.50
    },
    {
      "id": "ITEM-010",
      "itemCode": "HOSE-HYD-3/4-2M",
      "itemName": "Hydraulic Hose 3/4 inch 2 meter",
      "category": "Hoses",
      "stockStatus": "on_order",
      "availableQuantity": 0,
      "minimumStock": 5,
      "unitCost": 85.00
    },
    {
      "id": "ITEM-011",
      "itemCode": "DRILL-BIT-270MM",
      "itemName": "Drill Bit 270mm Tungsten Carbide",
      "category": "Drilling Tools",
      "stockStatus": "available",
      "availableQuantity": 12,
      "minimumStock": 6,
      "unitCost": 1250.00
    },
    {
      "id": "ITEM-012",
      "itemCode": "SEAL-KIT-BOOM-CYL",
      "itemName": "Boom Cylinder Seal Kit",
      "category": "Seal Kits",
      "stockStatus": "fulfillment",
      "availableQuantity": 0,
      "minimumStock": 2,
      "unitCost": 185.00
    },
    {
      "id": "ITEM-013",
      "itemCode": "OIL-5W30-5L",
      "itemName": "Engine Oil 5W-30",
      "category": "Lubricants",
      "stockStatus": "available",
      "availableQuantity": 60,
      "minimumStock": 20,
      "unitCost": 12.00
    },
    {
      "id": "ITEM-014",
      "itemCode": "FILTER-OIL-VOLVO-FMX",
      "itemName": "Oil Filter Volvo FMX",
      "category": "Filters",
      "stockStatus": "available",
      "availableQuantity": 15,
      "minimumStock": 5,
      "unitCost": 45.00
    },
    {
      "id": "ITEM-015",
      "itemCode": "DYE-LEAK-DETECT",
      "itemName": "Hydraulic Leak Detection Dye",
      "category": "Diagnostic Supplies",
      "stockStatus": "available",
      "availableQuantity": 8,
      "minimumStock": 3,
      "unitCost": 35.00
    }
  ]

  // Computed properties for dashboard statistics
  const itemStats = computed(() => {
    const total = items.value.length
    const available = items.value.filter(item => item.stockStatus === 'available').length
    const lowStock = items.value.filter(item => 
      item.stockStatus === 'available' && item.availableQuantity <= item.minimumStock
    ).length
    const outOfStock = items.value.filter(item => 
      item.stockStatus === 'on_order' || item.availableQuantity === 0
    ).length
    const inFulfillment = items.value.filter(item => item.stockStatus === 'fulfillment').length
    
    return {
      total,
      available,
      lowStock,
      outOfStock,
      inFulfillment,
      availabilityRate: total > 0 ? Math.round((available / total) * 100) : 0
    }
  })

  const itemsByCategory = computed(() => {
    const categories = {}
    items.value.forEach(item => {
      if (categories[item.category]) {
        categories[item.category]++
      } else {
        categories[item.category] = 1
      }
    })
    
    return Object.entries(categories).map(([name, value]) => ({ name, value }))
  })

  const stockStatusDistribution = computed(() => {
    const statusMap = {
      'available': 'Available',
      'on_order': 'On Order',
      'fulfillment': 'In Fulfillment'
    }
    
    const distribution = {}
    items.value.forEach(item => {
      const status = statusMap[item.stockStatus] || item.stockStatus
      if (distribution[status]) {
        distribution[status]++
      } else {
        distribution[status] = 1
      }
    })
    
    return Object.entries(distribution).map(([name, value]) => ({ name, value }))
  })

  const inventoryValue = computed(() => {
    const totalValue = items.value.reduce((sum, item) => 
      sum + (item.availableQuantity * item.unitCost), 0
    )
    
    const lowStockValue = items.value
      .filter(item => item.availableQuantity <= item.minimumStock)
      .reduce((sum, item) => sum + (item.availableQuantity * item.unitCost), 0)
    
    return {
      total: Math.round(totalValue * 100) / 100,
      lowStock: Math.round(lowStockValue * 100) / 100
    }
  })

  // Actions
  const fetchItems = async () => {
    loading.value = true
    error.value = null
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300))
      items.value = mockItems
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  const getItemById = (id) => {
    return items.value.find(item => item.id === id)
  }

  const getItemsByCategory = (category) => {
    return items.value.filter(item => item.category === category)
  }

  const getLowStockItems = () => {
    return items.value.filter(item => 
      item.stockStatus === 'available' && item.availableQuantity <= item.minimumStock
    )
  }

  return {
    items,
    loading,
    error,
    itemStats,
    itemsByCategory,
    stockStatusDistribution,
    inventoryValue,
    fetchItems,
    getItemById,
    getItemsByCategory,
    getLowStockItems
  }
})
