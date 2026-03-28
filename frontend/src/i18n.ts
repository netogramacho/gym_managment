import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import ptBRAuth from './locales/pt_BR/auth.json'
import ptBRErrors from './locales/pt_BR/errors.json'
import enAuth from './locales/en/auth.json'
import enErrors from './locales/en/errors.json'

i18n.use(initReactI18next).init({
  lng: 'pt_BR',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
  resources: {
    pt_BR: {
      auth: ptBRAuth,
      errors: ptBRErrors,
    },
    en: {
      auth: enAuth,
      errors: enErrors,
    },
  },
})

export default i18n
