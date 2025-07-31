<template>
  <div class="relative flex flex-row items-center xl:gap-[13px] 2xl:gap-[20px]">
    <div
      @click="handleToggleFavorite"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
      class="background__icon cursor-pointer"
      :title="isFavorite ? 'Remove from Favorites' : 'Add to Favorites'"
    >
      <img
        :src="isFavorite ? 'icons/love.svg' : 'icons/unlove.svg'"
        alt="Favorite Icon"
        class="w-auto h-[3.5vw] xl:h-[13px] 2xl:h-[19px] object-center object-cover shrink-0"
      />
    </div>

    <!-- Tooltip (shows only on hover) -->
    <transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-1"
    >
      <div
        v-if="showTooltip && showTooltipOnHover"
        class="absolute z-10 px-2 py-1 text-xs text-white bg-gray-900 rounded shadow-lg -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap pointer-events-none"
      >
        {{ isFavorite ? 'Remove from Favorites' : 'Add to Favorites' }}
        <div
          class="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-900"
        ></div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { computed, ref, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useFavoriteMenuStore } from '../stores/favoriteMenuStore'

const props = defineProps({
  menuItem: {
    type: Object,
    required: false,
    default: null
  },
  showTooltip: {
    type: Boolean,
    default: false
  }
})

const route = useRoute()
const favoriteStore = useFavoriteMenuStore()
const showTooltipOnHover = ref(false)
const tooltipTimeout = ref(null)

const handleMouseEnter = () => {
  clearTimeout(tooltipTimeout.value)
  tooltipTimeout.value = setTimeout(() => {
    showTooltipOnHover.value = true
  }, 300)
}

const handleMouseLeave = () => {
  clearTimeout(tooltipTimeout.value)
  showTooltipOnHover.value = false
}

const currentMenuItem = computed(() => {
  if (props.menuItem) return props.menuItem

  const path = route.path
  const routeName = route.name || ''

  return {
    id: routeName || path.replace('/', '') || 'unknown',
    name: getPageTitle(),
    href: path,
    icon: getPageIcon(),
    level: 2,
    parent: getParentMenu()
  }
})

const isFavorite = computed(() => {
  return favoriteStore.isFavorite(currentMenuItem.value.id)
})

const handleToggleFavorite = () => {
  favoriteStore.toggleFavorite(currentMenuItem.value)
}

const getPageTitle = () => {
  const path = route.path
  if (path.includes('/dashboard')) return 'Dashboard'
  if (path.includes('/task')) return 'Task Management'
  if (path.includes('/work-order')) return 'Work Order'
  if (path.includes('/defect')) return 'Defect Report'
  if (path.includes('/material-status')) return 'Material Status'
  if (path.includes('/sync-data')) return 'Sync Data'
  if (path.includes('/reports')) return 'Reports'
  if (path.includes('/assets')) return 'Assets'
  if (path.includes('/maintenance')) return 'Maintenance'
  if (path.includes('/settings')) return 'Settings'
  return 'Unknown Page'
}

const getPageIcon = () => {
  const path = route.path
  if (path.includes('/dashboard')) return 'mdiViewDashboard'
  if (path.includes('/task')) return 'mdiClipboardList'
  if (path.includes('/work-order')) return 'mdiWrench'
  if (path.includes('/defect')) return 'mdiAlertCircle'
  if (path.includes('/material-status')) return 'mdiPackageVariant'
  if (path.includes('/sync-data')) return 'mdiSync'
  if (path.includes('/reports')) return 'mdiChartBox'
  if (path.includes('/assets')) return 'mdiPackageVariant'
  if (path.includes('/maintenance')) return 'mdiWrench'
  if (path.includes('/settings')) return 'mdiCog'
  return 'mdiViewDashboard'
}

const getParentMenu = () => {
  const path = route.path
  if (path.includes('/task') || path.includes('/work-order') || path.includes('/defect') ||
      path.includes('/material-status') || path.includes('/sync-data') || path.includes('/reports')) {
    return 'Transaction'
  }
  if (path.includes('/system') || path.includes('/settings')) {
    return 'System'
  }
  return null
}

onUnmounted(() => {
  if (tooltipTimeout.value) {
    clearTimeout(tooltipTimeout.value)
  }
})
</script>
