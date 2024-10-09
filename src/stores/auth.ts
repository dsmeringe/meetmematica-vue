import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '../supabase'
import { Provider } from '@supabase/supabase-js'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<any>(null)
  const loading = ref(true)

  async function loadUser() {
    loading.value = true
    const { data } = await supabase.auth.getUser()
    user.value = data.user
    loading.value = false
  }

  async function handleLogin(provider: Provider) {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: provider,
    })
    if (error) console.error('Error logging in:', error.message)
  }

  async function handleEmailLogin(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })
    if (error) console.error('Error logging in with email:', error.message)
    return { error }
  }

  async function handleEmailRegister(email: string, password: string, fullName: string) {
    const { error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    })
    if (error) console.error('Error registering with email:', error.message)
    return { error }
  }

  async function handleLogout() {
    const { error } = await supabase.auth.signOut()
    if (error) console.error('Error logging out:', error.message)
    user.value = null
  }

  return { user, loading, loadUser, handleLogin, handleEmailLogin, handleEmailRegister, handleLogout }
})