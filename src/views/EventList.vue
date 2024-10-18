<template>
  <div>
    <h2 class="text-2xl font-bold mb-4">Upcoming Events</h2>
    <div v-if="events.length === 0" class="text-center text-gray-500">
      No events available at the moment.
    </div>
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="event in events" :key="event.id" class="bg-white shadow rounded-lg p-6">
        <h3 class="text-xl font-semibold mb-2">{{ event.title }}</h3>
        <p class="text-gray-600 mb-2">{{ formatDate(event.occurs) }}</p>
        <p class="text-gray-600 mb-2">{{ event.location }}</p>
        <p class="text-gray-600 mb-4">{{ event.description }}</p>
        <router-link :to="'/events/' + event.id" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          View Details
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { format } from 'date-fns'
import { supabase } from '../supabase'
import { Event } from '../types'

/*
const events = ref<Event[]>([])

onMounted(() => {
  // Fetch events from API
  // For now, we'll use mock data
  events.value = [
    { id: 1, title: 'Padel Tennis Tournament', date: '2023-12-15T14:00:00', location: 'City Sports Center', description: 'Join us for an exciting padel tennis tournament!' },
    { id: 2, title: 'Networking Mixer', date: '2023-12-20T18:00:00', location: 'Downtown Conference Center', description: 'Connect with professionals from various industries.' },
    { id: 3, title: 'Tech Meetup', date: '2023-12-22T19:00:00', location: 'Tech Hub', description: 'Discuss the latest trends in technology and innovation.' },
  ]
})*/
const events = ref<Event[]>([])
const loading = ref(true)

onMounted(async () => {
  try {
    const { data, error } = await supabase
      .from('Events')
      .select('*')
      .gte('occurs', new Date().toISOString())
      .order('occurs', { ascending: true })
    
    if (error) throw error
    events.value = data
  } catch (error) {
    console.error('Error fetching events:', error)
  } finally {
    loading.value = false
  }
})

const formatDate = (dateString: string) => {
  return format(new Date(dateString), 'MMMM d, yyyy h:mm a')
}
</script>