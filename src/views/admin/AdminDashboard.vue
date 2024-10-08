<template>
  <div class="flex h-screen bg-gray-100">
    <!-- Sidebar -->
    <div class="w-64 bg-white shadow-md">
      <div class="p-4">
        <h2 class="text-2xl font-semibold text-gray-800">Admin Dashboard</h2>
      </div>
      <nav class="mt-4">
        <router-link to="/admin/events" class="block py-2 px-4 text-gray-700 hover:bg-gray-200">
          Manage Your Events
        </router-link>
        <!-- <a href="#" class="block py-2 px-4 text-gray-700 hover:bg-gray-200">
          Manage Users
        </a> -->
        <a href="#" class="block py-2 px-4 text-gray-700 hover:bg-gray-200">
          Settings (currently N/A)
        </a>
      </nav>
    </div>

    <!-- Main content -->
    <div class="flex-1 overflow-x-hidden overflow-y-auto">
      <div class="container mx-auto px-6 py-8">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Admin Dashboard logic
</script>