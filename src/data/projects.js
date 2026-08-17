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
    id: 'kinestat',
    status: 'deployed',
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
    id: 'cyberquiz',
    status: 'progress',
    stack: {
      fr: ['Kotlin', 'Jetpack Compose', 'Room', 'Hilt', 'Firebase'],
      en: ['Kotlin', 'Jetpack Compose', 'Room', 'Hilt', 'Firebase'],
    },
    link: '',
    articleLink: '',
    screenshots: [cyberquiz1, cyberquiz2, cyberquiz3, cyberquiz4],
    name: { fr: 'CyberQuiz', en: 'CyberQuiz' },
    summary: {
      fr: 'Application Android de quiz (programmation, IT, réseaux, cybersécurité), développée en solo et conçue pour importer des dizaines de milliers de questions multilingues sans changement de code.',
      en: 'Android quiz application (programming, IT, networks, cybersecurity), developed solo and designed to import tens of thousands of multilingual questions without changing code.',
    },
    tasks: {
      fr: [
        "Conception de l'architecture avec Room, Hilt et Navigation Compose",
        "Développement du système d'import de contenu par fichiers JSON, multilingue, sans redéploiement",
        'Intégration AdMob, Firebase Analytics et Crashlytics',
      ],
      en: [
        'Designed the architecture with Room, Hilt and Navigation Compose',
        'Built a JSON-based content import system, multilingual, with no redeployment needed',
        'Integrated AdMob, Firebase Analytics and Crashlytics',
      ],
    },
  },
  {
    id: 'student-tracking',
    status: 'school',
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
