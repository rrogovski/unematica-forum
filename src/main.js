import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router'
import VueTippy from 'vue-tippy'
import 'tippy.js/dist/tippy.css'

const forumApp = createApp(App)

forumApp.use(router)

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

forumApp.mount('#app')
