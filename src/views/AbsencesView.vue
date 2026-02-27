<script setup>
import { ref, reactive, computed } from 'vue'
import { useStore } from '../stores/store.js'

const { agents, absences, getAgentById, addAbsence, deleteAbsence, addDays } = useStore()

const showForm = ref(false)

const form = reactive({ agentId: '', motif: '', dateDebut: '', dateFin: '' })

const preview = computed(() => {
  if (!form.dateFin) return null
  return {
    retour: addDays(form.dateFin, 1),
    integration: addDays(form.dateFin, 2),
  }
})

function formatDate(d) {
  if (!d) return ''
  const [y, m, j] = d.split('-')
  return `${j}/${m}/${y}`
}

function agentName(agentId) {
  const a = getAgentById(agentId)
  return a ? `${a.prenom} ${a.nom}` : '—'
}

function submit() {
  if (!form.agentId || !form.motif.trim() || !form.dateDebut || !form.dateFin) {
    alert('Veuillez remplir tous les champs.')
    return
  }
  if (form.dateFin < form.dateDebut) {
    alert('La date de fin doit être postérieure à la date de début.')
    return
  }
  addAbsence({ agentId: form.agentId, motif: form.motif, dateDebut: form.dateDebut, dateFin: form.dateFin })
  form.agentId = ''; form.motif = ''; form.dateDebut = ''; form.dateFin = ''
  showForm.value = false
}

function confirmDelete(id) {
  if (confirm('Supprimer cette absence ?')) deleteAbsence(id)
}

const sortedAbsences = computed(() =>
  [...absences.value].sort((a, b) => b.dateDebut.localeCompare(a.dateDebut))
)
</script>

<template>
  <div class="page">
    <div class="section-header">
      <h1 class="page-title" style="margin-bottom:0">🏖️ Gestion des absences</h1>
      <button class="btn btn-primary" @click="showForm = !showForm">
        {{ showForm ? '✕ Fermer' : '➕ Nouvelle absence' }}
      </button>
    </div>

    <!-- Add form -->
    <div v-if="showForm" class="card" style="margin-bottom:1.5rem">
      <div class="card-header">➕ Enregistrer une absence</div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Agent *</label>
          <select v-model="form.agentId" class="form-control">
            <option value="" disabled>-- Choisir un agent --</option>
            <option v-for="a in agents" :key="a.id" :value="a.id">{{ a.prenom }} {{ a.nom }}</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Motif *</label>
          <input v-model="form.motif" class="form-control" placeholder="ex : Congé annuel, Arrêt maladie…" />
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Date de début *</label>
          <input v-model="form.dateDebut" type="date" class="form-control" />
        </div>
        <div class="form-group">
          <label class="form-label">Date de fin *</label>
          <input v-model="form.dateFin" type="date" class="form-control" />
        </div>
      </div>

      <div v-if="preview" class="form-preview">
        <strong>📅 Dates calculées automatiquement</strong>
        🔄 Date de retour actif : <strong>{{ formatDate(preview.retour) }}</strong>
        &nbsp;·&nbsp;
        📋 Intégration permanences : <strong>{{ formatDate(preview.integration) }}</strong>
      </div>

      <div style="margin-top:1rem;display:flex;gap:.75rem;justify-content:flex-end">
        <button class="btn btn-secondary" @click="showForm=false">Annuler</button>
        <button class="btn btn-success" @click="submit">✅ Enregistrer</button>
      </div>
    </div>

    <!-- Table -->
    <div class="card">
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Agent</th>
              <th>Motif</th>
              <th>Date début</th>
              <th>Date fin</th>
              <th>Retour actif (J+1)</th>
              <th>Intégration perm. (J+2)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="sortedAbsences.length === 0">
              <td colspan="7" class="empty-state">
                <div class="empty-icon">🏖️</div>
                Aucune absence enregistrée
              </td>
            </tr>
            <tr v-for="abs in sortedAbsences" :key="abs.id">
              <td><strong>{{ agentName(abs.agentId) }}</strong></td>
              <td><span class="badge badge-motif">{{ abs.motif }}</span></td>
              <td>{{ formatDate(abs.dateDebut) }}</td>
              <!-- YYYY-MM-DD string comparison is lexicographically equivalent to date comparison -->
              <td>{{ formatDate(abs.dateFin) }}</td>
              <td>{{ formatDate(abs.dateRetourActif) }}</td>
              <td>{{ formatDate(abs.dateIntegrationPermanences) }}</td>
              <td>
                <button class="btn btn-danger btn-sm" @click="confirmDelete(abs.id)">🗑️ Supprimer</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="info-box">
      ℹ️ <strong>Règle de calcul :</strong> La date de retour actif correspond au lendemain de la date de fin (J+1).
      L'intégration dans les permanences se fait le surlendemain (J+2).
    </div>
  </div>
</template>
