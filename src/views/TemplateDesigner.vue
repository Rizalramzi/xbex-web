<template>
  <div class="container mx-auto px-4 py-6">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-primary">Template Designer</h1>
        <p class="text-muted mt-1">Design and manage maintenance templates and workflows</p>
      </div>
      <div class="flex items-center space-x-3">
        <button class="btn-primary">
          <MdiIcon :path="mdiPlus" :size="16" class="mr-2" />
          New Template
        </button>
      </div>
    </div>

    <!-- Template Categories -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      <!-- Maintenance Templates -->
      <div class="card-dark">
        <div class="px-6 py-4 border-b border-light">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-primary-light rounded-lg flex items-center justify-center">
              <MdiIcon :path="mdiWrench" :size="20" class="text-primary-color" />
            </div>
            <div>
              <h3 class="text-lg font-semibold text-primary">Maintenance Templates</h3>
              <p class="text-sm text-muted">Standard maintenance procedures</p>
            </div>
          </div>
        </div>
        <div class="p-6">
          <div class="space-y-3">
            <div v-for="template in maintenanceTemplates" :key="template.id" class="flex items-center justify-between p-3 bg-secondary-light rounded-lg hover:shadow-md transition-shadow cursor-pointer">
              <div class="flex-1">
                <h4 class="text-sm font-medium text-primary">{{ template.name }}</h4>
                <p class="text-xs text-muted">{{ template.description }}</p>
                <div class="flex items-center space-x-4 mt-2">
                  <span class="text-xs text-muted">{{ template.steps }} steps</span>
                  <span class="text-xs text-muted">{{ template.estimatedTime }}</span>
                </div>
              </div>
              <div class="flex items-center space-x-2">
                <button class="p-1 text-muted hover:text-primary">
                  <MdiIcon :path="mdiPencil" :size="16" />
                </button>
                <button class="p-1 text-muted hover:text-primary">
                  <MdiIcon :path="mdiContentCopy" :size="16" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Inspection Templates -->
      <div class="card-dark">
        <div class="px-6 py-4 border-b border-light">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-info-light rounded-lg flex items-center justify-center">
              <MdiIcon :path="mdiClipboardCheck" :size="20" class="text-info-color" />
            </div>
            <div>
              <h3 class="text-lg font-semibold text-primary">Inspection Templates</h3>
              <p class="text-sm text-muted">Equipment inspection checklists</p>
            </div>
          </div>
        </div>
        <div class="p-6">
          <div class="space-y-3">
            <div v-for="template in inspectionTemplates" :key="template.id" class="flex items-center justify-between p-3 bg-secondary-light rounded-lg hover:shadow-md transition-shadow cursor-pointer">
              <div class="flex-1">
                <h4 class="text-sm font-medium text-primary">{{ template.name }}</h4>
                <p class="text-xs text-muted">{{ template.description }}</p>
                <div class="flex items-center space-x-4 mt-2">
                  <span class="text-xs text-muted">{{ template.checkpoints }} checkpoints</span>
                  <span class="text-xs text-muted">{{ template.frequency }}</span>
                </div>
              </div>
              <div class="flex items-center space-x-2">
                <button class="p-1 text-muted hover:text-primary">
                  <MdiIcon :path="mdiPencil" :size="16" />
                </button>
                <button class="p-1 text-muted hover:text-primary">
                  <MdiIcon :path="mdiContentCopy" :size="16" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Work Order Templates -->
      <div class="card-dark">
        <div class="px-6 py-4 border-b border-light">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-success-light rounded-lg flex items-center justify-center">
              <MdiIcon :path="mdiClipboardList" :size="20" class="text-success-color" />
            </div>
            <div>
              <h3 class="text-lg font-semibold text-primary">Work Order Templates</h3>
              <p class="text-sm text-muted">Pre-configured work orders</p>
            </div>
          </div>
        </div>
        <div class="p-6">
          <div class="space-y-3">
            <div v-for="template in workOrderTemplates" :key="template.id" class="flex items-center justify-between p-3 bg-secondary-light rounded-lg hover:shadow-md transition-shadow cursor-pointer">
              <div class="flex-1">
                <h4 class="text-sm font-medium text-primary">{{ template.name }}</h4>
                <p class="text-xs text-muted">{{ template.description }}</p>
                <div class="flex items-center space-x-4 mt-2">
                  <span class="text-xs text-muted">{{ template.priority }}</span>
                  <span class="text-xs text-muted">{{ template.category }}</span>
                </div>
              </div>
              <div class="flex items-center space-x-2">
                <button class="p-1 text-muted hover:text-primary">
                  <MdiIcon :path="mdiPencil" :size="16" />
                </button>
                <button class="p-1 text-muted hover:text-primary">
                  <MdiIcon :path="mdiContentCopy" :size="16" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Template Builder -->
    <div class="card-dark">
      <div class="px-6 py-4 border-b border-light">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-semibold text-primary">Template Builder</h3>
            <p class="text-sm text-muted mt-1">Drag and drop to create custom templates</p>
          </div>
          <div class="flex items-center space-x-3">
            <button class="btn-secondary">
              <MdiIcon :path="mdiImport" :size="16" class="mr-2" />
              Import
            </button>
            <button class="btn-secondary">
              <MdiIcon :path="mdiExport" :size="16" class="mr-2" />
              Export
            </button>
          </div>
        </div>
      </div>
      <div class="p-6">
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <!-- Component Library -->
          <div class="lg:col-span-1">
            <h4 class="text-md font-semibold text-primary mb-4">Components</h4>
            <div class="space-y-2">
              <div v-for="component in templateComponents" :key="component.id" class="p-3 bg-secondary-light rounded-lg border-2 border-dashed border-gray-300 hover:border-primary transition-colors cursor-grab">
                <div class="flex items-center space-x-3">
                  <MdiIcon :path="component.icon" :size="16" class="text-primary-color" />
                  <span class="text-sm font-medium text-primary">{{ component.name }}</span>
                </div>
                <p class="text-xs text-muted mt-1">{{ component.description }}</p>
              </div>
            </div>
          </div>

          <!-- Template Canvas -->
          <div class="lg:col-span-3">
            <div class="bg-secondary-light rounded-lg border-2 border-dashed border-gray-300 p-6 min-h-96">
              <div class="text-center text-muted">
                <MdiIcon :path="mdiDrag" :size="48" class="mx-auto mb-4 opacity-50" />
                <p class="text-lg">Drag components here to build your template</p>
                <p class="text-sm mt-2">Start by dragging a component from the library</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import MdiIcon from '../components/MdiIcon.vue'
