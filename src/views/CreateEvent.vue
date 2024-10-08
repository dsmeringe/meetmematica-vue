<template>
  <div class="max-w-2xl mx-auto">
    <h2 class="text-2xl font-bold mb-4">Create New Event</h2>
    <form @submit.prevent="handleCreateEvent">
      <div class="mb-4">
        <label for="title" class="block text-gray-700 text-sm font-bold mb-2">Event Title</label>
        <input type="text" id="title" v-model="event.title" required class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
      </div>
      <div class="mb-4">
        <label for="description" class="block text-gray-700 text-sm font-bold mb-2">Description</label>
        <textarea id="description" v-model="event.description" rows="3" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"></textarea>
      </div>
      <div class="mb-4">
        <label for="date" class="block text-gray-700 text-sm font-bold mb-2">Date and Time</label>
        <input type="datetime-local" id="date" v-model="event.date" required class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
      </div>
      <div class="mb-4">
        <label for="location" class="block text-gray-700 text-sm font-bold mb-2">Location</label>
        <input type="text" id="location" v-model="event.location" required class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
      </div>
      <div class="mb-4">
        <label for="maxAttendees" class="block text-gray-700 text-sm font-bold mb-2">Max Attendees</label>
        <input type="number" id="maxAttendees" v-model="event.maxAttendees" required class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
      </div>
      <div class="mb-4">
        <label for="isRecurring" class="block text-gray-700 text-sm font-bold mb-2">Recurring Event</label>
        <input type="checkbox" id="isRecurring" v-model="event.isRecurring" class="mr-2">
        <span>Is this a recurring event?</span>
      </div>
      <div v-if="event.isRecurring" class="mb-4">
        <label for="recurringInterval" class="block text-gray-700 text-sm font-bold mb-2">Recurring Interval (days)</label>
        <input type="number" id="recurringInterval" v-model="event.recurringInterval" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
      </div>
      <div class="mb-4">
        <label for="lastRegistrationDate" class="block text-gray-700 text-sm font-bold mb-2">Last Registration Date</label>
        <input type="date" id="lastRegistrationDate" v-model="event.lastRegistrationDate" required class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
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
            <input type="checkbox" v-model="question.isMandatory" id="isMandatory" class="mr-2">
            <label for="isMandatory">Mandatory</label>
          </div>
          <div>
            <input type="checkbox" v-model="question.isWeighted" id="isWeighted" class="mr-2">
            <label for="isWeighted">Use for Matchmaking</label>
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
}
</script>