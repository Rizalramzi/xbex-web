<template>  <div 
    class="fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out border-r" 
    :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full'"
    style="background-color: var(--color-bgsidebar); border-color: var(--border-light); --sidebar-width: 16rem;"
  >    <!-- Sidebar header -->
    <div class="flex items-center justify-between h-16 px-6 border-b" style="background-color: var(--color-bgheader); border-color: var(--border-light);">
      <div class="flex items-center">
        <span class="text-sm font-medium" style="color: var(--text-secondary);">Navigation</span>
      </div>      <button @click="toggleSidebar" class="p-2 rounded-md hover:bg-gray-100 cursor-pointer">
        <MdiIcon :path="mdiClose" :size="20" style="color: var(--text-secondary);" />
      </button>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 px-4 py-6 space-y-2 overflow-y-auto relative">
      <!-- Render top level items (level 1) that are not groups -->
      <div class="space-y-1">
        <template v-for="item in menuItems" :key="item.id">
          <router-link 
            v-if="item.level === 1 && !item.isGroup"
            :to="item.href"
            :class="[
              $route.path === item.href || ($route.path.startsWith(item.href) && item.href !== '/') 
                ? 'text-white shadow-sm' 
                : 'hover:bg-gray-100',
              'group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200'
            ]"
            :style="$route.path === item.href || ($route.path.startsWith(item.href) && item.href !== '/') 
              ? 'background-color: var(--color-primary);' 
              : 'color: var(--text-secondary);'"
          >
            <MdiIcon :path="getMdiPath(item.icon)" :size="20" class="flex-shrink-0 mr-3" />
            {{ item.name }}
          </router-link>
        </template>
      </div>

      <!-- For each group at level 1, render a section -->
      <template v-for="group in menuGroups" :key="group.id">
        <!-- Divider -->
        <div class="border-t my-4" style="border-color: var(--border-light);"></div>

        <!-- Group Header -->
        <div class="space-y-1">
          <div class="px-3 py-2 text-xs font-semibold uppercase tracking-wider" style="color: var(--text-muted);">
            {{ group.name }}
          </div>

          <!-- Render level 2 items within this group -->
          <div v-for="item in group.children" :key="item.id" class="relative">
            <!-- Menu item with potential submenu -->
            <div class="group" 
              @mouseenter="() => { clearLeaveTimeout(); activeSubMenu = item.id; nextTick(() => { refreshSubMenuPosition(item.id); }); }"
              @mouseleave="handleMenuLeave"
            >
              <router-link 
                :id="`menu-item-${item.id}`"
                :to="item.href"
                :class="[
                  $route.path.startsWith(item.href) 
                    ? 'text-white shadow-sm' 
                    : 'hover:bg-gray-100',
                  'flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200'
                ]"
                :style="$route.path.startsWith(item.href) 
                  ? 'background-color: var(--color-primary);' 
                  : 'color: var(--text-secondary);'"
              >
                <MdiIcon :path="getMdiPath(item.icon)" :size="20" class="flex-shrink-0 mr-3" />
                <span>{{ item.name }}</span>
                <MdiIcon 
                  v-if="item.children && item.children.length" 
                  :path="mdiChevronRight" 
                  :size="18" 
                  class="ml-auto"
                />
              </router-link>

              <!-- Level 3 Submenu (popup) -->
              <teleport to="body">
                <div 
                  v-if="item.children && item.children.length && activeSubMenu === item.id"
                  class="fixed ml-2 rounded-lg shadow-lg border-2 overflow-hidden z-50 min-w-[200px]"
                  :style="{
                    borderColor: 'var(--color-primary-light, #c2e7d5)',
                    backgroundColor: 'var(--color-primary-lightest, #e6f7ee)',
                    top: getSubMenuPosition(item.id),
                    left: 'calc(var(--sidebar-width, 16rem) - 1px)'
                  }"
                  @mouseenter="() => { clearLeaveTimeout(); activeSubMenu = item.id; }"
                  @mouseleave="handleSubmenuLeave"
                >
                  <!-- Submenu header -->
                  <div class="py-2 px-4 border-b" style="border-color: var(--color-primary-light, #c2e7d5); background-color: var(--color-primary-light, #c2e7d5);">
                    <span class="text-xs font-semibold" style="color: var(--color-primary-dark, #156643);">{{ item.name }}</span>
                  </div>
                  
                  <!-- Multi-column layout for submenus with >10 items -->
                  <div v-if="hasMultipleColumns(item)" class="py-1 grid gap-0" 
                    :style="getGridColumnStyle(item.children)"
                  >
                    <div 
                      v-for="columnIndex in getColumnCount(item.children)" 
                      :key="columnIndex"
                      class="py-1"
                      :class="columnIndex < getColumnCount(item.children) ? 'border-r' : ''"
                      style="border-color: var(--color-primary-light, #c2e7d5);"
                    >
                      <router-link
                        v-for="subItem in filterByColumn(item.children, columnIndex)"
                        :key="subItem.id"
                        :to="subItem.href"
                        :class="[
                          $route.path.startsWith(subItem.href) 
                            ? 'bg-primary-light font-medium' 
                            : 'hover:bg-primary-light/50',
                          'block px-4 py-2 text-sm transition-colors'
                        ]"
                        :style="$route.path.startsWith(subItem.href)
                          ? 'color: var(--color-primary);'
                          : 'color: var(--text-secondary);'"
                      >
                        <div class="flex items-center">
                          <MdiIcon :path="getMdiPath(subItem.icon)" :size="18" class="flex-shrink-0 mr-3" />
                          {{ subItem.name }}
                        </div>
                      </router-link>
                    </div>
                  </div>
                  
                  <!-- Standard single column menu for other items -->
                  <div v-else class="py-1">
                    <router-link
                      v-for="subItem in item.children"
                      :key="subItem.id"
                      :to="subItem.href"
                      :class="[
                        $route.path.startsWith(subItem.href) 
                          ? 'bg-primary-light font-medium' 
                          : 'hover:bg-primary-light/50',
                        'block px-4 py-2 text-sm transition-colors'
                      ]"
                      :style="$route.path.startsWith(subItem.href)
                        ? 'color: var(--color-primary);'
                        : 'color: var(--text-secondary);'"
                    >
                      <div class="flex items-center">
                        <MdiIcon :path="getMdiPath(subItem.icon)" :size="18" class="flex-shrink-0 mr-3" />
                        {{ subItem.name }}
                        
                        <!-- If we have level 4+ items (not implemented in this version) -->
                        <MdiIcon 
                          v-if="subItem.children && subItem.children.length" 
                          :path="mdiChevronRight" 
                          :size="16" 
                          class="ml-auto" 
                        />
                      </div>
                    </router-link>
                  </div>
                </div>
              </teleport>
            </div>
          </div>
        </div>
      </template>
    </nav>

    <!-- Sidebar footer -->
    <div class="border-t p-4" style="border-color: var(--border-light);">
      <!-- Site Information -->
      <div class="flex items-center justify-between mb-3 pb-2 border-b" style="border-color: var(--border-light);">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 rounded-full flex items-center justify-center" style="background-color: var(--color-primary-light);">
              <MdiIcon :path="mdiMapMarker" :size="16" style="color: var(--color-primary-dark);" />
            </div>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium" style="color: var(--text-primary);">Site: {{ currentSite }}</p>
            <p class="text-xs" style="color: var(--text-muted);">Active Site</p>
          </div>
        </div>
        <button @click="openSiteChangeModal" class="p-2 rounded-md hover:bg-gray-100 transition-all duration-200 cursor-pointer" style="color: var(--color-primary);">
          <MdiIcon :path="mdiSwapHorizontal" :size="16" caption="Change Site" />
        </button>
      </div>
      
      <!-- User Information -->
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 rounded-full flex items-center justify-center" style="background-color: var(--color-primary);">
              <span class="text-sm font-medium text-white">A</span>
            </div>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium" style="color: var(--text-primary);">Admin</p>
            <p class="text-xs" style="color: var(--text-muted);">Administrator</p>
          </div>
        </div>        
        <button @click="logout" class="p-2 rounded-md hover:bg-red-100 text-red-600 transition-all duration-200 cursor-pointer">
          <MdiIcon :path="mdiLogout" :size="16" />
        </button>
      </div>
    </div>  </div>

  <!-- Site Change Modal -->
  <SiteChangeModal 
    :show="showSiteModal" 
    :current-site="currentSite" 
    @close="showSiteModal = false" 
    @change="handleSiteChange" 
  />
