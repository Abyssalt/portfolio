const DEVICON_BASE = 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons'

const ICONS = {
  Java: 'java/java-original',
  'C#': 'csharp/csharp-original',
  Kotlin: 'kotlin/kotlin-original',
  Python: 'python/python-original',
  'ASP.NET Core': 'dotnetcore/dotnetcore-plain',
  'Spring Boot': 'spring/spring-original',
  'Jetpack Compose': 'android/android-plain',
  PostgreSQL: 'postgresql/postgresql-original',
  'SQL Server': 'microsoftsqlserver/microsoftsqlserver-plain',
  MySQL: 'mysql/mysql-original',
  Docker: 'docker/docker-original',
  'Docker Compose': 'docker/docker-original',
  Git: 'git/git-original',
  GitHub: 'github/github-original',
  GitLab: 'gitlab/gitlab-original',
  Firebase: 'firebase/firebase-plain',
}

export function techIconUrl(name) {
  const path = ICONS[name]
  return path ? `${DEVICON_BASE}/${path}.svg` : null
}
