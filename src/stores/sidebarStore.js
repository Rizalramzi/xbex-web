import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSidebarStore = defineStore('sidebar', () => {
  // State
  const sidebarOpen = ref(true)
  
  // Actions
  const toggleSidebar = () => {
    sidebarOpen.value = !sidebarOpen.value
  }
  
  const setSidebarOpen = (value) => {
    sidebarOpen.value = value
  }
  
  const openSidebar = () => {
    sidebarOpen.value = true
  }
  
  const closeSidebar = () => {
    sidebarOpen.value = false
  }
  
  return {
    sidebarOpen,
    toggleSidebar,
    setSidebarOpen,
    openSidebar,
    closeSidebar
  }
})
