<template>
  <div>
    <h2 class="text-2xl font-semibold text-gray-800 mb-6">Create New Event</h2>
    <form @submit.prevent="handleCreateEvent" class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="title">
          Event Title
        </label>
        <input v-model="event.title" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="title" type="text" placeholder="Event Title">
      </div>
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="description">
          Description
        </label>
        <textarea v-model="event.description" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="description" placeholder="Event Description"></textarea>
      </div>
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="occurs">
          Date and Time
        </label>
        <input v-model="event.occurs" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="occurs" type="datetime-local">
      </div>
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="location">
          Location
        </label>
        <input v-model="event.location" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="location" type="text" placeholder="Event Location">
      </div>
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="max_attendees">
          Max Attendees
        </label>
        <input v-model="event.max_attendees" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="max_attendees" type="number" min="1">
      </div>
      <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="recurring">
            Recurring Event
          </label>
          <input v-model="event.recurring" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="location" type="text" placeholder="Event Location">
      </div>
      <div v-if="event.recurring == 0 || event.recurring > 1" class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="recurring_interval">
          Recurring Interval (days)
        </label>
        <input v-model="event.recurring_interval" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="recurring_interval" type="number" min="1">
        <span style="font-size:0.7em">
          <button @click="event.recurring_interval=7" class="bg-green-500 hover:bg-green-700 text-white py-0 px-2 rounded mb-2">Weekly (7d)</button>
        <button @click="event.recurring_interval=14" class="bg-green-500 hover:bg-green-700 text-white py-0 px-2 rounded mb-2">Bi-weekly (14d)</button>
        <button @click="event.recurring_interval=30" class="bg-green-500 hover:bg-green-700 text-white py-0 px-2 rounded mb-2">Monthly (30d)</button>
        <button @click="event.recurring_interval=365" class="bg-green-500 hover:bg-green-700 text-white py-0 px-2 rounded mb-2">Yearly (365d)</button></span>
      </div>
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="last_registration_dt">
          Last Registration Date
        </label>
        <input v-model="event.last_registration_dt" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="last_registration_dt" type="datetime-local">
      </div>
      <div class="mb-4">
        <h3 class="text-lg font-bold mb-2">Dynamic Questions</h3>
        <button @click.prevent="addQuestion" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-2">
          Add Question
        </button>
        <div v-for="(question, index) in questions" :key="index" class="mb-4 p-4 border rounded">
          <input v-model="question.question" placeholder="Question" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2">
          <select v-model="question.type" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2">
            <option value="dropdown">Dropdown</option>
            <option value="text">Free Text</option>
            <option value="boolean">Yes/No</option>
          </select>
          <div v-if="question.type === 'dropdown'">
            <input v-model="question.options" placeholder="Options (comma-separated)" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2">
          </div>
          <div>
            <label class="flex items-center">
              <input v-model="question.mandatory" type="checkbox" class="form-checkbox">
              <span class="ml-2">Mandatory</span>
            </label>
          </div>
          <div>
            <label class="flex items-center">
              <input v-model="question.matchmaking" type="checkbox" class="form-checkbox">
              <span class="ml-2">Use for Matchmaking</span>
            </label>
          </div>
          <button @click.prevent="removeQuestion(index)" class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded mt-2">
            Remove
          </button>
        </div>
      </div>
      <div class="flex items-center justify-between">
        <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          Create Event
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../../supabase'

interface Question {
  question: string;
  type: 'dropdown' | 'text' | 'boolean';
  options?: string;
  mandatory: boolean;
  matchmaking: boolean;
}

interface Event {
  title: string;
  description: string;
  occurs: string;
  location: string;
  max_attendees: number;
  recurring: number;
  recurring_interval?: number;
  last_registration_dt: string;
}

const router = useRouter()
const event = reactive<Event>({
  title: '',
  description: '',
  occurs: '',
  location: '',
  max_attendees: 0,
  recurring: 1,
  last_registration_dt: '',
})

const questions = ref<Question[]>([])

const addQuestion = () => {
  questions.value.push({
    question: '',
    type: 'text',
    mandatory: false,
    matchmaking: false,
  })
}

const removeQuestion = (index: number) => {
  questions.value.splice(index, 1)
}

const handleCreateEvent = async () => {
  try {
    // Insert event
    const { data: eventData, error: eventError } = await supabase
      .from('Events')
      .insert([event])
      .select()
    
    if (eventError) throw eventError

    const eventId = eventData[0].id

    // Insert questions
    if (questions.value.length > 0) {
      const questionsWithEventId = questions.value.map(q => ({
        ...q,
        event_id: eventId,
        options: q.type === 'dropdown' ? q.options?.split(',').map(o => o.trim()) : null
      }))

      const { error: questionsError } = await supabase
        .from('Questions')
        .insert(questionsWithEventId)

      if (questionsError) throw questionsError
    }

    // Redirect to event list after successful creation
    router.push('/admin/events')
  } catch (error) {
    console.error('Error creating event:', error)
  }
}
</script>