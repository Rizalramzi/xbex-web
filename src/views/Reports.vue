<template>  <Layout>
    <div class="">
      <div class="border-b border-gray-200 pb-5 sm:flex sm:items-center sm:justify-between">
        <h3 class="text-2xl font-semibold leading-6 text-gray-900">Reports</h3>
        <div class="mt-3 sm:mt-0">
          <FavoriteButton :show-tooltip="true" />
        </div>
      </div>
      
      <div class="mt-6 bg-gray-50 p-4 rounded-md">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div class="bg-white p-4 rounded-md shadow">
            <h4 class="text-lg font-medium text-gray-900 mb-4">Asset Status Report</h4>
            <p class="text-sm text-gray-500 mb-4">
              Overview of all assets by status: operational, under maintenance, needs repair, and retired.
            </p>
            <button class="btn btn-primary w-full">Generate Report</button>
          </div>
          
          <div class="bg-white p-4 rounded-md shadow">
            <h4 class="text-lg font-medium text-gray-900 mb-4">Maintenance Schedule</h4>
            <p class="text-sm text-gray-500 mb-4">
              Calendar view of upcoming and overdue maintenance activities.
            </p>
            <button class="btn btn-primary w-full">Generate Report</button>
          </div>
          
          <div class="bg-white p-4 rounded-md shadow">
            <h4 class="text-lg font-medium text-gray-900 mb-4">Maintenance History</h4>
            <p class="text-sm text-gray-500 mb-4">
              Historical record of maintenance activities by asset, date range, or type.
            </p>
            <button class="btn btn-primary w-full">Generate Report</button>
          </div>
        </div>
      </div>
      
      <div class="mt-8">
        <h3 class="text-lg font-medium leading-6 text-gray-900 mb-4">Custom Report</h3>
        <div class="bg-white p-6 rounded-md shadow">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label for="report-type" class="block text-sm font-medium text-gray-700">Report Type</label>
              <select
                id="report-type"
                class="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              >
                <option value="asset">Asset Report</option>
                <option value="maintenance">Maintenance Report</option>
                <option value="cost">Cost Analysis</option>
              </select>
            </div>
            
            <div>
              <label for="date-range" class="block text-sm font-medium text-gray-700">Date Range</label>
              <select
                id="date-range"
                class="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              >
                <option value="last-30">Last 30 Days</option>
                <option value="last-90">Last 90 Days</option>
                <option value="last-year">Last Year</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>
          </div>
          
          <div class="flex justify-end">
            <button class="btn btn-primary">Generate Custom Report</button>
          </div>
        </div>
      </div>
      
      <div class="mt-8">
        <div class="text-center p-8 text-gray-500">
          <p>Report generation feature is not available in this demo version.</p>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup>

import FavoriteButton from '../components/FavoriteButton.vue';
</script>
