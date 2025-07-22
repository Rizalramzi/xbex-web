<template>
  <div class="h-screen bg-app">
    <!-- Sidebar -->
    <Sidebar :sidebar-open="sidebarStore.sidebarOpen" @toggle-sidebar="toggleSidebar" />
    
    <!-- Main content area -->
    <div class="transition-all duration-300 ease-in-out h-full flex flex-col" :class="sidebarStore.sidebarOpen ? 'lg:ml-64' : 'lg:ml-0'">
      <!-- Header -->
      <Header @toggle-sidebar="toggleSidebar" />
      <!-- Page content -->
      <main class="flex-1 p-4 m-5 bg-white border-2 rounded shadow overflow-hidden" style="border-color: var(--border-light);">
        <slot></slot>
      </main>
    </div>
  </div>
</template>

<script setup>
import Sidebar from './Sidebar.vue'
import Header from './Header.vue'
import { useSidebarStore } from '../stores/sidebarStore'

const sidebarStore = useSidebarStore()

const toggleSidebar = () => {
  sidebarStore.toggleSidebar()
}
</script>
