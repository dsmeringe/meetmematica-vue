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
          Create Event
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

interface DynamicQuestion {
  text: string;
  type: 'dropdown' | 'text' | 'boolean';
  options?: string;
  isMandatory: boolean;
  isWeighted: boolean;
}

interface Event {
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

const event = reactive<Event>({
  title: '',
  description: '',
  date: '',
  location: '',
  maxAttendees: 0,
  isRecurring: false,
  lastRegistrationDate: '',
  dynamicQuestions: [],
})

const addQuestion = () => {
  event.dynamicQuestions.push({
    text: '',
    type: 'text',
    isMandatory: false,
    isWeighted: false,
  })
}

const removeQuestion = (index: number) => {
  event.dynamicQuestions.splice(index, 1)
}

const handleCreateEvent = () => {
  // Implement event creation logic here
  console.log('Create event', event)
  // After successful creation, redirect to the event list or show a success message
}
</script>