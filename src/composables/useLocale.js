import { ref, watchEffect } from 'vue'

const STORAGE_KEY = 'portfolio-locale'
const SUPPORTED = ['fr', 'en']

function getInitialLocale() {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (SUPPORTED.includes(stored)) return stored
  const browserLang = navigator.language?.slice(0, 2)
  return SUPPORTED.includes(browserLang) ? browserLang : 'fr'
}

const locale = ref(getInitialLocale())

watchEffect(() => {
  document.documentElement.setAttribute('lang', locale.value)
  localStorage.setItem(STORAGE_KEY, locale.value)
})

export function useLocale() {
  function setLocale(l) {
    if (SUPPORTED.includes(l)) locale.value = l
  }
  function toggleLocale() {
    locale.value = locale.value === 'fr' ? 'en' : 'fr'
  }
  return { locale, setLocale, toggleLocale }
}
