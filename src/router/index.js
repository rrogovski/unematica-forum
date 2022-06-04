import { createRouter, createWebHistory } from 'vue-router'
import sourceData from '@/data.json'

import NotFound from '@/pages/NotFoundView'
import Home from '@/pages/HomeView'
import ThreadShow from '@/pages/ThreadShowView'
import Forum from '@/pages/ForumView'
import Category from '@/pages/CategoryView'
import Profile from '@/pages/ProfileView'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/me',
    name: 'Profile',
    component: Profile,
    meta: {
      toTop: true,
      smoothScroll: true
    }
  },
  {
    path: '/me/edit',
    name: 'ProfileEdit',
    component: Profile,
    props: { edit: true }
  },
  {
    path: '/category/:id',
    name: 'Category',
    component: Category,
    props: true
  },
  {
    path: '/forum/:id',
    name: 'Forum',
    component: Forum,
    props: true
  },
  {
    path: '/thread/:id',
    name: 'ThreadShow',
    component: ThreadShow,
    props: true,
    beforeEnter (to, from, next) {
      const threadExists = sourceData.threads.find(thread => thread.id === to.params.id)

      if (threadExists) {
        next()
      } else {
        next({
          name: 'NotFound',
          params: { pathMatch: to.path.substring(1).split('/') },
          query: to.query,
          hash: to.hash
        })
      }
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior (to) {
    const scroll = {}

    if (to.meta.toTop) scroll.top = 0

    if (to.meta.smoothScroll) scroll.behavior = 'smooth'

    return scroll
  }
})

export default router
