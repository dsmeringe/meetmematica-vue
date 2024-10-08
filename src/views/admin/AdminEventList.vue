<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-semibold text-gray-800">Manage Events</h2>
      <router-link to="/admin/events/create" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Create New Event
      </router-link>
    </div>

    <div v-if="loading" class="text-center text-gray-500">
      Loading events...
    </div>
    <div v-else-if="events.length === 0" class="text-center text-gray-500">
      No events available.
    </div>
    <div v-else class="bg-white shadow-md rounded-lg overflow-hidden">
      <table class="min-w-full leading-normal">
        <thead>
          <tr>
            <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Event Title
            </th>
            <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Date
            </th>
            <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Location
            </th>
            <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="event in events" :key="event.id">
            <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
              <div class="flex items-center">
                <div class="ml-3">
                  <p class="text-gray-900 whitespace-no-wrap">
                    {{ event.title }}
                  </p>
                </div>
              </div>
            </td>
            <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
              <p class="text-gray-900 whitespace-no-wrap">
                {{ formatDate(event.occurs) }}
              </p>
            </td>
            <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
              <p class="text-gray-900 whitespace-no-wrap">
                {{ event.location }}
              </p>
            </td>
            <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
              <router-link :to="`/admin/events/${event.id}/edit`" class="text-indigo-600 hover:text-indigo-900 mr-3">
                Edit
              </router-link>
              <button @click="deleteEvent(event.id)" class="text-red-600 hover:text-red-900">
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { format } from 'date-fns'
import { supabase } from '../../supabase'

interface Event {
  id: number;
  title: string;
  occurs: string;
  location: string;
}

const events = ref<Event[]>([])
const loading = ref(true)

onMounted(async () => {
  try {
    const { data, error } = await supabase
      .from('Events')
      .select('*')
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

const deleteEvent = async (eventId: number) => {
  try {
    const { error } = await supabase
      .from('Events')
      .delete()
      .eq('id', eventId)
    
    if (error) throw error
    
    // After successful deletion, remove the event from the list
    events.value = events.value.filter(event => event.id !== eventId)
  } catch (error) {
    console.error('Error deleting event:', error)
  }
}
</script>