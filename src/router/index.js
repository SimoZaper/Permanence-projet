import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AgentsView from '../views/AgentsView.vue'
import AbsencesView from '../views/AbsencesView.vue'
import DashboardView from '../views/DashboardView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: HomeView },
    { path: '/agents', component: AgentsView },
    { path: '/repos/absence', component: AbsencesView },
    { path: '/tableau-de-bord', component: DashboardView },
  ],
})

export default router
