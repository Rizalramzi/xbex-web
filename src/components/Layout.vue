<template>
  <div class="h-screen bg-app flex">
    <!-- Sidebar -->
    <Sidebar
      v-show="sidebarStore.sidebarOpen"
      @toggle-sidebar="toggleSidebar"
      class="fixed top-0 left-0 z-50"
    />

    <!-- Main content area -->
    <div
      class="transition-all duration-300 ease-in-out flex flex-col flex-1 min-h-screen me-[62px]" :class="sidebarStore.sidebarOpen ? 'ms-[373px]' : 'lg:ml-[62px]'"
    >
      <!-- Header -->
      <Header @toggle-sidebar="toggleSidebar" />

      <!-- Page content -->
      <main>
        <section class="h-[750px] mt-[20px] px-[60px] py-[40px] bg-white rounded-[30px] overflow-hidden"
        style="border-color: var(--border-light);">
          <slot name="content" />
        </section>
        <section>
          <slot name="pagination" />
        </section>
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

<style scoped>
.bg-app {
  background-color: #f6f8fa; /* Sesuaikan dengan background aplikasimu */
}
</style>
