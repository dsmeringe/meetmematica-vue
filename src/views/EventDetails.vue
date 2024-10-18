<template>
  <div v-if="event && !registered" class="max-w-2xl mx-auto">
    <h2 class="text-3xl font-bold mb-4">{{ event.title }}</h2>
    <div class="bg-white shadow rounded-lg p-6">
      <p class="text-gray-600 mb-2"><strong>Date:</strong> {{ (event.event.occurs) }}</p>
      <p class="text-gray-600 mb-2"><strong>Location:</strong> {{ event.event.location }}</p>
      <p class="text-gray-600 mb-4"><strong>Description:</strong> {{ event.event.description }}</p>
      <p class="text-gray-600 mb-2"><strong>Max Attendees:</strong> {{ event.max_attendees }}</p>
      <p class="text-gray-600 mb-2"><strong>Last Registration Date:</strong> {{ (event.last_registration_dt) }}</p>
      <p v-if="event.event.recurring == 0 || event.event.recurring_interval > 1" class="text-gray-600 mb-4">
        <strong>Recurring Event:</strong> Every {{ event.event.recurring_interval }} days
      </p>
      <h3 class="text-xl font-semibold mb-2">Registration Questions</h3>
      <form @submit.prevent="handleRegistration">
        <div v-for="(question, index) in questions" :key="index" class="mb-4">
          <label :for="'question-' + question.id" class="block text-gray-700 text-sm font-bold mb-2">
            {{ question.question }} {{ question.mandatory ? '*' : '' }}
          </label>
          <div v-if="question.type === 'dropdown'">
            <select 
              :id="'question-' + index" 
              v-model="question.answer" 
              :required="question.mandatory" 
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option v-for="option in question.options" :key="option" :value="option">
                {{ option }}
              </option>
            </select>
          </div>
          <div v-else-if="question.type === 'shorttext'">
            <input 
              type="text" 
              :id="'question-' + index" 
              v-model="question.answer" 
              :required="question.mandatory" 
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div v-else-if="question.type === 'longtext' || question.type === 'text'">
            <input 
              type="textarea" 
              :id="'question-' + index" 
              v-model="question.answer" 
              :required="question.mandatory" 
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div v-else-if="question.type === 'number'">
            <input 
              type="number" 
              :id="'question-' + index" 
              v-model="question.answer" 
              :required="question.mandatory" 
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div v-else-if="question.type === 'boolean'">
            <input 
              type="checkbox" 
              :id="'question-' + index" 
              v-model="question.answer" 
              :required="question.mandatory"  class="mr-2">
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
  <div v-else-if="registered && event">
    <div class="max-w-2xl mx-auto">
      <h2 class="text-3xl font-bold mb-4">Registration Successful for {{ event.event.title }}!</h2>
      <div class="bg-white shadow rounded-lg p-6">
        <p class="text-gray-600 mb-2"><strong>Date:</strong> {{ event.event.occurs }}</p>
        <p class="text-gray-600 mb-2"><strong>Location:</strong> {{ event.event.location }}</p>
        <p class="text-gray-600 mb-4"><strong>Description:</strong> {{ event.event.description }}</p>
        <p class="text-gray-600 mb-2"><strong>Max Attendees:</strong> {{ event.max_attendees }}</p>
        <p class="text-gray-600 mb-2"><strong>Last Registration Date:</strong> {{ event.last_registration_dt }}</p>
      </div>
      <RouterLink to="/events" class="block mt-4 text-blue-500 hover:text-blue-700">Back to Events</RouterLink>
    </div>
  </div>
  <div v-else-if="loading" class="text-center text-gray-500">
    Loading event details...
  </div>
  <div v-else class="text-center text-gray-500">
    Event not found and a life crisis is happening
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { supabase } from '../supabase'
import { EventInstance, Question } from '../types'


const route = useRoute()
const event = ref<EventInstance | null>(null)
const questions = ref<Question[]>([])
const authStore = useAuthStore()
const loading = ref(true)
const registered = ref(false)

onMounted(async () => {
  const eventId = route.params.id
  try {
    // Fetch event details for the next upcoming event
    const { data: eventData, error: eventError } = await supabase
      .from('EventInstances')
      .select(`
      *,
      event:Events (
        *
      )
      `)
      .eq('event_id', eventId)
      .gt('instance_occurs', new Date().toISOString())
      .order('instance_occurs', { ascending: true })
      .limit(1)
      .single()

    if (eventError) throw eventError
    event.value = eventData
    console.log(event.value)

    // Fetch questions for the event
    const { data: questionData, error: questionError } = await supabase
      .from('Questions')
      .select('*')
      .eq('event_id', eventId)
    
    if (questionError) throw questionError
    questions.value = questionData
  } catch (error) {
    console.error('Error fetching event details:', error + ' ')
  } finally {
    loading.value = false
  }
})
/*
const formatDate = (dateString: string) => {
  let date = new Date(dateString)
  try {
    format(new Date(dateString), 'MMMM d, yyyy h:mm a')
  } catch (error) {
    console.error('Error formatting date:', error)
  }
  return date
}*/

const handleRegistration = async () => {
  if (!authStore.user) {
    console.log('User not logged in')
    return
  }

  try {
    // Insert registration
    const { data: registrationData, error: registrationError } = await supabase
      .from('Registrations')
      .insert({
        event_instance_id: event.value?.id,
        user_id: authStore.user.id,
    })
    .select()
    .single()
  
    if (registrationError) throw registrationError

    const registrationId = registrationData.id

    // Insert answers
    const answersToInsert = questions.value
      .filter(question => question.id !== undefined)
      .map(question => ({
        question_id: question.id,
        answer_text: typeof question.answer === 'string' ? question.answer : null,
        answer_date: null,
        answer_number: null,
        user_id: authStore.user.id,
        event_instance_id: event.value?.id,
        registration_id: registrationId,
      }))

    const { error: answersError } = await supabase
      .from('QuestionAnswers')
      .insert(answersToInsert)
    
    if (answersError) throw answersError

    console.log('Registration successful')
    registered.value = true
  } catch (error) {
    console.error('Error registering:', error)
  }
}
</script>