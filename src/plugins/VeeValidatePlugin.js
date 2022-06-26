import { Form, Field, ErrorMessage, defineRule, configure } from 'vee-validate'
import { required, email, min, url } from '@vee-validate/rules'
import { localize } from '@vee-validate/i18n'
import { db } from '@/helpers/firebase'
import { collection, getDocs, query, where } from 'firebase/firestore'
export default app => {
  defineRule('required', required)
  defineRule('email', (email) => {
    if (!email || !email.length) {
      return true
    }

    if (!/^[A-Za-z0-9._%+-]+@unemat\.br$/.test(email)) {
      return 'Use o seu e-mail institucional (seu.nome@unemat.br)'
    }

    return true
  })
  defineRule('min', min)
  defineRule('url', url)
  defineRule('unique', async (value, args) => {
    let coll, field, excluding
    if (Array.isArray(args)) {
      ;[coll, field, excluding] = args
    } else {
      ;({ coll, field, excluding } = args)
    }
    if (value === excluding) return true
    const queryArgs = [collection(db, coll), where(field, '==', value)]
    const fieldQuery = query(...queryArgs)
    const querySnapshot = await getDocs(fieldQuery)
    return querySnapshot.empty
  })

  configure({
    generateMessage: localize('pt-BR', {
      messages: {
        required: '{field} é obrigatório',
        email: '{field} deve ser um e-mail válido',
        min: '{field} deve ser um mínimo de 0:{min} caracteres',
        unique: '{field} já utilizado',
        url: '{field} dever ser uma URL válida'
      }
    })
  })

  app.component('VeeForm', Form)
  app.component('VeeField', Field)
  app.component('VeeErrorMessage', ErrorMessage)
}
