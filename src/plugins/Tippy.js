import VueTippy from 'vue-tippy'
import 'tippy.js/dist/tippy.css'

export default (app) => {
  app.use(
    VueTippy,
    // optional
    {
      directive: 'tippy', // => v-tippy
      component: 'tippy', // => <tippy/>
      componentSingleton: 'tippy-singleton', // => <tippy-singleton/>,
      defaultProps: {
        arrow: true,
        arrowType: 'round',
        animation: 'fade',
        theme: 'light',
        placement: 'top',
        followCursor: true
      } // => Global default options * see all props
    }
  )
}
