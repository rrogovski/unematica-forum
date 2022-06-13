import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router'
import store from '@/store'
import Tippy from './plugins/Tippy'
import FontAwesome from '@/plugins/FontAwesome'

const forumApp = createApp(App)

forumApp.use(router)
forumApp.use(store)
forumApp.use(Tippy)
forumApp.use(FontAwesome)

// Registra globalmente todos os componentes de um diretório com o sufixo 'App'
const requireComponent = require.context('./components', true, /App[A-Z]\w+\.(vue|js)$/)
requireComponent.keys().forEach(function (fileName) {
  let baseComponentConfig = requireComponent(fileName)
  baseComponentConfig = baseComponentConfig.default || baseComponentConfig
  const baseComponentName = baseComponentConfig.name || (
    fileName
      .replace(/^.+\//, '')
      .replace(/\.\w+$/, '')
  )
  forumApp.component(baseComponentName, baseComponentConfig)
})

forumApp.mount('#app')