</template>

<script setup>
import { computed, ref, onMounted, nextTick, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import { useSidebarStore } from '../stores/sidebarStore'
import { useSiteStore } from '../stores/siteStore'
import MdiIcon from './MdiIcon.vue'
import SiteChangeModal from './SiteChangeModal.vue'

// MDI Icon paths
import { 
  mdiViewDashboard,
  mdiPackageVariant,
  mdiWrench,
  mdiChartBox,
  mdiCog,
  mdiLogout,
  mdiClose,
  mdiChevronRight,
  mdiDatabase,
  mdiDatabaseSync,
  mdiShape,
  mdiTools,
  mdiTagMultiple,
  mdiMapMarker,
  mdiBriefcase,
  mdiAccountMultiple,
  mdiRuler,
  mdiFormatListBulleted,
  mdiSwapHorizontal,
  mdiCogs,
  mdiPackage,
  mdiCurrencyUsd,
  mdiFactory,
  mdiClipboardList,
  mdiCalendarClock,
  mdiCart,
  mdiWarehouse,
  mdiAlertCircle,
  mdiSync
} from '@mdi/js'

const props = defineProps({
  sidebarOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['toggle-sidebar'])
const authStore = useAuthStore()
const sidebarStore = useSidebarStore()
const siteStore = useSiteStore()
const router = useRouter()
const menuItems = ref([])
const activeSubMenu = ref(null)
const subMenuRefs = ref({})
const showSiteModal = ref(false)
const mouseLeaveTimeout = ref(null)

// Handle mouse leave from menu item with delay
const handleMenuLeave = () => {
  mouseLeaveTimeout.value = setTimeout(() => {
    activeSubMenu.value = null
  }, 100) // Small delay to allow moving to submenu
}

// Handle mouse leave from submenu
const handleSubmenuLeave = () => {
  mouseLeaveTimeout.value = setTimeout(() => {
    activeSubMenu.value = null
  }, 100)
}

// Clear timeout when mouse enters submenu
const clearLeaveTimeout = () => {
  if (mouseLeaveTimeout.value) {
    clearTimeout(mouseLeaveTimeout.value)
    mouseLeaveTimeout.value = null
  }
}

// Function to open site change modal
const openSiteChangeModal = () => {
  console.log('Opening site change modal');
  showSiteModal.value = true;
}

// Function to handle site change
const handleSiteChange = (newSite) => {
  siteStore.changeSite(newSite);
}

// Current site from store
const currentSite = computed(() => siteStore.currentSite)

// Helper function to calculate submenu position
const getSubMenuPosition = (itemId) => {
  // Find the DOM element for the menu item
  const menuItemEl = document.getElementById(`menu-item-${itemId}`)
  if (menuItemEl) {
    // Return the top position relative to the viewport
    return `${menuItemEl.getBoundingClientRect().top}px`
  }
  // Fallback position
  return '0px'
}

// Refresh submenu position - called on hover
const refreshSubMenuPosition = (itemId) => {
  // This function will trigger a recalculation of the position
  // when called during a hover event
  activeSubMenu.value = null
  nextTick(() => {
    activeSubMenu.value = itemId
  })
}

// Get all menu items from menu.json
onMounted(async () => {
  try {
    const response = await fetch('/src/assets/data/menu.json')
    menuItems.value = await response.json()
  } catch (error) {
    console.error('Failed to load menu:', error)
  }
})

// Filter groups (level 1 items with isGroup=true)
const menuGroups = computed(() => {
  return menuItems.value.filter(item => item.level === 1 && item.isGroup)
})

// Get the correct MDI path for a given icon name
const getMdiPath = (iconName) => {
  const iconMap = {
    mdiViewDashboard,
    mdiPackageVariant,
    mdiWrench,
    mdiChartBox,
    mdiCog,
    mdiDatabase,
    mdiDatabaseSync,
    mdiShape,
    mdiTools,
    mdiTagMultiple,
    mdiMapMarker,
    mdiBriefcase,
    mdiAccountMultiple,
    mdiRuler,
    mdiFormatListBulleted,
    mdiSwapHorizontal,
    mdiLogout,
    mdiClose,
    mdiChevronRight,
    mdiCogs,
    mdiPackage,
    mdiCurrencyUsd,
    mdiFactory,
    mdiClipboardList,
    mdiCalendarClock,
    mdiCart,
    mdiWarehouse,
    mdiAlertCircle,
    mdiSync
  }
  
  return iconMap[iconName] || mdiViewDashboard // Default to dashboard icon if not found
}

// Check if a menu item has multiple columns (any submenu with more than 10 items)
const hasMultipleColumns = (item) => {
  if (!item.children || item.children.length === 0) {
    return false
  }
  
  // If items have explicit column properties, use those
  if (item.children.some(child => child.column !== undefined)) {
    return true
  }
  
  // Otherwise, check if we have more than 10 items (auto-split)
  return item.children.length > 10
}

// Calculate the number of columns needed based on items count
const getColumnCount = (items) => {
  if (!items || items.length === 0) return 1
  return Math.ceil(items.length / 10)
}

// Get dynamic grid column style
const getGridColumnStyle = (items) => {
  const columnCount = getColumnCount(items)
  return {
    gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`,
    minWidth: `${columnCount * 220}px`
  }
}

// Filter menu items by column (either explicit or auto-calculated)
const filterByColumn = (items, columnNumber) => {
  // If items have explicit column properties, use those
  if (items.some(item => item.column !== undefined)) {
    return items.filter(item => item.column === columnNumber)
  }
  
  // Otherwise, auto-split into columns of max 10 items each
  const itemsPerColumn = 10
  const startIndex = (columnNumber - 1) * itemsPerColumn
  const endIndex = startIndex + itemsPerColumn
  return items.slice(startIndex, endIndex)
}

const toggleSidebar = () => {
  sidebarStore.toggleSidebar()
}

const logout = async () => {
  try {
    await authStore.logout()
    router.push('/login')
  } catch (error) {
    console.error('Logout failed:', error)
  }
}

// Cleanup timeout on unmount
onUnmounted(() => {
  if (mouseLeaveTimeout.value) {
    clearTimeout(mouseLeaveTimeout.value)
  }
})
</script>

<style scoped>
/* Ensure submenus display properly */
.group:hover {
  z-index: 10;
}

/* Add cursor pointer to interactive elements */
.group {
  position: relative;
}

.group a {
  cursor: pointer;
}

.group button {
  cursor: pointer;
}

/* Submenu items cursor */
.fixed a {
  cursor: pointer;
}

/* Add these styles to ensure submenu visibility */
:deep(.router-link-active) {
  position: relative;
  z-index: 1;
}

/* Make sure fixed submenu appears above other elements */
.fixed {
  z-index: 1000;
}

/* Add transition for smooth appearance */
.fixed {
  transition: all 0.2s ease-in-out;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Add subtle rounded corners to submenu items */
.fixed a {
  transition: background-color 0.15s ease-in-out;
  border-radius: 0.25rem;
  margin: 0.125rem 0.25rem;
}

/* Add hover effect for menu items */
.group:hover .router-link-active::after {
  content: '';
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 0.25rem;
  height: 50%;
  background-color: var(--color-primary);
  border-radius: 0.125rem;
}
</style>
