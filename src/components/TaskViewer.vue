<template>
  <div class="fixed inset-0 z-50 overflow-y-auto bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
    <div class="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-full overflow-hidden flex flex-col">
      <!-- Header -->
      <div class="bg-petrosea-primary text-white px-6 py-4 flex-shrink-0">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-xl font-semibold">{{ task.title }}</h2>
            <p class="text-petrosea-primary-light text-sm">{{ task.id }} - {{ task.workOrderId }}</p>
          </div>
          <button
            @click="$emit('close')"
            class="text-white hover:text-gray-200 transition-colors duration-200"
            title="Close"
          >
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Content -->
      <div class="flex-1 overflow-y-auto p-6">
        <!-- Task Information Section -->
        <div class="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <svg class="h-5 w-5 mr-2 text-petrosea-primary" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
            </svg>
            Task Information
          </h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <!-- Basic Info -->
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Task ID</label>
                <div class="text-sm text-gray-900 bg-white px-3 py-2 rounded border">{{ task.id }}</div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Work Order</label>
                <div class="text-sm text-gray-900 bg-white px-3 py-2 rounded border">{{ task.workOrderId }}</div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <div class="text-sm text-gray-900 bg-white px-3 py-2 rounded border capitalize">{{ task.type }}</div>
              </div>
            </div>

            <!-- Status & Priority -->
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <div class="flex items-center">
                  <span :class="getStatusBadgeClass(task.status)" class="inline-flex px-3 py-1 text-sm font-semibold rounded-full">
                    {{ getStatusLabel(task.status) }}
                  </span>
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <div class="flex items-center">
                  <span :class="getPriorityBadgeClass(task.priority)" class="inline-flex px-3 py-1 text-sm font-semibold rounded-full">
                    {{ task.priority }}
                  </span>
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Progress</label>
                <div class="flex items-center space-x-3">
                  <div class="flex-1 bg-gray-200 rounded-full h-3">
                    <div 
                      :class="getCompletionBarClass(task.progressPercentage)"
                      class="h-3 rounded-full transition-all duration-300"
                      :style="{ width: task.progressPercentage + '%' }"
                    ></div>
                  </div>
                  <span class="text-sm font-medium text-gray-900 min-w-[3rem]">{{ task.progressPercentage }}%</span>
                </div>
              </div>
            </div>

            <!-- Assignment & Duration -->
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Assigned To</label>
                <div class="text-sm text-gray-900 bg-white px-3 py-2 rounded border">{{ task.assignedTo }}</div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Estimated Duration</label>
                <div class="text-sm text-gray-900 bg-white px-3 py-2 rounded border">{{ task.estimatedDuration }} minutes</div>
              </div>
              
              <div v-if="task.actualDuration">
                <label class="block text-sm font-medium text-gray-700 mb-1">Actual Duration</label>
                <div class="text-sm text-gray-900 bg-white px-3 py-2 rounded border">{{ task.actualDuration }} minutes</div>
              </div>
            </div>
          </div>

          <!-- Description -->
          <div class="mt-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <div class="text-sm text-gray-900 bg-white px-4 py-3 rounded border">{{ task.description }}</div>
          </div>

          <!-- Instructions -->
          <div v-if="task.instructions && task.instructions.length > 0" class="mt-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">Instructions</label>
            <div class="bg-white rounded border">
              <ol class="list-decimal list-inside space-y-2 p-4">
                <li v-for="instruction in task.instructions" :key="instruction" class="text-sm text-gray-900">
                  {{ instruction }}
                </li>
              </ol>
            </div>
          </div>

          <!-- Safety Requirements -->
          <div v-if="task.safetyRequirements && task.safetyRequirements.length > 0" class="mt-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">Safety Requirements</label>
            <div class="bg-red-50 rounded border border-red-200">
              <ul class="list-disc list-inside space-y-2 p-4">
                <li v-for="requirement in task.safetyRequirements" :key="requirement" class="text-sm text-red-800">
                  {{ requirement }}
                </li>
              </ul>
            </div>
          </div>

          <!-- Tools Required -->
          <div v-if="task.toolsRequired && task.toolsRequired.length > 0" class="mt-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">Tools Required</label>
            <div class="bg-white rounded border p-4">
              <div class="flex flex-wrap gap-2">
                <span v-for="tool in task.toolsRequired" :key="tool" 
                      class="inline-flex px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                  {{ tool }}
                </span>
              </div>
            </div>
          </div>

          <!-- Feedback -->
          <div v-if="task.feedback" class="mt-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">Feedback</label>
            <div class="text-sm text-gray-900 bg-white px-4 py-3 rounded border">{{ task.feedback }}</div>
          </div>
        </div>

        <!-- Questionnaire Section -->
        <div class="bg-blue-50 rounded-lg p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <svg class="h-5 w-5 mr-2 text-petrosea-primary" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9,5A4,4 0 0,1 13,9A4,4 0 0,1 9,13A4,4 0 0,1 5,9A4,4 0 0,1 9,5M9,15C11.67,15 17,16.34 17,19V21H1V19C1,16.34 6.33,15 9,15M16.76,5.36C18.78,7.56 18.78,10.61 16.76,12.63L15.08,10.94C15.92,9.76 15.92,8.23 15.08,7.05L16.76,5.36M20.07,2C24,6.05 23.97,12.11 20.07,16L18.44,14.37C21.21,11.19 21.21,6.65 18.44,3.63L20.07,2Z" />
            </svg>
            Task Inspection Questionnaire
          </h3>
          
          <div class="space-y-6">
            <!-- Question 1: Free Text -->
            <div class="bg-white rounded-lg p-4 border border-blue-200">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                1. Describe any unusual observations or conditions encountered during this task:
              </label>
              <div class="bg-gray-50 px-3 py-2 rounded border text-sm text-gray-900 min-h-[60px]">
                {{ getQuestionnaireAnswer('observations', task) }}
              </div>
            </div>

            <!-- Question 2: Multiple Choice -->
            <div class="bg-white rounded-lg p-4 border border-blue-200">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                2. Equipment condition after maintenance:
              </label>
              <div class="space-y-2">
                <div v-for="option in equipmentConditionOptions" :key="option.value" class="flex items-center">
                  <div :class="getQuestionnaireAnswer('equipment_condition', task) === option.value ? 'bg-petrosea-primary border-petrosea-primary' : 'bg-white border-gray-300'" 
                       class="h-4 w-4 rounded-full border flex items-center justify-center mr-3">
                    <div v-if="getQuestionnaireAnswer('equipment_condition', task) === option.value" 
                         class="h-2 w-2 rounded-full bg-white"></div>
                  </div>
                  <span class="text-sm text-gray-900">{{ option.label }}</span>
                </div>
              </div>
            </div>

            <!-- Question 3: Number -->
            <div class="bg-white rounded-lg p-4 border border-blue-200">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                3. {{ getNumberQuestionText(task.type) }}
              </label>
              <div class="bg-gray-50 px-3 py-2 rounded border text-sm text-gray-900 w-32">
                {{ getQuestionnaireAnswer('measurement_value', task) }} {{ getNumberQuestionUnit(task.type) }}
              </div>
            </div>

            <!-- Question 4: Date -->
            <div class="bg-white rounded-lg p-4 border border-blue-200">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                4. Next recommended maintenance date:
              </label>
              <div class="bg-gray-50 px-3 py-2 rounded border text-sm text-gray-900 w-48">
                {{ formatDate(getQuestionnaireAnswer('next_maintenance_date', task)) }}
              </div>
            </div>

            <!-- Question 5: Exclusive Choice -->
            <div class="bg-white rounded-lg p-4 border border-blue-200">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                5. Overall task completion status:
              </label>
              <div class="space-y-2">
                <div v-for="option in completionStatusOptions" :key="option.value" class="flex items-center">
                  <div :class="getQuestionnaireAnswer('completion_status', task) === option.value ? 'bg-petrosea-primary border-petrosea-primary' : 'bg-white border-gray-300'" 
                       class="h-4 w-4 rounded border flex items-center justify-center mr-3">
                    <svg v-if="getQuestionnaireAnswer('completion_status', task) === option.value" 
                         class="h-3 w-3 text-white fill-current" viewBox="0 0 24 24">
                      <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" />
                    </svg>
                  </div>
                  <span class="text-sm text-gray-900">{{ option.label }}</span>
                </div>
              </div>
            </div>

            <!-- Question 6: Free Text - Additional Comments -->
            <div class="bg-white rounded-lg p-4 border border-blue-200">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                6. Additional comments or recommendations:
              </label>
              <div class="bg-gray-50 px-3 py-2 rounded border text-sm text-gray-900 min-h-[60px]">
                {{ getQuestionnaireAnswer('additional_comments', task) }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="bg-gray-50 px-6 py-4 flex-shrink-0 border-t border-gray-200">
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-600">
            Created: {{ formatDateTime(task.expectedStartTime) }} | 
            Last Updated: {{ formatDateTime(task.actualEndTime || task.expectedEndTime) }}
          </div>
          <button
            @click="$emit('close')"
            class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors duration-200 flex items-center"
          >
            <svg class="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z" />
            </svg>
            Back to Tasks
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  task: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close'])

// Options for questionnaire
const equipmentConditionOptions = [
  { value: 'excellent', label: 'Excellent - Equipment in perfect working condition' },
  { value: 'good', label: 'Good - Minor wear but functioning well' },
  { value: 'fair', label: 'Fair - Some issues noted, monitoring required' },
  { value: 'poor', label: 'Poor - Immediate attention needed' }
]

const completionStatusOptions = [
  { value: 'fully_completed', label: 'Fully Completed - All tasks performed as planned' },
  { value: 'completed_with_issues', label: 'Completed with Issues - Task done but problems noted' },
  { value: 'partially_completed', label: 'Partially Completed - Some tasks remaining' },
  { value: 'requires_followup', label: 'Requires Follow-up - Additional work needed' }
]

// Generate realistic answers based on task data
const getQuestionnaireAnswer = (questionType, task) => {
  switch (questionType) {
    case 'observations':
      if (task.feedback) {
        return task.feedback
      }
      return generateObservationAnswer(task)
      
    case 'equipment_condition':
      if (task.status === 'completed' && task.progressPercentage >= 100) {
        return Math.random() > 0.7 ? 'excellent' : 'good'
      } else if (task.status === 'in-progress') {
        return 'fair'
      }
      return 'good'
      
    case 'measurement_value':
      return generateMeasurementValue(task.type)
      
    case 'next_maintenance_date':
      const baseDate = new Date(task.expectedEndTime || task.actualEndTime || Date.now())
      const daysToAdd = task.type === 'maintenance' ? 90 : 180 // 3 months for maintenance, 6 for inspection
      baseDate.setDate(baseDate.getDate() + daysToAdd)
      return baseDate.toISOString()
      
    case 'completion_status':
      if (task.status === 'completed' && task.progressPercentage >= 100) {
        return 'fully_completed'
      } else if (task.status === 'in-progress') {
        return 'partially_completed'
      }
      return 'completed_with_issues'
      
    case 'additional_comments':
      return generateAdditionalComments(task)
      
    default:
      return 'N/A'
  }
}

const generateObservationAnswer = (task) => {
  const observations = [
    'All components inspected and found to be within acceptable parameters.',
    'Minor wear observed on moving parts, scheduled for monitoring.',
    'Equipment responded well to maintenance procedures.',
    'No unusual noises or vibrations detected during operation test.',
    'All safety protocols were followed throughout the procedure.'
  ]
  return observations[Math.floor(Math.random() * observations.length)]
}

const generateMeasurementValue = (taskType) => {
  switch (taskType) {
    case 'maintenance':
      return Math.floor(Math.random() * 50) + 320 // Pressure: 320-370 bar
    case 'inspection':
      return Math.floor(Math.random() * 20) + 85 // Temperature: 85-105°C
    default:
      return Math.floor(Math.random() * 100) + 1
  }
}

const generateAdditionalComments = (task) => {
  const comments = [
    'Task completed according to standard operating procedures. Equipment ready for service.',
    'Recommend increasing inspection frequency for this component type.',
    'All documentation updated in maintenance management system.',
    'No additional parts or materials required at this time.',
    'Equipment performance meets manufacturer specifications.'
  ]
  return comments[Math.floor(Math.random() * comments.length)]
}

const getNumberQuestionText = (taskType) => {
  switch (taskType) {
    case 'maintenance':
      return 'Hydraulic system pressure reading:'
    case 'inspection':
      return 'Operating temperature recorded:'
    default:
      return 'Measurement value:'
  }
}

const getNumberQuestionUnit = (taskType) => {
  switch (taskType) {
    case 'maintenance':
      return 'bar'
    case 'inspection':
      return '°C'
    default:
      return 'units'
  }
}

// Utility methods
const getStatusBadgeClass = (status) => {
  const baseClass = 'inline-flex px-3 py-1 text-sm font-semibold rounded-full'
  switch (status) {
    case 'completed':
      return `${baseClass} bg-green-100 text-green-800`
    case 'in-progress':
      return `${baseClass} bg-blue-100 text-blue-800`
    case 'pending':
      return `${baseClass} bg-yellow-100 text-yellow-800`
    case 'on-hold':
      return `${baseClass} bg-orange-100 text-orange-800`
    default:
      return `${baseClass} bg-gray-100 text-gray-800`
  }
}

const getPriorityBadgeClass = (priority) => {
  const baseClass = 'inline-flex px-3 py-1 text-sm font-semibold rounded-full'
  switch (priority) {
    case 'Critical':
      return `${baseClass} bg-red-100 text-red-800`
    case 'High':
      return `${baseClass} bg-orange-100 text-orange-800`
    case 'Medium':
      return `${baseClass} bg-yellow-100 text-yellow-800`
    case 'Low':
      return `${baseClass} bg-green-100 text-green-800`
    default:
      return `${baseClass} bg-gray-100 text-gray-800`
  }
}

const getCompletionBarClass = (percentage) => {
  if (percentage >= 100) return 'bg-green-500'
  if (percentage >= 75) return 'bg-blue-500'
  if (percentage >= 50) return 'bg-yellow-500'
  if (percentage >= 25) return 'bg-orange-500'
  return 'bg-red-500'
}

const getStatusLabel = (status) => {
  const labels = {
    'completed': 'Completed',
    'in-progress': 'In Progress',
    'pending': 'Pending',
    'on-hold': 'On Hold'
  }
  return labels[status] || status
}

const formatDate = (dateString) => {
  if (!dateString) return 'Not specified'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatDateTime = (dateString) => {
  if (!dateString) return 'Not specified'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>
