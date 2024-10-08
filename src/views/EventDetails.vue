<template>
  <div v-if="event" class="max-w-2xl mx-auto">
    <h2 class="text-3xl font-bold mb-4">{{ event.title }}</h2>
    <div class="bg-white shadow rounded-lg p-6">
      <p class="text-gray-600 mb-2"><strong>Date:</strong> {{ formatDate(event.date) }}</p>
      <p class="text-gray-600 mb-2"><strong>Location:</strong> {{ event.location }}</p>
      <p class="text-gray-600 mb-4"><strong>Description:</strong> {{ event.description }}</p>
      <p class="text-gray-600 mb-2"><strong>Max Attendees:</strong> {{ event.maxAttendees }}</p>
      <p class="text-gray-600 mb-2"><strong>Last Registration Date:</strong> {{ formatDate(event.lastRegistrationDate) }}</p>
      <p v-if="event.isRecurring" class="text-gray-600 mb-4">
        <strong>Recurring Event:</strong> Every {{ event.recurringInterval }} days
      </p>
      <h3 class="text-xl font-semibold mb-2">Registration Questions</h3>
      <form @submit.prevent="handleRegistration">
        <div v-for="(question, index) in event.dynamicQuestions" :key="index" class="mb-4">
          <label :for="'question-' + index" class="block text-gray-700 text-sm font-bold mb-2">
            {{ question.text }} {{ question.isMandatory ? '*' : '' }}
          </label>
          <div v-if="question.type === 'dropdown'">
            <select :id="'question-' + index" v-model="answers[index]" :required="question.isMandatory" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
              <option v-for="option in question.options.split(',')" :key="option" :value="option">
                {{ option.trim() }}
              </option>
            </select>
          </div>
          <div v-else-if="question.type === 'text'">
            <input type="text" :id="'question-' + index" v-model="answers[index]" :required="question.isMandatory" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
          </div>
          <div v-else-if="question.type === 'boolean'">
            <input type="checkbox" :id="'question-' + index" v-model="answers[index]" :required="question.isMandatory" class="mr-2">
            <label :for="'question-' + index">Yes</label>
          </div>
        </div>
        <button type="submit" :disabled="!authStore.user" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed">
          Register for Event
        </button>
        <p v-if="!authStore.user" class="mt-2 text-red-500">Please log in to register for this event.</p>
      </form>
    </div>
  </div>
  <div v-else class="text-center text-gray-500">
    Event not found.
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { format } from 'date-fns'
import { useAuthStore } from '../stores/auth'

interface DynamicQuestion {
  text: string;
  type: 'dropdown' | 'text' | 'boolean';
  options?: string;
  isMandatory: boolean;
  isWeighted: boolean;
}

interface Event {
  id: number;
  title: string;
  date: string;
  location: string;
  description: string;
  maxAttendees: number;
  isRecurring: boolean;
  recurringInterval?: number;
  lastRegistrationDate: string;
  dynamicQuestions: DynamicQuestion[];
}

const route = useRoute()
const event = ref<Event | null>(null)
const answers = ref<(string | boolean)[]>([])
const authStore = useAuthStore()

onMounted(() => {
  // Fetch event details from API using route.params.id
  // For now, we'll use mock data
  event.value = {
    id: 1,
    title: 'Padel Tennis Tournament',
    date: '2023-12-15T14:00:00',
    location: 'City Sports Center',
    description: 'Join us for an exciting padel tennis tournament!',
    maxAttendees: 16,
    isRecurring: true,
    recurringInterval: 14,
    lastRegistrationDate: '2023-12-14T23:59:59',
    dynamicQuestions: [
      {
        text: 'What is your skill level?',
        type: 'dropdown',
        options: 'Beginner,Intermediate,Advanced',
        isMandatory: true,
        isWeighted: true,
      },
      {
        text: 'Do you have your own racket?',
        type: 'boolean',
        isMandatory: false,
        isWeighted: false,
      },
      {
        text: 'Any additional comments?',
        type: 'text',
        isMandatory: false,
        isWeighted: false,
      },
    ],
  }
})

const formatDate = (dateString: string) => {
  return format(new Date(dateString), 'MMMM d, yyyy h:mm a')
}

const handleRegistration = () => {
  if (!authStore.user) {
    console.log('User not logged in')
    return
  }
  // Implement registration logic here
  console.log('Registration submitted', { eventId: event.value?.id, answers: answers.value })
}
</script>