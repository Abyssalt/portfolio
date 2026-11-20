# Portfolio

Mon portfolio de développeur Junior, conçu comme un IDE : chaque page du site est un fichier ouvert dans un éditeur de code. Déployé via GitHub Pages et conçu avec Vue 3 + Vite.

## Structure

```
public/
  favicon.svg
  cv/                        → CV FR/EN téléchargeables

src/
  main.js                    → point d'entrée, monte l'IDE
  i18n.js                    → tous les textes FR/EN du contenu

  ide/
    IdeApp.vue               → la coque de l'IDE : barre de titre, activité, explorateur,
                               onglets, éditeur, barre d'état, raccourcis clavier
    content.js               → données localisées + arborescence de fichiers
    source.js                → génère le "code source" de chaque fichier
    strings.js               → textes de l'interface de l'IDE (FR/EN)
    ide.css                  → thèmes clair/sombre, coloration syntaxique, typographie

    components/
      Explorer.vue           → arborescence de fichiers
      QuickOpen.vue          → palette Ctrl+P / Ctrl+Maj+P
      CodeView.vue           → vue "code source" avec numéros de ligne
      FileIcon.vue           → icônes de fichiers

    pages/                   → une page = un fichier
      HomePage.vue           → README.md (accueil + à propos)
      EducationPage.vue      → formation.json (formation + certifications)
      ProjectPage.vue        → CyberQuiz.kt, KineStat.cs, ...
      SkillsPage.vue         → competences.json
      ContactPage.vue        → contact.md
      CvPage.vue             → CV (aperçu PDF)
      WelcomePage.vue        → écran affiché quand aucun onglet n'est ouvert

  components/
    ProjectLogo.vue
    TechChip.vue
    Lightbox.vue             → visualiseur plein écran des captures

  composables/
    useTheme.js
    useLocale.js

  data/
    projects.js              → ajouter un projet ici l'ajoute aussi dans l'explorateur
    education.js
    certifications.js        → mes certifications (logo, date, lien…) : à compléter
    skills.js
    techIcons.js

  assets/
    logos/
    screenshots/<projet>/
```

## Raccourcis

- `Ctrl + P` : ouvrir un fichier
- `Ctrl + Maj + P` : palette de commandes (thème, langue, CV, GitHub…)
- `Ctrl + B` : afficher / masquer la barre latérale

## Faire tourner le projet

1. Cloner le projet
2. Se placer dans le même dossier que le fichier `docker-compose.yml`
3. Lancer la commande `docker compose up -d`
4. Accéder à l'url `localhost:5173`.
