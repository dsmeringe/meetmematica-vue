<template>
    <div class="max-w-md mx-auto">
      <h2 class="text-2xl font-bold mb-4">User Settings</h2>
      <div v-if="loading" class="text-center">Loading...</div>
      <div v-else>
        <div class="mb-4">
          <label class="block text-gray-700">Email:</label>
          <input v-model="user.email" type="email" class="w-full px-3 py-2 border rounded" disabled />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700">Full Name:</label>
          <input v-model="user.full_name" type="text" class="w-full px-3 py-2 border rounded" />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700">Phone:</label>
          <input v-model="user.phone" type="tel" class="w-full px-3 py-2 border rounded" />
        </div>
        <button @click="updateUser" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Save Changes
        </button>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { supabase } from '../../supabase'
  import { useAuthStore } from '../../stores/auth'
  
  const authStore = useAuthStore()
  const user = ref({ email: '', full_name: '', phone: '' })
  const loading = ref(true)
  
  onMounted(async () => {
    loading.value = true
    if (authStore.user) {
      user.value.email = authStore.user.email
      user.value.full_name = authStore.user.user_metadata.full_name || ''
      user.value.phone = authStore.user.user_metadata.phone || ''
    }
    loading.value = false
  })
  
  const updateUser = async () => {
    const { error } = await supabase.auth.updateUser({
      data: { full_name: user.value.full_name, phone: user.value.phone }
    })
    if (error) {
      console.error('Error updating user:', error.message)
    } else {
      alert('User updated successfully')
    }
  }
  </script>