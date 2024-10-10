<template>
  <div>
    <h2 class="text-2xl font-semibold text-gray-800 mb-6">Edit Event</h2>
    <form v-if="event" @submit.prevent="handleUpdateEvent" class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="title">
          Event Title
        </label>
        <input v-model="event.title"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="title" type="text" placeholder="Event Title">
      </div>
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="description">
          Description
        </label>
        <textarea v-model="event.description"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="description" placeholder="Event Description"></textarea>
      </div>
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="occurs">
          Date and Time
        </label>
        <input v-model="event.occurs"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="occurs" type="datetime-local">
      </div>
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="location">
          Location
        </label>
        <input v-model="event.location"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="location" type="text" placeholder="Event Location">
      </div>
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="max_attendees">
          Max Attendees
        </label>
        <input v-model="event.max_attendees"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="max_attendees" type="number" min="1">
      </div>
      <div class="mb-4">
        <label class="flex items-center" for="recurring">
          Recurring Event (0 for non-recurring)
        </label>
        <input v-model="event.recurring"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="recurring" type="number" min="0" />
      </div>
      <div v-if="event.recurring == 0 || event.recurring > 1" class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="recurring_interval">
          Recurring Interval (days)
        </label>
        <input v-model="event.recurring_interval"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="recurring_interval" type="number" min="1">
      </div>
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="last_registration_dt">
          Last Registration Date
        </label>
        <input v-model="event.last_registration_dt"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="last_registration_dt" type="datetime-local">
      </div>
      <div class="mb-4">
        <h3 class="text-lg font-bold mb-2">Dynamic Questions</h3>
        <button @click.prevent="addQuestion"
          class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-2">
          Add Question
        </button>
        <div v-for="(question, index) in questions" :key="index" class="mb-4 p-4 border rounded">
          <input v-model="question.question" placeholder="Question"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2">
          <select v-model="question.type"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2">
            <option value="dropdown">Dropdown</option>
            <option value="shorttext">One line text</option>
            <option value="longtext">Free Text</option>
            <option value="date">Free Text</option>
            <option value="boolean">Yes/No</option>
          </select>
          <div v-if="question.type === 'dropdown'">
            <input v-model="question.options" placeholder="Options (comma-separated)"
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2">
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
          <button @click.prevent="removeQuestion(index)"
            class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded mt-2">
            Remove
          </button>
        </div>
      </div>
      <div class="flex items-center justify-between">
        <button type="submit"
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          Update Event
        </button>
      </div>
    </form>
    <div v-else class="text-center text-gray-500">
      Loading event details...
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { supabase } from '../../supabase'

interface Question {
  id?: number;
  question: string;
  type: 'dropdown' | 'shorttext' | 'longtext' | 'float' | 'boolean' | 'date';
  options?: string;
  mandatory: boolean;
  matchmaking: boolean;
}

interface Event {
  id: number;
  title: string;
  description: string;
  occurs: string;
  location: string;
  max_attendees: number;
  recurring: number;
  recurring_interval?: number;
  last_registration_dt: string;
}

const route = useRoute()
const router = useRouter()
const event = ref<Event | null>(null)
const questions = ref<Question[]>([])

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
    questions.value = questionData.map(q => ({
      ...q,
      options: q.options ? q.options.join(',') : ''
    }))
  } catch (error) {
    console.error('Error fetching event details:', error)
  }
})

const addQuestion = () => {
  questions.value.push({
    question: '',
    type: 'shorttext',
    mandatory: false,
    matchmaking: false,
  })
}

const removeQuestion = (index: number) => {
  questions.value.splice(index, 1)
}

const handleUpdateEvent = async () => {
  if (!event.value) return

  try {
    // Update event
    const { error: eventError } = await supabase
      .from('Events')
      .update(event.value)
      .eq('id', event.value.id)

    if (eventError) throw eventError

    // Update questions
    const questionsToUpdate = questions.value.filter(q => q.id).map(q => ({
      ...q,
      event_id: event.value!.id,
      options: q.type === 'dropdown' ? q.options?.split(',').map(o => o.trim()) : null
    }))

    const questionsToInsert = questions.value.filter(q => !q.id).map(q => ({
      ...q,
      event_id: event.value!.id,
      options: q.type === 'dropdown' ? q.options?.split(',').map(o => o.trim()) : null
    }))
 
    /*
    const questionIdsToKeep = questionsToUpdate.map(q => q.id)

    // Delete questions that are no longer present
   
    const { error: deleteError } = await supabase
      .from('Questions')
      .delete()
      .eq('event_id', event.value.id)
      .not('id', 'in', questionIdsToKeep)

    if (deleteError) throw deleteError
    */

    // Update existing questions
    if (questionsToUpdate.length > 0) {
      const { error: updateError } = await supabase
        .from('Questions')
        .upsert(questionsToUpdate)

      if (updateError) throw updateError
    }

    // Insert new questions
    if (questionsToInsert.length > 0) {
      const { error: insertError } = await supabase
        .from('Questions')
        .insert(questionsToInsert)

      if (insertError) throw insertError
    }

    // Redirect to event list after successful update
    router.push('/admin/events')

  } catch (error) {
    console.error('Error updating event:', error)
  }
}
</script>