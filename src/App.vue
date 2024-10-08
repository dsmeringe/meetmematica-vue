<template>
  <div class="min-h-screen bg-gray-100">
    <nav class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <router-link to="/" class="flex-shrink-0 flex items-center">
              MeetMeMatica
            </router-link>
          </div>
          <div class="flex items-center">
            <template v-if="authStore.user">
              <span class="text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                Welcome, {{ authStore.user.email }}
              </span>
              <router-link v-if="authStore.user" to="/admin" class="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                Admin
              </router-link>
              <button @click="handleLogout" class="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                Logout
              </button>
            </template>
            <template v-else>
              <router-link to="/login" class="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                Login
              </router-link>
              <router-link to="/register" class="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                Register
              </router-link>
            </template>
          </div>
        </div>
      </div>
    </nav>

    <main>
      <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <router-view></router-view>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from './stores/auth'

const authStore = useAuthStore()

const handleLogout = () => {
  authStore.handleLogout()
}
</script>

<style>
/* Any global styles can go here */
</style>