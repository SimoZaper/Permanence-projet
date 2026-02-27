import { ref, computed } from 'vue'

// ─── helpers ────────────────────────────────────────────────────────────────

function addDays(dateStr, n) {
  // Parse as local date to avoid UTC midnight timezone offset issues
  const [y, m, d] = dateStr.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  date.setDate(date.getDate() + n)
  const yy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  return `${yy}-${mm}-${dd}`
}

function todayStr() {
  return new Date().toISOString().slice(0, 10)
}

// ─── demo data ───────────────────────────────────────────────────────────────

const today = todayStr()
const yesterday = addDays(today, -1)
const tomorrow = addDays(today, 1)
const inFiveDays = addDays(today, 5)
const tenDaysAgo = addDays(today, -10)
const fiveDaysAgo = addDays(today, -5)

const DEMO_AGENTS = [
  { id: '1', nom: 'Bennaji', prenom: 'Ahmed', role: 'Permanent' },
  { id: '2', nom: 'Martin', prenom: 'Sophie', role: 'Superviseur' },
  { id: '3', nom: 'Dupont', prenom: 'Pierre', role: 'Permanent' },
  { id: '4', nom: 'Lefèvre', prenom: 'Camille', role: 'Adjoint' },
  { id: '5', nom: 'Moreau', prenom: 'Julien', role: 'Permanent' },
]

const DEMO_ABSENCES = [
  {
    id: 'a1',
    agentId: '2',
    motif: 'Congé annuel',
    dateDebut: yesterday,
    dateFin: inFiveDays,
    dateRetourActif: addDays(inFiveDays, 1),
    dateIntegrationPermanences: addDays(inFiveDays, 2),
  },
  {
    id: 'a2',
    agentId: '4',
    motif: 'Arrêt maladie',
    dateDebut: tenDaysAgo,
    dateFin: fiveDaysAgo,
    dateRetourActif: addDays(fiveDaysAgo, 1),
    dateIntegrationPermanences: addDays(fiveDaysAgo, 2),
  },
]

// ─── state ───────────────────────────────────────────────────────────────────

function loadOrInit(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function initializeData() {
  if (!localStorage.getItem('perm_initialized')) {
    localStorage.setItem('perm_agents', JSON.stringify(DEMO_AGENTS))
    localStorage.setItem('perm_absences', JSON.stringify(DEMO_ABSENCES))
    localStorage.setItem('perm_initialized', '1')
  }
}

initializeData()

const agents = ref(loadOrInit('perm_agents', []))
const absences = ref(loadOrInit('perm_absences', []))

function saveAgents() {
  localStorage.setItem('perm_agents', JSON.stringify(agents.value))
}

function saveAbsences() {
  localStorage.setItem('perm_absences', JSON.stringify(absences.value))
}

// ─── computed ────────────────────────────────────────────────────────────────

function isAgentInactive(agentId) {
  const t = todayStr()
  return absences.value.some(
    (a) => a.agentId === agentId && t >= a.dateDebut && t <= a.dateFin
  )
}

function getActiveAbsence(agentId) {
  const t = todayStr()
  return absences.value.find(
    (a) => a.agentId === agentId && t >= a.dateDebut && t <= a.dateFin
  ) || null
}

const activeAgents = computed(() =>
  agents.value.filter((a) => !isAgentInactive(a.id))
)

const inactiveAgents = computed(() =>
  agents.value.filter((a) => isAgentInactive(a.id))
)

// ─── agents CRUD ─────────────────────────────────────────────────────────────

function addAgent(agent) {
  const newAgent = { ...agent, id: Date.now().toString() }
  agents.value.push(newAgent)
  saveAgents()
}

function updateAgent(id, data) {
  const idx = agents.value.findIndex((a) => a.id === id)
  if (idx !== -1) {
    agents.value[idx] = { ...agents.value[idx], ...data }
    saveAgents()
  }
}

function deleteAgent(id) {
  agents.value = agents.value.filter((a) => a.id !== id)
  absences.value = absences.value.filter((a) => a.agentId !== id)
  saveAgents()
  saveAbsences()
}

// ─── absences CRUD ───────────────────────────────────────────────────────────

function buildAbsence(data) {
  return {
    ...data,
    id: data.id || Date.now().toString(),
    dateRetourActif: addDays(data.dateFin, 1),
    dateIntegrationPermanences: addDays(data.dateFin, 2),
  }
}

function addAbsence(data) {
  absences.value.push(buildAbsence(data))
  saveAbsences()
}

function updateAbsence(id, data) {
  const idx = absences.value.findIndex((a) => a.id === id)
  if (idx !== -1) {
    absences.value[idx] = buildAbsence({ ...absences.value[idx], ...data })
    saveAbsences()
  }
}

function deleteAbsence(id) {
  absences.value = absences.value.filter((a) => a.id !== id)
  saveAbsences()
}

function getAgentById(id) {
  return agents.value.find((a) => a.id === id) || null
}

// ─── export ──────────────────────────────────────────────────────────────────

export function useStore() {
  return {
    agents,
    absences,
    activeAgents,
    inactiveAgents,
    isAgentInactive,
    getActiveAbsence,
    getAgentById,
    addAgent,
    updateAgent,
    deleteAgent,
    addAbsence,
    updateAbsence,
    deleteAbsence,
    addDays,
    todayStr,
  }
}
