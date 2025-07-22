<template>
  <Layout>
    <div>
      <div class="border-b border-gray-200 pb-5 sm:flex sm:items-center sm:justify-between">
        <div class="sm:flex-auto">
          <h1 class="text-2xl font-semibold leading-6 text-gray-900">Defect Management</h1>
          <p class="mt-2 text-sm text-gray-700">Manage and track defects found in assets and equipment.</p>
        </div>
        <div class="mt-3 sm:mt-0">
          <FavoriteButton :show-tooltip="true" />
        </div>
      </div>
      
      <div class="mt-6">
        <div class="bg-gray-50 p-8 rounded-lg text-center">
          <h3 class="text-lg font-medium text-gray-900 mb-2">Defect Management System</h3>
          <p class="text-gray-600">This page is under construction. Defect management functionality will be available soon.</p>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import Layout from '../components/Layout.vue';
import FavoriteButton from '../components/FavoriteButton.vue';
</script>
