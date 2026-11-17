import kinestat1 from '../assets/screenshots/kinestat/1.png'
import kinestat2 from '../assets/screenshots/kinestat/2.png'
import kinestat3 from '../assets/screenshots/kinestat/3.png'
import kinestat4 from '../assets/screenshots/kinestat/4.png'
import kinestat5 from '../assets/screenshots/kinestat/5.png'

import cyberquiz1 from '../assets/screenshots/cyberquiz/1.png'
import cyberquiz2 from '../assets/screenshots/cyberquiz/2.png'
import cyberquiz3 from '../assets/screenshots/cyberquiz/3.png'
import cyberquiz4 from '../assets/screenshots/cyberquiz/4.png'

export const projects = [
  {
    id: 'cyberquiz',
    fileName: 'CyberQuiz.kt',
    language: 'Kotlin',
    status: ['deployed'],
    stack: {
      fr: ['Kotlin', 'Jetpack Compose', 'Room', 'Hilt', 'Coroutines / Flow', 'DataStore', 'Firebase', 'AdMob'],
      en: ['Kotlin', 'Jetpack Compose', 'Room', 'Hilt', 'Coroutines / Flow', 'DataStore', 'Firebase', 'AdMob'],
    },
    link: 'https://play.google.com/store/apps/details?id=com.cyberquiz.app',
    linkType: 'playStore',
    articleLink: '',
    screenshots: [cyberquiz1, cyberquiz2, cyberquiz3, cyberquiz4],
    screenshotsLayout: 'phones', // phone screens side by side instead of one large picture
    screenshotsFeatured: [0, 2, 3], // which of them are shown inline (all stay in the lightbox)
    name: { fr: 'CyberQuiz', en: 'CyberQuiz' },
    summary: {
      fr: 'Application Android de quiz (programmation, réseaux, cybersécurité), développée en solo et publiée sur Google Play : des centaines de questions dans plusieurs langues, défi quotidien, mode infini et statistiques.',
      en: 'Android quiz application (programming, networking, cybersecurity), developed solo and published on Google Play: hundreds of questions in several languages, daily challenge, infinite mode and statistics.',
    },
    tasks: {
      fr: [
        "Architecture Clean Architecture / MVVM avec Room, Hilt, DataStore et Navigation Compose",
        "Système d'import de contenu par fichiers JSON, multilingue : ajouter une catégorie ou une langue ne demande aucun changement de code",
        "Intégration d'AdMob avec consentement RGPD (Google UMP), Firebase Analytics et Crashlytics",
        'Publication sur Google Play : test fermé, puis production',
      ],
      en: [
        'Clean Architecture / MVVM with Room, Hilt, DataStore and Navigation Compose',
        'JSON-based multilingual content import system: adding a category or a language needs no code change',
        'Integrated AdMob with GDPR consent (Google UMP), Firebase Analytics and Crashlytics',
        'Published on Google Play: closed testing, then production',
      ],
    },
  },
  {
    id: 'kinestat',
    fileName: 'KineStat.cs',
    language: 'C#',
    status: ['deployed', 'school'],
    stack: {
      fr: ['C#', 'ASP.NET Core', 'Entity Framework', 'PostgreSQL', 'IIS', 'Docker'],
      en: ['C#', 'ASP.NET Core', 'Entity Framework', 'PostgreSQL', 'IIS', 'Docker'],
    },
    link: 'https://github.com/Abyssalt/kinestat',
    articleLink: 'https://hers.be/les-sections-kinesitherapie-et-informatique-au-service-du-diagnostic-clinique/',
    screenshots: [kinestat1, kinestat2, kinestat3, kinestat4, kinestat5],
    name: { fr: 'KineStat', en: 'KineStat' },
    summary: {
      fr: 'Application de suivi statistique pour cabinets de kinésithérapie, développée en équipe puis déployée en production.',
      en: 'Statistics-tracking application for physiotherapy practices, developed as a team project and later deployed to production.',
    },
    tasks: {
      fr: [
        'Développement en équipe de 6 en méthode Agile — C# / .NET, Entity Framework, PostgreSQL',
        "Recruté par l'école comme job étudiant pour déployer l'application en production (Windows Server / IIS)",
        "Mise en place du support Docker pour que n'importe qui puisse tester l'application en local",
      ],
      en: [
        'Built as part of a 6-person team using Agile — C# / .NET, Entity Framework, PostgreSQL',
        'Hired by the school as a student worker to deploy the application to production (Windows Server / IIS)',
        'Added Docker support so anyone could test the application locally',
      ],
    },
  },
  {
    id: 'student-tracking',
    fileName: 'SuiviEtudiants.java',
    language: 'Java',
    status: ['school'],
    stack: {
      fr: ['Java', 'Spring Boot', 'MySQL', "Travail d'équipe (6)"],
      en: ['Java', 'Spring Boot', 'MySQL', 'Team of 6'],
    },
    link: '',
    articleLink: '',
    screenshots: [],
    name: { fr: 'Plateforme de suivi des étudiants', en: 'Student tracking platform' },
    summary: {
      fr: 'Plateforme web permettant aux enseignants de suivre de façon centralisée le parcours académique des étudiants, réalisée en équipe de 6 dans le cadre du bachelier.',
      en: "Web platform letting teachers centrally track students' academic progress, built with a team of 6 as part of the bachelor's program.",
    },
    tasks: {
      fr: ['Développement back-end et front-end de la plateforme (Java / Spring Boot)'],
      en: ['Back-end and front-end development of the platform (Java / Spring Boot)'],
    },
  },
]