import {
  mdiPlus,
  mdiWrench,
  mdiClipboardCheck,
  mdiClipboardList,
  mdiPencil,
  mdiContentCopy,
  mdiImport,
  mdiExport,
  mdiDrag,
  mdiTextBox,
  mdiCheckbox,
  mdiRadiobox,
  mdiNumeric,
  mdiImageMultiple,
  mdiClockOutline
} from '@mdi/js'

// Sample data for maintenance templates
const maintenanceTemplates = ref([
  {
    id: 1,
    name: 'Excavator Daily Check',
    description: 'Daily maintenance checklist for excavators',
    steps: 12,
    estimatedTime: '45 min'
  },
  {
    id: 2,
    name: 'Truck Oil Change',
    description: 'Standard oil change procedure for dump trucks',
    steps: 8,
    estimatedTime: '2 hours'
  },
  {
    id: 3,
    name: 'Crusher Belt Inspection',
    description: 'Weekly belt inspection for crushers',
    steps: 6,
    estimatedTime: '30 min'
  }
])

// Sample data for inspection templates
const inspectionTemplates = ref([
  {
    id: 1,
    name: 'Equipment Safety Check',
    description: 'Pre-operation safety inspection',
    checkpoints: 15,
    frequency: 'Daily'
  },
  {
    id: 2,
    name: 'Hydraulic System Inspection',
    description: 'Comprehensive hydraulic system check',
    checkpoints: 10,
    frequency: 'Weekly'
  },
  {
    id: 3,
    name: 'Engine Performance Check',
    description: 'Engine performance and emissions check',
    checkpoints: 8,
    frequency: 'Monthly'
  }
])

// Sample data for work order templates
const workOrderTemplates = ref([
  {
    id: 1,
    name: 'Emergency Repair',
    description: 'Template for urgent equipment failures',
    priority: 'Critical',
    category: 'Corrective'
  },
  {
    id: 2,
    name: 'Preventive Maintenance',
    description: 'Standard preventive maintenance work order',
    priority: 'Medium',
    category: 'Preventive'
  },
  {
    id: 3,
    name: 'Parts Replacement',
    description: 'Template for scheduled parts replacement',
    priority: 'Low',
    category: 'Scheduled'
  }
])

// Template building components
const templateComponents = ref([
  {
    id: 1,
    name: 'Text Field',
    description: 'Single line text input',
    icon: mdiTextBox
  },
  {
    id: 2,
    name: 'Checkbox',
    description: 'Yes/No checkbox input',
    icon: mdiCheckbox
  },
  {
    id: 3,
    name: 'Radio Button',
    description: 'Multiple choice selection',
    icon: mdiRadiobox
  },
  {
    id: 4,
    name: 'Number Input',
    description: 'Numeric value input',
    icon: mdiNumeric
  },
  {
    id: 5,
    name: 'Image Upload',
    description: 'Image attachment field',
    icon: mdiImageMultiple
  },
  {
    id: 6,
    name: 'Time Tracker',
    description: 'Time duration tracker',
    icon: mdiClockOutline
  }
])
</script>
