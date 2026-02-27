<script setup>
import { useStore } from '../stores/store.js'

const { agents, activeAgents, inactiveAgents, todayStr } = useStore()

function initials(a) { return (a.prenom[0] + a.nom[0]).toUpperCase() }

function formatToday() {
  const [y, m, d] = todayStr().split('-')
  return new Date(y, m - 1, d).toLocaleDateString('fr-FR', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  })
}
</script>

<template>
  <div class="page">
    <h1 class="page-title">📊 Tableau de bord</h1>

    <div class="info-box" style="margin-bottom:1.5rem">
      📅 Aujourd'hui : <strong>{{ formatToday() }}</strong>
    </div>

    <!-- Stats -->
    <div class="stats-grid">
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

    <!-- Active agents grid -->
    <div class="section-header" style="margin-top:2rem">
      <span class="section-title">✅ Agents disponibles pour la permanence</span>
    </div>

    <div v-if="activeAgents.length === 0" class="card empty-state">
      <div class="empty-icon">😔</div>
      Aucun agent actif aujourd'hui
    </div>

    <div v-else class="agent-grid">
      <div v-for="agent in activeAgents" :key="agent.id" class="agent-card">
        <div class="agent-card-avatar">{{ initials(agent) }}</div>
        <div class="agent-card-name">{{ agent.prenom }} {{ agent.nom }}</div>
        <div class="agent-card-role">{{ agent.role }}</div>
        <div style="margin-top:.6rem"><span class="badge badge-actif">ACTIF</span></div>
      </div>
    </div>

    <div class="info-box">
      ℹ️ <strong>Règle J+2 :</strong> Un agent en absence est réintégré dans les permanences
      deux jours après la date de fin de son absence.
      Le statut ACTIF / INACTIF est calculé automatiquement à partir de la date du jour.
    </div>
  </div>
</template>
