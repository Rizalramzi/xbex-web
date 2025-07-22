<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center">
    <div class="bg-white p-8 rounded shadow-md max-w-md w-full text-center">
      <h1 class="text-4xl font-bold text-gray-800 mb-4">404</h1>
      <p class="text-xl text-gray-600 mb-6">Page Not Found</p>
      <p class="text-gray-500 mb-8">The page you are looking for doesn't exist or has been moved.</p>
      <router-link to="/dashboard" class="btn btn-primary">
        Return to Dashboard
      </router-link>
    </div>
  </div>
</template>
