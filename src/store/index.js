import { createStore } from 'vuex'
import { collection, doc, query, where, getDoc, getDocs, documentId } from 'firebase/firestore'
import { db } from '@/helpers/firebase'

import { findById, upsert } from '@/helpers'

export default createStore({
  state: {
    categories: [],
    forums: [],
    threads: [],
    posts: [],
    users: [],
    authId: 'VXjpr2WHa8Ux4Bnggym8QFLdv5C3'
  },
  getters: {
    authUser: (state, getters) => {
      return getters.user(state.authId)
    },
    user: state => {
      return (id) => {
        const user = findById(state.users, id)

        if (!user) return null

        return {
          ...user,
          // authUser.posts
          get posts () {
            return state.posts.filter(post => post.userId === user.id)
          },
          // authUser.postsCount
          get postsCount () {
            return this.posts.length
          },
          // authUser.threads
          get threads () {
            return state.threads.filter(thread => thread.userId === user.id)
          },
          // authUser.threadsCount
          get threadsCount () {
            return this.threads.length
          }
        }
      }
    },
    thread: state => {
      return (id) => {
        const thread = findById(state.threads, id)

        if (!thread) return {}

        return {
          ...thread,
          get author () {
            return findById(state.users, thread.userId)
          },
          get repliesCount () {
            return thread.posts.length - 1
          },
          get contributorsCount () {
            return thread.contributors?.length || 0
          }
        }
      }
    }
  },
  actions: {
    createPost ({ commit, state }, post) {
      post.id = 'post-' + Math.random()
      post.userId = state.authId
      post.publishedAt = Math.floor(Date.now() / 1000)
      commit('setItem', { resource: 'posts', item: post })
      commit('appendPostToThread', { childId: post.id, parentId: post.threadId })
      commit('appendContributorToThread', { childId: state.authId, parentId: post.threadId })
    },
    async createThread ({ commit, state, dispatch }, { text, title, forumId }) {
      const id = 'thread-' + Math.random()
      const userId = state.authId
      const publishedAt = Math.floor(Date.now() / 1000)
      const thread = { forumId, title, publishedAt, userId, id }
      commit('setItem', { resource: 'threads', item: thread })
      commit('appendThreadToUser', { parentId: userId, childId: id })
      commit('appendThreadToForum', { parentId: forumId, childId: id })
      dispatch('createPost', { text, threadId: id })

      return findById(state.threads, id)
    },
    async updateThread ({ commit, state }, { title, text, id }) {
      const thread = findById(state.threads, id)
      const post = findById(state.posts, thread.posts[0])
      const updatedThread = { ...thread, title }
      const updatedPost = { ...post, text }

      commit('setItem', { resource: 'threads', item: updatedThread })
      commit('setItem', { resource: 'posts', item: updatedPost })

      return updatedThread
    },
    updateUser ({ commit }, user) {
      commit('setItem', { resource: 'users', item: user })
    },
    // Fetch Single Resource
    fetchCategory ({ dispatch }, { id }) {
      return dispatch('fetchItem', { resource: 'categories', id, emoji: '🏷' })
    },
    fetchForum ({ dispatch }, { id }) {
      return dispatch('fetchItem', { resource: 'forums', id, emoji: '🏁' })
    },
    fetchThread ({ dispatch }, { id }) {
      return dispatch('fetchItem', { resource: 'threads', id, emoji: '📄' })
    },
    fetchPost ({ dispatch }, { id }) {
      return dispatch('fetchItem', { resource: 'posts', id, emoji: '💭' })
    },
    fetchUser ({ dispatch }, { id }) {
      return dispatch('fetchItem', { resource: 'users', id, emoji: '🙋' })
    },
    // Fetch Multiple Resources
    fetchAllCategories ({ commit }) {
      process.env.NODE_ENV === 'development' && console.log('🔥', '🏷', 'all')

      return new Promise((resolve) => {
        getDocs(collection(db, 'categories')).then((querySnapshot) => {
          const categories = querySnapshot.docs.map(doc => {
            const item = { id: doc.id, ...doc.data() }
            commit('setItem', { resource: 'categories', item })
            return item
          })

          resolve(categories)
        })
      })
    },
    fetchForums ({ dispatch }, { ids }) {
      return dispatch('fetchItems', { resource: 'forums', ids, emoji: '🏁' })
    },
    fetchThreads ({ dispatch }, { ids }) {
      return dispatch('fetchItems', { resource: 'threads', ids, emoji: '📄' })
    },
    fetchPosts ({ dispatch }, { ids }) {
      return dispatch('fetchItems', { resource: 'posts', ids, emoji: '💭' })
    },
    fetchUsers ({ dispatch }, { ids }) {
      return dispatch('fetchItems', { resource: 'users', ids, emoji: '🙋' })
    },
    fetchThreadsByForumId ({ commit }, { forumId }) {
      process.env.NODE_ENV === 'development' && console.log('🔥📄 forumId => ', forumId)
      return new Promise((resolve) => {
        getDocs(query(collection(db, 'threads'), where('forumId', '==', forumId))).then((querySnapshot) => {
          const threads = querySnapshot.docs.map((doc) => {
            const item = { id: doc.id, ...doc.data() }
            commit('setItem', { resource: 'categories', item })
            return item
          })

          resolve(threads)
        })
      })
    },
    fetchPostsByThreadId ({ commit, dispatch }, { threadId }) {
      process.env.NODE_ENV === 'development' && console.log('🔥💭 threadId => ', threadId)
      return new Promise((resolve) => {
        getDocs(query(collection(db, 'posts'), where('threadId', '==', threadId))).then((querySnapshot) => {
          querySnapshot.forEach(async (doc) => {
            const post = {
              id: doc.id,
              ...doc.data()
            }

            // await dispatch('fetchUser', { id: post.userId })
            commit('setItem', { resource: 'posts', item: post })
            resolve(post)
          })
        })
      })
    },
    fetchUsersByIds ({ commit }, { usersIds }) {
      process.env.NODE_ENV === 'development' && console.log('🔥🙋 [usersIds] => ', usersIds)
      return new Promise((resolve) => {
        const users = []
        getDocs(query(collection(db, 'users'), where(documentId(), 'in', usersIds))).then((querySnapshot) => {
          querySnapshot.forEach(doc => {
            const user = { id: doc.id, ...doc.data() }
            process.env.NODE_ENV === 'development' && console.log('🔥🙋 => ', user)
            commit('setItem', { resource: 'users', item: user })
            users.push(user)
          })
          resolve(users)
        })
      })
    },
    fetchItem ({ commit }, { id, emoji, resource }) {
      process.env.NODE_ENV === 'development' && console.log(`🔥 ${emoji} ${resource}: id => `, id)

      return new Promise((resolve) => {
        getDoc(doc(db, resource, id)).then((docSnap) => {
          const item = { id: docSnap.id, ...docSnap.data() }
          commit('setItem', { resource, id, item })
          resolve(item)
        })
      })
    },
    fetchItems ({ dispatch }, { ids, emoji, resource }) {
      process.env.NODE_ENV === 'development' && console.log(`🔥 ${emoji} ${resource}: ids => `, ids)

      return Promise.all(ids.map(id => dispatch('fetchItem', { id, emoji, resource })))
    }
  },
  mutations: {
    setItem (state, { resource, item }) {
      upsert(state[resource], item)
    },
    appendPostToThread: makeAppendChildToParentMutation({ parent: 'threads', child: 'posts' }),
    appendThreadToForum: makeAppendChildToParentMutation({ parent: 'forums', child: 'threads' }),
    appendThreadToUser: makeAppendChildToParentMutation({ parent: 'users', child: 'threads' }),
    appendContributorToThread: makeAppendChildToParentMutation({ parent: 'threads', child: 'contributors' })
  }
})

function makeAppendChildToParentMutation ({ parent, child }) {
  return (state, { childId, parentId }) => {
    const resource = findById(state[parent], parentId)

    if (!resource) {
      console.warn(`Appeding ${child} ${childId} to ${parent} ${parentId} failed because the parent didn't exist`)
      return
    }

    resource[child] = resource[child] || []

    if (!resource[child].includes(childId)) {
      resource[child].push(childId)
    }
  }
}
