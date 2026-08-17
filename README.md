# Portfolio

Mon portfolio de développeur Junior. Déployé via GitHub Pages et conçu avec Vue 3 + Vite.

## Structure

```
public/
  favicon.svg                
  cv/                        → CV FR/EN téléchargeables

src/
  App.vue                    → structure de la page, sections
  style.css                  
  i18n.js                    → tous les textes FR/EN
  main.js

  components/
    ProjectCard.vue          
    ProjectLogo.vue          
    TechChip.vue             
    Lightbox.vue             → visualiseur plein écran des captures

  composables/
    useTheme.js              
    useLocale.js             

  data/
    projects.js              
    education.js             
    skills.js                
    techIcons.js             

  assets/
    logos/                   
    screenshots/<projet>/    
```