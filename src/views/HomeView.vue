<script setup>
import { useStore } from '../stores/store.js'

const { activeAgents, inactiveAgents, agents, getActiveAbsence } = useStore()

function initials(agent) {
  return (agent.prenom[0] + agent.nom[0]).toUpperCase()
}

function formatDate(d) {
  if (!d) return ''
  const [y, m, j] = d.split('-')
  return `${j}/${m}/${y}`
}
</script>

<template>
  <div class="page">
    <h1 class="page-title">🏠 Accueil — Gestion des Permanences</h1>

    <!-- Stats row -->
    <div class="stats-grid" style="margin-bottom:1.5rem">
      <div class="stat-card blue">
        <div class="stat-value">{{ agents.length }}</div>
        <div class="stat-label">Total agents</div>
      </div>
      <div class="stat-card green">
        <div class="stat-value">{{ activeAgents.length }}</div>
        <div class="stat-label">Agents actifs</div>
      </div>
      <div class="stat-card red">
        <div class="stat-value">{{ inactiveAgents.length }}</div>
        <div class="stat-label">En absence</div>
      </div>
    </div>

    <div class="home-grid">
      <!-- LEFT: active agents -->
      <div class="card">
        <div class="card-header">✅ Agents actifs ({{ activeAgents.length }})</div>
        <div v-if="activeAgents.length === 0" class="empty-state">
          <div class="empty-icon">👤</div>
          Aucun agent actif
        </div>
        <div v-else class="agent-list-scroll">
          <div v-for="agent in activeAgents" :key="agent.id" class="agent-item">
            <div class="agent-avatar">{{ initials(agent) }}</div>
            <div style="flex:1">
              <div class="agent-name">{{ agent.prenom }} {{ agent.nom }}</div>
              <div class="agent-role">
                <span class="badge badge-role">{{ agent.role }}</span>
              </div>
            </div>
            <span class="badge badge-actif">ACTIF</span>
          </div>
        </div>
      </div>

      <!-- RIGHT: absent agents -->
      <div class="card">
        <div class="card-header">🏖️ En congé / absence ({{ inactiveAgents.length }})</div>
        <div v-if="inactiveAgents.length === 0" class="empty-state">
          <div class="empty-icon">🎉</div>
          Aucun agent absent aujourd'hui
        </div>
        <div v-else>
          <div v-for="agent in inactiveAgents" :key="agent.id" class="absent-card">
            <div class="absent-name">
              {{ agent.prenom }} {{ agent.nom }}
              <span class="badge badge-inactif" style="margin-left:.5rem">INACTIF</span>
            </div>
            <div v-if="getActiveAbsence(agent.id)" style="font-size:.87rem">
              <span class="badge badge-motif">{{ getActiveAbsence(agent.id).motif }}</span>
              <div class="absent-meta">
                📅 Du {{ formatDate(getActiveAbsence(agent.id).dateDebut) }}
                au {{ formatDate(getActiveAbsence(agent.id).dateFin) }}
              </div>
              <div class="absent-meta">
                🔄 Retour prévu le : <strong>{{ formatDate(getActiveAbsence(agent.id).dateRetourActif) }}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
