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
        <div class="flex-1">
          <h1 class="text-xl font-bold text-primary">{{ task?.title || 'Task Details' }}</h1>
          <p class="text-sm text-muted">{{ workOrderId }} - {{ task?.id || 'Loading...' }}</p>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>

      <!-- Task Not Found -->
      <div v-else-if="!task" class="text-center py-20">
        <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <MdiIcon :path="mdiAlertCircle" :size="32" class="text-gray-400" />
        </div>
        <h3 class="text-lg font-semibold text-gray-600 mb-2">Task Not Found</h3>
        <p class="text-gray-500 mb-4">The requested task could not be found.</p>
        <button 
          @click="goBack"
          class="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          Go Back
        </button>
      </div>

      <!-- Task Details -->
      <div v-else class="space-y-6">
        <!-- Task Status and Progress -->
        <div class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div class="flex items-center justify-between mb-3">
            <h2 class="text-lg font-bold text-primary">{{ task.title }}</h2>
            <span :class="getTaskStatusClass(task.status)" class="px-3 py-1 text-xs font-medium rounded-full">
              {{ formatStatus(task.status) }}
            </span>
          </div>
          <div class="flex items-center justify-between mb-4">
            <span :class="getPriorityClass(task.priority)" class="px-3 py-1 text-sm font-medium rounded-full">
              {{ task.priority }} Priority
            </span>
            <span class="text-sm text-muted">Assigned to: {{ task.assignedTo }}</span>
          </div>
          
          <!-- Progress Bar -->
          <div class="mb-3">
            <div class="flex items-center justify-between text-sm mb-1">
              <span class="font-medium text-gray-700">Progress</span>
              <span class="font-bold text-primary">{{ task.progress }}%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div 
                :class="getProgressBarClass(task.status)"
                class="h-2 rounded-full transition-all duration-500"
                :style="{ width: task.progress + '%' }"
              ></div>
            </div>
          </div>
        </div>

        <!-- Task Information -->
        <div class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h3 class="text-lg font-semibold text-primary mb-3 flex items-center">
            <MdiIcon :path="mdiClipboardText" :size="20" class="text-primary mr-2" />
            Task Information
          </h3>
          <div class="space-y-4">
            <div>
              <label class="text-xs font-medium text-gray-500 uppercase tracking-wide">Description</label>
              <p class="text-sm text-gray-900 mt-1 leading-relaxed">{{ task.description }}</p>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="text-xs font-medium text-gray-500 uppercase tracking-wide">Category</label>
                <p class="text-sm font-medium text-gray-900">{{ task.category }}</p>
              </div>
              <div>
                <label class="text-xs font-medium text-gray-500 uppercase tracking-wide">Estimated Duration</label>
                <p class="text-sm font-medium text-gray-900">{{ task.estimatedDuration }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Schedule and Timeline -->
        <div class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h3 class="text-lg font-semibold text-primary mb-3 flex items-center">
            <MdiIcon :path="mdiCalendarClock" :size="20" class="text-primary mr-2" />
            Schedule & Timeline
          </h3>
          <div class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="text-xs font-medium text-gray-500 uppercase tracking-wide">Created Date</label>
                <p class="text-sm font-medium text-gray-900">{{ formatDate(task.createdDate) }}</p>
              </div>
              <div v-if="task.scheduledStartDate">
                <label class="text-xs font-medium text-gray-500 uppercase tracking-wide">Scheduled Start</label>
                <p class="text-sm font-medium text-gray-900">{{ formatDate(task.scheduledStartDate) }}</p>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4" v-if="task.scheduledEndDate || task.actualStartDate">
              <div v-if="task.scheduledEndDate">
                <label class="text-xs font-medium text-gray-500 uppercase tracking-wide">Scheduled End</label>
                <p class="text-sm font-medium text-gray-900">{{ formatDate(task.scheduledEndDate) }}</p>
              </div>
              <div v-if="task.actualStartDate">
                <label class="text-xs font-medium text-gray-500 uppercase tracking-wide">Actual Start</label>
                <p class="text-sm font-medium text-gray-900">{{ formatDate(task.actualStartDate) }}</p>
              </div>
            </div>
            <div v-if="task.actualEndDate">
              <div>
                <label class="text-xs font-medium text-gray-500 uppercase tracking-wide">Actual End</label>
                <p class="text-sm font-medium text-gray-900">{{ formatDate(task.actualEndDate) }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Task Instructions -->
        <div class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h3 class="text-lg font-semibold text-primary mb-3 flex items-center">
            <MdiIcon :path="mdiFormatListBulleted" :size="20" class="text-primary mr-2" />
            Instructions
          </h3>
          <div class="space-y-3">
            <div v-for="(instruction, index) in task.instructions" :key="index" class="flex items-start space-x-3">
              <div class="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span class="text-white text-xs font-medium">{{ index + 1 }}</span>
              </div>
              <p class="text-sm text-gray-900 leading-relaxed">{{ instruction }}</p>
            </div>
          </div>
        </div>

        <!-- Required Materials -->
        <div class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h3 class="text-lg font-semibold text-primary mb-3 flex items-center">
            <MdiIcon :path="mdiPackageVariant" :size="20" class="text-primary mr-2" />
            Required Materials
          </h3>
          <div class="space-y-3">
            <div v-for="material in task.materials" :key="material.id" class="border border-gray-200 rounded-lg p-3">
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

        <!-- Task Notes -->
        <div class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h3 class="text-lg font-semibold text-primary mb-3 flex items-center">
            <MdiIcon :path="mdiNoteText" :size="20" class="text-primary mr-2" />
            Notes & Comments
          </h3>
          <div class="space-y-3">
            <div v-for="note in task.notes" :key="note.id" class="border-l-4 border-blue-500 bg-blue-50 p-3 rounded-r-lg">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-medium text-gray-900">{{ note.author }}</span>
                <span class="text-xs text-gray-500">{{ formatDate(note.createdDate) }}</span>
              </div>
              <p class="text-sm text-gray-700">{{ note.content }}</p>
            </div>
          </div>
        </div>

        <!-- Task Questionnaire -->
        <div class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h3 class="text-lg font-semibold text-primary mb-2 flex items-center">
            <MdiIcon :path="mdiClipboardCheck" :size="18" class="text-primary mr-2" />
            Task Questionnaire
            <span v-if="task.status === 'completed'" class="ml-2 px-1.5 py-0.5 text-xs bg-green-100 text-green-800 rounded">
              Completed
            </span>
            <span v-else-if="isQuestionnaireComplete" class="ml-2 px-1.5 py-0.5 text-xs bg-blue-100 text-blue-800 rounded">
              Ready
            </span>
          </h3>
          
          <div v-if="!task.questionnaire || task.questionnaire.length === 0" class="text-center py-6">
            <div class="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <MdiIcon :path="mdiClipboardCheck" :size="16" class="text-gray-400" />
            </div>
            <p class="text-gray-500 text-sm">No questionnaire available for this task.</p>
          </div>
          
          <div v-else class="space-y-2">
            <div v-for="(question, index) in task.questionnaire" :key="question.id" 
                 class="p-2"
                 :class="{ 'bg-red-50 rounded-md': question.required && !question.answer }">
              <div class="mb-1">
                <label class="text-sm font-medium text-gray-900 mb-1 block">
                  {{ index + 1 }}. {{ question.question }}
                  <span v-if="question.required" class="text-red-500">*</span>
                </label>
                
                <!-- Text Input -->
                <div v-if="question.type === 'text'">
                  <input
                    v-model="question.answer"
                    :disabled="task.status === 'completed'"
                    type="text"
                    :placeholder="question.placeholder"
                    class="w-full p-2 border border-gray-300 rounded-md text-sm transition-colors"
                    :class="task.status === 'completed' ? 'bg-gray-100 text-gray-600' : 'bg-white focus:border-primary focus:ring-1 focus:ring-primary/20'"
                  >
                </div>
                
                <!-- Textarea -->
                <div v-else-if="question.type === 'textarea'">
                  <textarea
                    v-model="question.answer"
                    :disabled="task.status === 'completed'"
                    :placeholder="question.placeholder"
                    rows="2"
                    class="w-full p-2 border border-gray-300 rounded-md text-sm resize-none transition-colors"
                    :class="task.status === 'completed' ? 'bg-gray-100 text-gray-600' : 'bg-white focus:border-primary focus:ring-1 focus:ring-primary/20'"
                  ></textarea>
                </div>
                
                <!-- Number Input -->
                <div v-else-if="question.type === 'number'">
                  <input
                    v-model="question.answer"
                    :disabled="task.status === 'completed'"
                    type="number"
                    :placeholder="question.placeholder"
                    :min="question.min"
                    :max="question.max"
                    :step="question.step"
                    class="w-full p-2 border border-gray-300 rounded-md text-sm transition-colors"
                    :class="task.status === 'completed' ? 'bg-gray-100 text-gray-600' : 'bg-white focus:border-primary focus:ring-1 focus:ring-primary/20'"
                  >
                  <p v-if="question.unit" class="text-xs text-gray-500 mt-1">Unit: {{ question.unit }}</p>
                </div>
                
                <!-- Multiple Choice -->
                <div v-else-if="question.type === 'radio'">
                  <div class="space-y-0.5">
                    <label v-for="option in question.options" :key="option.value" 
                           class="flex items-center p-1 rounded-md transition-colors cursor-pointer"
                           :class="task.status === 'completed' ? 'bg-gray-50' : 'hover:bg-gray-50'">
                      <input
                        v-model="question.answer"
                        :disabled="task.status === 'completed'"
                        type="radio"
                        :value="option.value"
                        class="mr-2 text-primary focus:ring-primary"
                        :class="task.status === 'completed' ? 'opacity-50' : ''"
                      >
                      <span class="text-sm" :class="task.status === 'completed' ? 'text-gray-600' : 'text-gray-900'">
                        {{ option.label }}
                      </span>
                    </label>
                  </div>
                </div>
                
                <!-- Checkbox -->
                <div v-else-if="question.type === 'checkbox'">
                  <div class="space-y-0.5">
                    <label v-for="option in question.options" :key="option.value" 
                           class="flex items-center p-1 rounded-md transition-colors cursor-pointer"
                           :class="task.status === 'completed' ? 'bg-gray-50' : 'hover:bg-gray-50'">
                      <input
                        v-model="question.answer"
                        :disabled="task.status === 'completed'"
                        type="checkbox"
                        :value="option.value"
                        class="mr-2 text-primary focus:ring-primary"
                        :class="task.status === 'completed' ? 'opacity-50' : ''"
                      >
                      <span class="text-sm" :class="task.status === 'completed' ? 'text-gray-600' : 'text-gray-900'">
                        {{ option.label }}
                      </span>
                    </label>
                  </div>
                </div>
                
                <!-- Yes/No -->
                <div v-else-if="question.type === 'yesno'">
                  <div class="flex gap-2">
                    <label class="flex items-center p-1 rounded-md transition-colors cursor-pointer flex-1 justify-center"
                           :class="task.status === 'completed' ? 'bg-gray-50' : 'hover:bg-gray-50'">
                      <input
                        v-model="question.answer"
                        :disabled="task.status === 'completed'"
                        type="radio"
                        value="yes"
                        class="mr-1.5 text-primary focus:ring-primary"
                        :class="task.status === 'completed' ? 'opacity-50' : ''"
                      >
                      <span class="text-sm" :class="task.status === 'completed' ? 'text-gray-600' : 'text-gray-900'">Yes</span>
                    </label>
                    <label class="flex items-center p-1 rounded-md transition-colors cursor-pointer flex-1 justify-center"
                           :class="task.status === 'completed' ? 'bg-gray-50' : 'hover:bg-gray-50'">
                      <input
                        v-model="question.answer"
                        :disabled="task.status === 'completed'"
                        type="radio"
                        value="no"
                        class="mr-1.5 text-primary focus:ring-primary"
                        :class="task.status === 'completed' ? 'opacity-50' : ''"
                      >
                      <span class="text-sm" :class="task.status === 'completed' ? 'text-gray-600' : 'text-gray-900'">No</span>
                    </label>
                  </div>
                </div>
              </div>
              
              <!-- Question Description -->
              <p v-if="question.description" class="text-xs text-gray-500 mt-0.5 italic">
                {{ question.description }}
              </p>
              
              <!-- Required field indicator -->
              <p v-if="question.required && !question.answer && task.status !== 'completed'" 
                 class="text-xs text-red-500 mt-0.5 flex items-center">
                <MdiIcon :path="mdiAlertCircle" :size="10" class="mr-1" />
                Required
              </p>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-3 pt-4">
          <button 
            @click="updateProgress"
            class="flex-1 bg-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-dark transition-colors flex items-center justify-center"
          >
            <MdiIcon :path="mdiUpdate" :size="18" class="mr-2" />
            Update Progress
          </button>
          <button 
            @click="addNote"
            class="flex-1 bg-blue-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center justify-center"
          >
            <MdiIcon :path="mdiPlus" :size="18" class="mr-2" />
            Add Note
          </button>
        </div>
      </div>
    </div>
  </MobileLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import MobileLayout from '../../components/MobileLayout.vue';
import MdiIcon from '../../components/MdiIcon.vue';

// Icons
import {
  mdiArrowLeft,
  mdiClipboardText,
  mdiCalendarClock,
  mdiFormatListBulleted,
  mdiPackageVariant,
  mdiNoteText,
  mdiUpdate,
  mdiPlus,
  mdiAlertCircle,
  mdiClipboardCheck,
  mdiContentSave
} from '@mdi/js';

const route = useRoute();
const router = useRouter();

const loading = ref(true);
const workOrderId = computed(() => route.params.workOrderId);
const taskId = computed(() => route.params.taskId);

// Questionnaire computed properties
const isQuestionnaireComplete = computed(() => {
  if (!task.value?.questionnaire) return false;
  const requiredQuestions = task.value.questionnaire.filter(q => q.required);
  return requiredQuestions.every(q => q.answer !== null && q.answer !== '' && q.answer !== undefined);
});

const canSaveQuestionnaire = computed(() => {
  if (!task.value?.questionnaire || task.value.status === 'completed') return false;
  return task.value.questionnaire.some(q => q.answer !== null && q.answer !== '' && q.answer !== undefined);
});

const unansweredRequiredCount = computed(() => {
  if (!task.value?.questionnaire) return 0;
  const requiredQuestions = task.value.questionnaire.filter(q => q.required);
  return requiredQuestions.filter(q => !q.answer || q.answer === '').length;
});

const answeredQuestionsCount = computed(() => {
  if (!task.value?.questionnaire) return 0;
  return task.value.questionnaire.filter(q => q.answer !== null && q.answer !== '' && q.answer !== undefined).length;
});

const totalQuestionsCount = computed(() => {
  return task.value?.questionnaire?.length || 0;
});

// Mock task data - in real app, this would come from a store based on taskId
const taskData = {
  'TSK-001': {
    id: 'TSK-001',
    title: 'Engine Oil Change',
    description: 'Complete engine oil change including filter replacement and fluid level check',
    status: 'completed',
    priority: 'High',
    assignedTo: 'John Smith',
    progress: 100,
    category: 'Maintenance',
    estimatedDuration: '2 hours',
    createdDate: '2024-06-20T08:00:00Z',
    scheduledStartDate: '2024-06-25T06:00:00Z',
    scheduledEndDate: '2024-06-25T08:00:00Z',
    actualStartDate: '2024-06-25T06:15:00Z',
    actualEndDate: '2024-06-25T08:00:00Z',
    instructions: [
      'Warm up the engine to operating temperature',
      'Turn off engine and wait 5 minutes for oil to settle',
      'Remove drain plug and drain old oil completely',
      'Replace oil filter with new one',
      'Reinstall drain plug with new gasket',
      'Refill with specified amount of new oil',
      'Check oil level and top up if necessary',
      'Run engine for 5 minutes and recheck level'
    ],
    materials: [
      { id: 1, name: 'Engine Oil 15W-40', qtyRequired: 20, qtyAvailable: 25, unit: 'Liters', status: 'available' },
      { id: 2, name: 'Oil Filter', qtyRequired: 1, qtyAvailable: 3, unit: 'Pieces', status: 'available' },
      { id: 3, name: 'Drain Plug Gasket', qtyRequired: 1, qtyAvailable: 5, unit: 'Pieces', status: 'available' }
    ],
    notes: [
      {
        id: 1,
        author: 'John Smith',
        content: 'Started task as scheduled. Engine warmed up successfully.',
        createdDate: '2024-06-25T06:15:00Z'
      },        {
          id: 2,
          author: 'John Smith',
          content: 'Oil change completed successfully. No issues found.',
          createdDate: '2024-06-25T08:00:00Z'
        }
      ],
      questionnaire: [
        {
          id: 1,
          question: "Was the engine at proper operating temperature before draining?",
          type: "yesno",
          required: true,
          answer: "yes"
        },
        {
          id: 2,
          question: "Oil drain time (minutes)",
          type: "number",
          required: true,
          min: 5,
          max: 30,
          step: 1,
          unit: "minutes",
          placeholder: "Enter drain time",
          answer: "15"
        },
        {
          id: 3,
          question: "Oil filter condition before replacement",
          type: "radio",
          required: true,
          options: [
            { value: "good", label: "Good - Normal wear" },
            { value: "moderate", label: "Moderate - Some contamination" },
            { value: "poor", label: "Poor - Heavy contamination" },
            { value: "damaged", label: "Damaged - Physical damage" }
          ],
          answer: "moderate"
        },
        {
          id: 4,
          question: "New oil quality check results",
          type: "checkbox",
          required: false,
          options: [
            { value: "color", label: "Color - Clear/Amber" },
            { value: "viscosity", label: "Viscosity - Proper consistency" },
            { value: "contamination", label: "No visible contamination" },
            { value: "level", label: "Proper level after refill" }
          ],
          answer: ["color", "viscosity", "contamination", "level"]
        },
        {
          id: 5,
          question: "Any issues or observations during oil change?",
          type: "textarea",
          required: false,
          placeholder: "Describe any issues, leaks, or unusual findings...",
          answer: "No issues found. Oil change completed successfully."
        }
      ]
  },
  'TSK-002': {
    id: 'TSK-002',
    title: 'Hydraulic System Check',
    description: 'Comprehensive hydraulic system inspection and fluid level check',
    status: 'in-progress',
    priority: 'Medium',
    assignedTo: 'Maria Garcia',
    progress: 75,
    category: 'Inspection',
    estimatedDuration: '3 hours',
    createdDate: '2024-06-20T08:00:00Z',
    scheduledStartDate: '2024-06-25T08:00:00Z',
    scheduledEndDate: '2024-06-25T11:00:00Z',
    actualStartDate: '2024-06-25T08:15:00Z',
    actualEndDate: null,
    instructions: [
      'Check hydraulic fluid level in reservoir',
      'Inspect all hydraulic hoses for leaks',
      'Test hydraulic pump pressure',
      'Check cylinder operation and seals',
      'Verify relief valve settings',
      'Top up fluid if necessary'
    ],
    materials: [
      { id: 1, name: 'Hydraulic Fluid', qtyRequired: 10, qtyAvailable: 15, unit: 'Liters', status: 'available' },
      { id: 2, name: 'Pressure Gauge', qtyRequired: 1, qtyAvailable: 2, unit: 'Pieces', status: 'available' }
    ],
    notes: [
      {
        id: 1,
        author: 'Maria Garcia',
        content: 'Started hydraulic system check. Initial inspection complete.',
        createdDate: '2024-06-25T08:15:00Z'
      }
    ],
    questionnaire: [
      {
        id: 1,
        question: "Hydraulic fluid level status",
        type: "radio",
        required: true,
        options: [
          { value: "full", label: "Full - Within normal range" },
          { value: "low", label: "Low - Needs topping up" },
          { value: "empty", label: "Empty - Requires immediate attention" }
        ],
        answer: "low"
      },
      {
        id: 2,
        question: "Hydraulic pump pressure reading (PSI)",
        type: "number",
        required: true,
        min: 0,
        max: 5000,
        step: 10,
        unit: "PSI",
        placeholder: "Enter pressure reading",
        answer: "2850"
      },
      {
        id: 3,
        question: "Observed hose conditions",
        type: "checkbox",
        required: true,
        options: [
          { value: "no_leaks", label: "No visible leaks" },
          { value: "minor_seepage", label: "Minor seepage at fittings" },
          { value: "cracking", label: "Surface cracking on hoses" },
          { value: "bulging", label: "Hose bulging or swelling" }
        ],
        answer: ["no_leaks"]
      },
      {
        id: 4,
        question: "Were relief valve settings verified?",
        type: "yesno",
        required: true,
        answer: "yes"
      },
      {
        id: 5,
        question: "Additional observations or recommendations",
        type: "textarea",
        required: false,
        placeholder: "Note any other findings, maintenance needs, or recommendations...",
        answer: "System operating normally. Recommend checking again in 200 hours."
      }
    ]
  },
  'TSK-003': {
    id: 'TSK-003',
    title: 'Track Inspection',
    description: 'Visual and measurement inspection of track system components',
    status: 'pending',
    priority: 'Low',
    assignedTo: 'David Chen',
    progress: 0,
    category: 'Inspection',
    estimatedDuration: '1.5 hours',
    createdDate: '2024-06-20T08:00:00Z',
    scheduledStartDate: '2024-06-26T08:00:00Z',
    scheduledEndDate: '2024-06-26T09:30:00Z',
    actualStartDate: null,
    actualEndDate: null,
    instructions: [
      'Inspect track pads for wear and damage',
      'Check track tension',
      'Examine drive sprockets',
      'Inspect idler wheels',
      'Measure track pitch'
    ],
    materials: [
      { id: 1, name: 'Measuring Tape', qtyRequired: 1, qtyAvailable: 3, unit: 'Pieces', status: 'available' },
      { id: 2, name: 'Track Gauge', qtyRequired: 1, qtyAvailable: 1, unit: 'Pieces', status: 'available' }
    ],
    notes: [],
    questionnaire: [
      {
        id: 1,
        question: "Track pad wear assessment",
        type: "radio",
        required: true,
        options: [
          { value: "minimal", label: "Minimal wear - Good condition" },
          { value: "moderate", label: "Moderate wear - Monitor closely" },
          { value: "excessive", label: "Excessive wear - Replacement needed" },
          { value: "damaged", label: "Damaged - Immediate replacement required" }
        ],
        answer: ""
      },
      {
        id: 2,
        question: "Track tension measurement (mm)",
        type: "number",
        required: true,
        min: 0,
        max: 100,
        step: 1,
        unit: "mm",
        placeholder: "Enter tension measurement",
        description: "Normal range: 15-25mm",
        answer: ""
      },
      {
        id: 3,
        question: "Drive sprocket condition checks",
        type: "checkbox",
        required: true,
        options: [
          { value: "teeth_good", label: "Sprocket teeth in good condition" },
          { value: "proper_alignment", label: "Proper alignment maintained" },
          { value: "no_excessive_wear", label: "No excessive wear patterns" },
          { value: "secure_mounting", label: "Secure mounting verified" }
        ],
        answer: []
      },
      {
        id: 4,
        question: "Were any track defects found?",
        type: "yesno",
        required: true,
        answer: ""
      },
      {
        id: 5,
        question: "If defects found, describe location and severity",
        type: "textarea",
        required: false,
        placeholder: "Describe any defects, their location, and recommended action...",
        answer: ""
      }
    ]
  },
  'TSK-004': {
    id: 'TSK-004',
    title: 'Electrical Diagnostics',
    description: 'Complete electrical system diagnostic and testing',
    status: 'in-progress',
    priority: 'High',
    assignedTo: 'Sarah Johnson',
    progress: 45,
    category: 'Diagnostics',
    estimatedDuration: '4 hours',
    createdDate: '2024-06-20T08:00:00Z',
    scheduledStartDate: '2024-06-25T10:00:00Z',
    scheduledEndDate: '2024-06-25T14:00:00Z',
    actualStartDate: '2024-06-25T10:30:00Z',
    actualEndDate: null,
    instructions: [
      'Connect diagnostic equipment',
      'Scan for error codes',
      'Test battery voltage and charging system',
      'Check all electrical connections',
      'Test lighting systems',
      'Verify control module functions'
    ],
    materials: [
      { id: 1, name: 'Diagnostic Scanner', qtyRequired: 1, qtyAvailable: 1, unit: 'Pieces', status: 'available' },
      { id: 2, name: 'Multimeter', qtyRequired: 1, qtyAvailable: 2, unit: 'Pieces', status: 'available' }
    ],
    notes: [
      {
        id: 1,
        author: 'Sarah Johnson',
        content: 'Diagnostic scan completed. Found 2 minor fault codes.',
        createdDate: '2024-06-25T11:00:00Z'
      }
    ],
    questionnaire: [
      {
        id: 1,
        question: "Battery voltage reading (V)",
        type: "number",
        required: true,
        min: 0,
        max: 50,
        step: 0.1,
        unit: "V",
        placeholder: "Enter voltage reading",
        description: "Normal range: 12.4-12.8V (engine off), 13.8-14.4V (engine running)",
        answer: "12.6"
      },
      {
        id: 2,
        question: "Diagnostic fault codes found",
        type: "text",
        required: false,
        placeholder: "Enter fault codes separated by commas (e.g., P0123, P0456)",
        answer: "P0171, P0300"
      },
      {
        id: 3,
        question: "Electrical system components tested",
        type: "checkbox",
        required: true,
        options: [
          { value: "battery", label: "Battery and charging system" },
          { value: "alternator", label: "Alternator output" },
          { value: "starter", label: "Starter motor operation" },
          { value: "lights", label: "Lighting systems" },
          { value: "control_modules", label: "Control modules communication" }
        ],
        answer: ["battery", "alternator", "lights"]
      },
      {
        id: 4,
        question: "Were all electrical connections secure?",
        type: "yesno",
        required: true,
        answer: "no"
      },
      {
        id: 5,
        question: "Electrical system recommendations",
        type: "textarea",
        required: false,
        placeholder: "Note any electrical issues, loose connections, or recommended repairs...",
        answer: "Found loose connection at main harness. Recommend cleaning battery terminals."
      }
    ]
  }
};

const task = computed(() => {
  return taskData[taskId.value] || null;
});

// Methods
const goBack = () => {
  router.go(-1);
};

const updateProgress = () => {
  // Mock progress update - in real app, this would open a modal or navigate to update form
  alert('Progress update functionality would be implemented here');
};

const addNote = () => {
  // Mock add note - in real app, this would open a modal or form
  alert('Add note functionality would be implemented here');
};

const saveQuestionnaire = async () => {
  try {
    // Validate required questions
    const requiredQuestions = task.value.questionnaire.filter(q => q.required);
    const unansweredRequired = requiredQuestions.filter(q => !q.answer || q.answer === '');
    
    if (unansweredRequired.length > 0) {
      alert(`Please answer all required questions (${unansweredRequired.length} remaining)`);
      return;
    }
    
    // Mock save functionality - in real app, this would save to backend or store
    console.log('Saving questionnaire:', task.value.questionnaire);
    
    // Show success message
    alert('Questionnaire saved successfully!');
    
    // In real app, you might want to update the task progress or status
    // if (task.value.progress < 100 && isQuestionnaireComplete()) {
    //   task.value.progress = Math.min(task.value.progress + 25, 100);
    // }
  } catch (error) {
    console.error('Error saving questionnaire:', error);
    alert('Failed to save questionnaire. Please try again.');
  }
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

const getTaskStatusClass = (status) => {
  const classes = {
    'completed': 'bg-green-100 text-green-800',
    'in-progress': 'bg-blue-100 text-blue-800',
    'pending': 'bg-yellow-100 text-yellow-800',
    'cancelled': 'bg-red-100 text-red-800'
  };
  return classes[status] || 'bg-gray-100 text-gray-800';
};

const getProgressBarClass = (status) => {
  const classes = {
    'pending': 'bg-gradient-to-r from-yellow-500 to-yellow-400',
    'in-progress': 'bg-gradient-to-r from-blue-500 to-blue-400',
    'completed': 'bg-gradient-to-r from-green-500 to-green-400',
    'cancelled': 'bg-gradient-to-r from-red-500 to-red-400'
  };
  return classes[status] || 'bg-gray-400';
};

const getMaterialStatusClass = (status) => {
  const classes = {
    'available': 'bg-green-100 text-green-800',
    'shortage': 'bg-yellow-100 text-yellow-800',
    'out-of-stock': 'bg-red-100 text-red-800'
  };
  return classes[status] || 'bg-gray-100 text-gray-800';
};

onMounted(async () => {
  loading.value = true;
  // Simulate loading
  setTimeout(() => {
    loading.value = false;
  }, 500);
});
</script>
