# Permanence-projet

Application de gestion de permanence — Tour de Permanence EXP.

## Description

Application web complète (SPA) pour la gestion des tours de permanence du service EXP. Fonctionne entièrement hors-ligne, sans serveur ni étape de build — 100% localStorage.

## Utilisation

Ouvrir le fichier `permanence_EXP.html` directement dans un navigateur web moderne (Chrome, Firefox, Edge).

### Connexion

- **Administrateur** : identifiant `admin`, mot de passe `admin123`
- **Lecteur** : accès en lecture seule + export

## Fonctionnalités

- **Accueil** : Grille de 18 jours + tableau détaillé + barre latérale (prochaine rotation, en congé, alertes)
- **Tours Précédents** : Saisie manuelle / rapide ⚡ / automatique 🤖 avec validation et génération annuelle
- **Planning Complet** : Vues liste, calendrier mensuel et hebdomadaire avec filtres
- **Agents** : CRUD avec photo (base64), statistiques, activation/désactivation
- **Repos/Absences** : Congé / Maladie / Mission avec recalcul automatique du planning
- **Échanges** : Formulaire de permutation avec historique audité
- **Tableau de Bord** : Graphiques (Chart.js), tableau comparatif, alertes configurables
- **Historique** : Journal des modifications, archivage annuel, journal de connexion
- **Paramètres** : Mode rotation, gestion utilisateurs, seuils, backup JSON, mode sombre

## Règles métier

| Règle | Description |
|-------|-------------|
| R01 | Rotation cyclique par ordre croissant de matricule |
| R02/R03 | Récupération : semaine/dimanche → J+1 ; samedi → J+3 (mardi) |
| R04 | Retour de congé : J-1 = inéligible ; J-2 = éligible |
| R05 | Agent indisponible → passé mais conserve sa position |
| R06 | Jours multi-agents : le plus jeune matricule avance le cycle |
| R07 | Mode WEEK : index semaine/weekend indépendants |
| R08 | Échanges : agent officiel compte dans le cycle |

## Exports

- **PDF** (jsPDF) : Tableau 18 jours coloré avec en-tête et pagination
- **Excel** (SheetJS) : 5 feuilles — planning, stats, repos, échanges, journal
- **JSON** : Sauvegarde/restauration complète de l'état

## Internationalisation

Français / Arabe avec basculement RTL et police Cairo.
