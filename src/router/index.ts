import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import CreateEvent from '../views/CreateEvent.vue'
import EventList from '../views/EventList.vue'
import EventDetails from '../views/EventDetails.vue'
import AdminDashboard from '../views/admin/AdminDashboard.vue'
import AdminEventList from '../views/admin/AdminEventList.vue'
import AdminEventCreate from '../views/admin/AdminEventCreate.vue'
import AdminEventEdit from '../views/admin/AdminEventEdit.vue'
import { useAuthStore } from '../stores/auth'

const routes = [
  { path: '/', component: Home },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/create-event', component: CreateEvent },
  { path: '/events', component: EventList },
  { path: '/events/:id', component: EventDetails },
  { 
    path: '/admin', 
    component: AdminDashboard,
    meta: { requiresAuth: true },
    children: [
      { path: 'events', component: AdminEventList },
      { path: 'events/create', component: AdminEventCreate },
      { path: 'events/:id/edit', component: AdminEventEdit },
    ]
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore()
  
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!authStore.user) {
      next({ path: '/login', query: { redirect: to.fullPath } })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router