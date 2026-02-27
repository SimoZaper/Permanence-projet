<script setup>
import { ref, reactive } from 'vue'
import { useStore } from '../stores/store.js'

const { agents, isAgentInactive, getActiveAbsence, addAgent, updateAgent, deleteAgent } = useStore()

const showModal = ref(false)
const editingId = ref(null)

const form = reactive({ nom: '', prenom: '', role: '' })

function openAdd() {
  editingId.value = null
  form.nom = ''; form.prenom = ''; form.role = ''
  showModal.value = true
}

function openEdit(agent) {
  editingId.value = agent.id
  form.nom = agent.nom; form.prenom = agent.prenom; form.role = agent.role
  showModal.value = true
}

function closeModal() { showModal.value = false }

function submit() {
  if (!form.nom.trim() || !form.prenom.trim()) return
  if (editingId.value) {
    updateAgent(editingId.value, { nom: form.nom, prenom: form.prenom, role: form.role })
  } else {
    addAgent({ nom: form.nom, prenom: form.prenom, role: form.role })
  }
  closeModal()
}

function confirmDelete(id) {
  if (confirm('Supprimer cet agent et toutes ses absences ?')) deleteAgent(id)
}

function initials(a) { return (a.prenom[0] + a.nom[0]).toUpperCase() }

function formatDate(d) {
  if (!d) return ''
  const [y, m, j] = d.split('-')
  return `${j}/${m}/${y}`
}
</script>

<template>
  <div class="page">
    <div class="section-header">
      <h1 class="page-title" style="margin-bottom:0">👥 Gestion des agents</h1>
      <button class="btn btn-primary" @click="openAdd">➕ Nouvel agent</button>
    </div>

    <div class="card">
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Agent</th>
              <th>Rôle</th>
              <th>Statut</th>
              <th>Motif / Retour</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="agents.length === 0">
              <td colspan="5" class="empty-state">
                <div class="empty-icon">👤</div>
                Aucun agent enregistré
              </td>
            </tr>
            <tr v-for="agent in agents" :key="agent.id">
              <td>
                <div style="display:flex;align-items:center;gap:.6rem">
                  <div class="agent-avatar" style="width:32px;height:32px;font-size:.75rem">{{ initials(agent) }}</div>
                  <div>
                    <div class="agent-name">{{ agent.prenom }} {{ agent.nom }}</div>
                  </div>
                </div>
              </td>
              <td><span class="badge badge-role">{{ agent.role }}</span></td>
              <td>
                <span v-if="isAgentInactive(agent.id)" class="badge badge-inactif">INACTIF</span>
                <span v-else class="badge badge-actif">ACTIF</span>
              </td>
              <td>
                <template v-if="isAgentInactive(agent.id) && getActiveAbsence(agent.id)">
                  <span class="badge badge-motif">{{ getActiveAbsence(agent.id).motif }}</span>
                  <div style="font-size:.78rem;color:#64748b;margin-top:.25rem">
                    Retour : {{ formatDate(getActiveAbsence(agent.id).dateRetourActif) }}
                  </div>
                </template>
                <span v-else style="color:#94a3b8;font-size:.85rem">—</span>
              </td>
              <td>
                <div style="display:flex;gap:.4rem">
                  <button class="btn btn-warning btn-sm" @click="openEdit(agent)">✏️ Modifier</button>
                  <button class="btn btn-danger btn-sm" @click="confirmDelete(agent.id)">🗑️ Supprimer</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="modal-backdrop" @click.self="closeModal">
      <div class="modal">
        <div class="modal-header">
          <h3>{{ editingId ? '✏️ Modifier l\'agent' : '➕ Nouvel agent' }}</h3>
          <button class="modal-close" @click="closeModal">×</button>
        </div>
        <div class="modal-body">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Prénom *</label>
              <input v-model="form.prenom" class="form-control" placeholder="ex : Ahmed" />
            </div>
            <div class="form-group">
              <label class="form-label">Nom *</label>
              <input v-model="form.nom" class="form-control" placeholder="ex : Bennaji" />
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Rôle</label>
            <input v-model="form.role" class="form-control" placeholder="ex : Permanent, Superviseur…" />
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="closeModal">Annuler</button>
          <button class="btn btn-primary" @click="submit">
            {{ editingId ? 'Enregistrer' : 'Ajouter' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
