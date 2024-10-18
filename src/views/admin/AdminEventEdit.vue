<template>
  <div>
    <h2 class="text-2xl font-semibold text-gray-800 mb-6" v-if="route.params.id">Edit Event</h2>
    <h2 class="text-2xl font-semibold text-gray-800 mb-6" v-else>Create Event</h2>
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
          Recurring Event (0 for non-recurring, above 1 for recurring)
        </label>
        <input v-model="event.recurring"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="recurring" type="number" min="0" />
      </div>
      <div v-if="event.recurring == 0 || event.recurring_interval > 1" class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="recurring_interval">
          recurring Interval (days)
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
      <div class="mb-4 border rounded py-4 px-3 leading-tight bg-zinc-100">
        <h3 class="text-lg font-bold mb-2">Dynamic Questions</h3>
        <button @click.prevent="addQuestion"
          class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-2">
          Add Question
        </button>
        <div v-for="(question, index) in questions" :key="index" class="mb-4 p-4 border rounded bg-zinc-50">
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
          Save Event
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
import { Event, Question } from '../../types'

const route = useRoute()
const router = useRouter()
const event = ref<Event | null>(null)
const questions = ref<Question[]>([])

onMounted(async () => {
  const eventId = route.params.id
  if (typeof(eventId) !== 'undefined') {
    try {
      // Fetch event details
      const { data: eventData, error: eventError } = await supabase
        .from('Events')
        .select('*')
        .eq('id', eventId)
        .single()

      if (eventError) throw eventError
      event.value = eventData
      if (event.value) {
        event.value.occurs = new Date(event.value.occurs.substring(0, 19)).toISOString()
        event.value.last_registration_dt = new Date(event.value.last_registration_dt.substring(0, 19)).toISOString()
      }
      console.log('Event:', event.value)

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
  } else {
    event.value = {
      id: 0,
      title: '',
      description: '',
      occurs: new Date().toISOString(),
      location: '',
      max_attendees: 1,
      recurring: 1,
      recurring_interval: 0,
      last_registration_dt: new Date().toISOString(),
    }
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

  if (event.value.id) {

    console.log('Updating event:', event.value)

    try {
      // Update event
      const { error: eventError } = await supabase
        .from('Events')
        .update(event.value)
        .eq('id', event.value.id);

      if (eventError) throw eventError; 
  
      // Delete questions that are no longer present
      const questionIds = questions.value.map(q => q.id);
      const { error: deleteError } = await supabase
        .from('Questions')
        .delete()
        .in('id', questionIds)
        .eq('event_id', event.value!.id);
    
      if (deleteError) throw deleteError
    
      // Handle upsert of questions
      
      const questionsToUpsert = questions.value.map(q => ({
        ...q,
        event_id: event.value!.id,
        options: q.type === 'dropdown' ? q.options?.join(',') : null
      }));

      const { error: questionsError } = await supabase
        .from('Questions')
        .upsert(questionsToUpsert, { onConflict: 'id' });

      if (questionsError) throw questionsError;

      // Redirect to event list after successful update
      router.push('/admin/events')

    } catch (error) {
      console.error('Error updating event:', error)
    }
  } else {
    handleCreateEvent()
  }
}

const handleCreateEvent = async () => {
  try {
    console.log('Creating event:', event.value)
    let eventCopy = event.value 
    if (eventCopy) delete eventCopy.id
    // Insert event
    const { data: eventData, error: eventError } = await supabase
      .from('Events')
      .insert([eventCopy])
      .select()
    
    if (eventError) throw eventError

    const newEventId = eventData[0].id

    // Insert questions
    if (questions.value.length > 0) {
      const questionsWithEventId = questions.value.map(q => ({
        ...q,
        event_id: newEventId,
        options: q.type === 'dropdown' ? q.options?.join(',') : null
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