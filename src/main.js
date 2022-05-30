import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router'
import store from '@/store'
import VueTippy from 'vue-tippy'

import 'tippy.js/dist/tippy.css'

const forumApp = createApp(App)

forumApp.use(router)
forumApp.use(store)

forumApp.use(
  VueTippy,
  // optional
  {
    directive: 'tippy', // => v-tippy
    component: 'tippy', // => <tippy/>
    componentSingleton: 'tippy-singleton', // => <tippy-singleton/>,
    defaultProps: {
      placement: 'auto-end',
      allowHTML: true
    } // => Global default options * see all props
  }
)

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
