# 📁 Dossier Archives

Ce dossier contient la documentation et les templates pour les archives de l'application **Permanence EXP**.

## Comment fonctionne l'archivage automatique ?

À chaque modification ou génération de planning dans l'application, un **snapshot complet** est automatiquement sauvegardé dans le `localStorage` du navigateur sous la clé `perm_exp_archive_v1`.

## Comment récupérer une archive ?

1. Ouvrir l'application
2. Aller dans l'onglet **Historique** (onglet 8)
3. Cliquer sur **Archives annuelles**
4. Cliquer sur le bouton **💾 Archive JSON**
5. Le fichier `planning_archive_YYYY-MM-DD.json` est téléchargé

## Structure du fichier d'archive JSON

```json
{
  "exportDate": "2026-03-04",
  "exportDateTime": "04/03/2026 14:30:00",
  "exportedBy": "admin",
  "totalEntries": 420,
  "prevEntries": 30,
  "generatedEntries": 390,
  "agents": [
    { "nom": "Nom Agent", "matricule": 12345 }
  ],
  "planning": [
    {
      "dateISO": "2026-01-01",
      "date": "01/01/2026",
      "jour": "Jeudi",
      "isPrev": false,
      "isWeekend": false,
      "agents": [{ "nom": "Agent", "matricule": 12345, "officiel": true }],
      "obs": ""
    }
  ]
}
```

## Restaurer depuis une archive

Depuis l'onglet **Paramètres**, utilisez le bouton **Importer JSON** et sélectionnez votre fichier d'archive.
