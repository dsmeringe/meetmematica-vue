<template>
  <div v-if="event" class="max-w-2xl mx-auto">
    <h2 class="text-3xl font-bold mb-4">{{ event.title }}</h2>
    <div class="bg-white shadow rounded-lg p-6">
      <p class="text-gray-600 mb-2"><strong>Date:</strong> {{ formatDate(event.occurs) }}</p>
      <p class="text-gray-600 mb-2"><strong>Location:</strong> {{ event.location }}</p>
      <p class="text-gray-600 mb-4"><strong>Description:</strong> {{ event.description }}</p>
      <p class="text-gray-600 mb-2"><strong>Max Attendees:</strong> {{ event.max_attendees }}</p>
      <p class="text-gray-600 mb-2"><strong>Last Registration Date:</strong> {{ formatDate(event.last_registration_dt) }}</p>
      <p v-if="event.is_recurring" class="text-gray-600 mb-4">
        <strong>Recurring Event:</strong> Every {{ event.recurring_interval }} days
      </p>
      <h3 class="text-xl font-semibold mb-2">Registration Questions</h3>
      <form @submit.prevent="handleRegistration">
        <div v-for="question in questions" :key="question.id" class="mb-4">
          <label :for="'question-' + question.id" class="block text-gray-700 text-sm font-bold mb-2">
            {{ question.question }} {{ question.mandatory ? '*' : '' }}
          </label>
          <div v-if="question.type === 'dropdown'">
            <select :id="'question-' + question.id" v-model="answers[question.id]" :required="question.mandatory" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
              <option v-for="option in question.options" :key="option" :value="option">
                {{ option }}
              </option>
            </select>
          </div>
          <div v-else-if="question.type === 'text'">
            <input type="text" :id="'question-' + question.id" v-model="answers[question.id]" :required="question.mandatory" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
          </div>
          <div v-else-if="question.type === 'boolean'">
            <input type="checkbox" :id="'question-' + question.id" v-model="answers[question.id]" :required="question.mandatory" class="mr-2">
            <label :for="'question-' + question.id">Yes</label>
          </div>
        </div>
        <button type="submit" :disabled="!authStore.user" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed">
          Register for Event
        </button>
        <p v-if="!authStore.user" class="mt-2 text-red-500">Please log in to register for this event.</p>
      </form>
    </div>
  </div>
  <div v-else-if="loading" class="text-center text-gray-500">
    Loading event details...
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
import { supabase } from '../supabase'

interface Question {
  id: number;
  question: string;
  type: 'dropdown' | 'text' | 'boolean';
  options?: string[];
  mandatory: boolean;
  matchmaking: boolean;
}

interface Event {
  id: number;
  title: string;
  occurs: string;
  location: string;
  description: string;
  max_attendees: number;
  is_recurring: boolean;
  recurring_interval?: number;
  last_registration_dt: string;
}

const route = useRoute()
const event = ref<Event | null>(null)
const questions = ref<Question[]>([])
const answers = ref<Record<number, string | boolean>>({})
const authStore = useAuthStore()
const loading = ref(true)

onMounted(async () => {
  const eventId = route.params.id
  try {
    // Fetch event details
    const { data: eventData, error: eventError } = await supabase
      .from('Events')
      .select('*')
      .eq('id', eventId)
      .single()
    
    if (eventError) throw eventError
    event.value = eventData

    // Fetch questions for the event
    const { data: questionData, error: questionError } = await supabase
      .from('Questions')
      .select('*')
      .eq('event_id', eventId)
    
    if (questionError) throw questionError
    questions.value = questionData
  } catch (error) {
    console.error('Error fetching event details:', error)
  } finally {
    loading.value = false
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