<template>
  <div class="max-w-md mx-auto">
    <h2 class="text-2xl font-bold mb-4">Login</h2>
    <form @submit.prevent="handleEmailLogin">
      <div class="mb-4">
        <label for="email" class="block text-gray-700 text-sm font-bold mb-2">Email</label>
        <input type="email" id="email" v-model="email" required class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
      </div>
      <div class="mb-4">
        <label for="password" class="block text-gray-700 text-sm font-bold mb-2">Password</label>
        <input type="password" id="password" v-model="password" required class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
      </div>
      <div class="flex items-center justify-between mb-4">
        <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          Login
        </button>
      </div>
    </form>

    <RouterLink to="/register" class="text-blue-500 hover:text-blue-700">Don't have an account? Register here</RouterLink>

    <hr style="margin: 1em;" />

    <p>    ..or login with any of these social media account options:</p>

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
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

const router = useRouter()

const authStore = useAuthStore()
const email = ref('')
const password = ref('')

const handleEmailLogin = async () => {
  try {
    const { error } = await authStore.handleEmailLogin(email.value, password.value)
    if (error) {
      console.error('Error logging in with email:', error.message)
    } else {
      console.log('Email login successful')
      router.push('/admin/events')
    }
  } catch (error) {
    console.error('Error logging in with email:', error)
  }
}

const handleLinkedInLogin = () => authStore.handleLogin('linkedin')
const handleGoogleLogin = () => authStore.handleLogin('google')
const handleAppleLogin = () => authStore.handleLogin('apple')
const handleGitHubLogin = () => authStore.handleLogin('github')
</script>