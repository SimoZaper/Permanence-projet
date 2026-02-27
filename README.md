# Permanence-projet

Application de gestion de permanence — gestion des agents, absences/congés et planning des permanences.

## Fonctionnalités

- **🏠 Accueil** : Vue d'ensemble avec les agents actifs et la liste des agents en congé/absence
- **👥 Agents** : Gestion CRUD des agents avec statut ACTIF/INACTIF automatique
- **🏖️ Absences** (`/repos/absence`) : Enregistrement des absences avec calcul automatique des dates de retour (J+1) et d'intégration aux permanences (J+2)
- **📊 Tableau de bord** : Affichage uniquement des agents actifs

## Installation et démarrage

```sh
npm install
npm run dev
```

## Production

```sh
npm run build
```

