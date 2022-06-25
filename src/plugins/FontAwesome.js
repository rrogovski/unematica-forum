import { library } from '@fortawesome/fontawesome-svg-core'
import { faPencilAlt, faCamera, faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faPencilAlt, faCamera, faPlus)
export default (app) => {
  app.component('faIcon', FontAwesomeIcon)
}
