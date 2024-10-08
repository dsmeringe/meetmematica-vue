<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-semibold text-gray-800">Manage Events</h2>
      <router-link to="/admin/events/create" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Create New Event
      </router-link>
    </div>

    <div class="bg-white shadow-md rounded-lg overflow-hidden">
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
              Status
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
                {{ formatDate(event.date) }}
              </p>
            </td>
            <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
              <p class="text-gray-900 whitespace-no-wrap">
                {{ event.location }}
              </p>
            </td>
            <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
              <span
                class="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight"
              >
                <span
                  aria-hidden
                  class="absolute inset-0 bg-green-200 opacity-50 rounded-full"
                ></span>
                <span class="relative">{{ event.status }}</span>
              </span>
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

interface Event {
  id: number;
  title: string;
  date: string;
  location: string;
  status: string;
}

const events = ref<Event[]>([])

onMounted(() => {
  // Fetch events from API
  // For now, we'll use mock data
  events.value = [
    { id: 1, title: 'Padel Tennis Tournament', date: '2023-12-15T14:00:00', location: 'City Sports Center', status: 'Active' },
    { id: 2, title: 'Networking Mixer', date: '2023-12-20T18:00:00', location: 'Downtown Conference Center', status: 'Active' },
    { id: 3, title: 'Tech Meetup', date: '2023-12-22T19:00:00', location: 'Tech Hub', status: 'Draft' },
  ]
})

const formatDate = (dateString: string) => {
  return format(new Date(dateString), 'MMMM d, yyyy h:mm a')
}

const deleteEvent = (eventId: number) => {
  // Implement delete logic here
  console.log('Delete event', eventId)
  // After successful deletion, remove the event from the list
  events.value = events.value.filter(event => event.id !== eventId)
}
</script>