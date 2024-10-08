<template>
  <div>
    <h2 class="text-2xl font-semibold text-gray-800 mb-6">Edit Event</h2>
    <form v-if="event" @submit.prevent="handleUpdateEvent" class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
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
        <label class="block text-gray-700 text-sm font-bold mb-2" for="date">
          Date and Time
        </label>
        <input v-model="event.date" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="date" type="datetime-local">
      </div>
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="location">
          Location
        </label>
        <input v-model="event.location" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="location" type="text" placeholder="Event Location">
      </div>
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="maxAttendees">
          Max Attendees
        </label>
        <input v-model="event.maxAttendees" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="maxAttendees" type="number" min="1">
      </div>
      <div class="mb-4">
        <label class="flex items-center">
          <input v-model="event.isRecurring" type="checkbox" class="form-checkbox">
          <span class="ml-2 text-gray-700 text-sm font-bold">Recurring Event</span>
        </label>
      </div>
      <div v-if="event.isRecurring" class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="recurringInterval">
          Recurring Interval (days)
        </label>
        <input v-model="event.recurringInterval" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="recurringInterval" type="number" min="1">
      </div>
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="lastRegistrationDate">
          Last Registration Date
        </label>
        <input v-model="event.lastRegistrationDate" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="lastRegistrationDate" type="date">
      </div>
      <div class="mb-4">
        <h3 class="text-lg font-bold mb-2">Dynamic Questions</h3>
        <button @click.prevent="addQuestion" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-2">
          Add Question
        </button>
        <div v-for="(question, index) in event.dynamicQuestions" :key="index" class="mb-4 p-4 border rounded">
          <input v-model="question.text" placeholder="Question" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2">
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
              <input v-model="question.isMandatory" type="checkbox" class="form-checkbox">
              <span class="ml-2">Mandatory</span>
            </label>
          </div>
          <div>
            <label class="flex items-center">
              <input v-model="question.isWeighted" type="checkbox" class="form-checkbox">
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
import { useRoute } from 'vue-router'

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
  description: string;
  date: string;
  location: string;
  maxAttendees: number;
  isRecurring: boolean;
  recurringInterval?: number;
  lastRegistrationDate: string;
  dynamicQuestions: DynamicQuestion[];
}

const route = useRoute()
const event = ref<Event | null>(null)

onMounted(() => {
  // Fetch event details from API using route.params.id
  // For now, we'll use mock data
  event.value = {
    id: 1,
    title: 'Padel Tennis Tournament',
    description: 'Join us for an exciting padel tennis tournament!',
    date: '2023-12-15T14:00:00',
    location: 'City Sports Center',
    maxAttendees: 16,
    isRecurring: true,
    recurringInterval: 14,
    lastRegistrationDate: '2023-12-14',
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

const addQuestion = () => {
  if (event.value) {
    event.value.dynamicQuestions.push({
      text: '',
      type: 'text',
      isMandatory: false,
      isWeighted: false,
    })
  }
}

const removeQuestion = (index: number) => {
  if (event.value) {
    event.value.dynamicQuestions.splice(index, 1)
  }
}

const handleUpdateEvent = () => {
  // Implement event update logic here
  console.log('Update event', event.value)
  // After successful update, redirect to the event list or show a success message
}
</script>