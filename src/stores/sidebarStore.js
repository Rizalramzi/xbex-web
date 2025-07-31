// src/stores/sidebarStore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSidebarStore = defineStore('sidebar', () => {
  const sidebarOpen = ref(true)

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
    sidebarOpen.value = true
  }

  // Fungsi yang akan dijalankan saat resize layar
  const handleResize = () => {
    if (window.innerWidth < 1280) {
      openSidebar()
    } else {
      openSidebar()
    }
  }

  return {
    sidebarOpen,
    toggleSidebar,
    setSidebarOpen,
    openSidebar,
    closeSidebar,
    handleResize
  }
})
