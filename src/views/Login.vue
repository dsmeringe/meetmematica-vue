<template>
  <div class="max-w-md mx-auto">
    <h2 class="text-2xl font-bold mb-4">Login</h2>
    <div class="mb-4">
      <button @click="handleLinkedInLogin" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full mb-2">
        Sign in with LinkedIn
      </button>
      <button @click="handleGoogleLogin" class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded w-full mb-2">
        Sign in with Google
      </button>
      <button @click="handleAppleLogin" class="bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded w-full mb-2">
        Sign in with Apple
      </button>
      <button @click="handleGitHubLogin" class="bg-gray-800 hover:bg-black-800 text-white font-bold py-2 px-4 rounded w-full">
        Sign in with GitHub
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()

const handleLinkedInLogin = () => authStore.handleLogin('linkedin')
const handleGoogleLogin = () => authStore.handleLogin('google')
const handleAppleLogin = () => authStore.handleLogin('apple')
const handleGitHubLogin = () => authStore.handleLogin('github')
</script>