import { collection, doc, query, where, getDoc, getDocs, documentId, setDoc, updateDoc, addDoc, arrayUnion, writeBatch, serverTimestamp } from 'firebase/firestore'
import { db } from '@/helpers/firebase'

import { findById } from '@/helpers'

export default {
  async createPost ({ commit, state }, post) {
    post.userId = state.authId
    post.publishedAt = serverTimestamp()
    post.firstInThread = post.firstInThread || false
    const batch = writeBatch(db)
    const postRef = doc(collection(db, 'posts'))
    const threadRef = doc(db, 'threads', post.threadId)
    batch.set(postRef, post)
    const threadUpdates = {
      posts: arrayUnion(postRef.id)
    }
    if (!post.firstInThread) {
      threadUpdates.contributors = arrayUnion(state.authId)
    }
    batch.update(threadRef, threadUpdates)
    await batch.commit()
    const newPost = await getDoc(postRef)

    commit('setItem', { resource: 'posts', item: { ...post, id: newPost.id } })
    commit('appendPostToThread', { childId: newPost.id, parentId: post.threadId })
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
  fetchCategory: ({ dispatch }, { id }) => dispatch('fetchItem', { resource: 'categories', id, emoji: '🏷' }),
  fetchForum: ({ dispatch }, { id }) => dispatch('fetchItem', { resource: 'forums', id, emoji: '🏁' }),
  fetchThread: ({ dispatch }, { id }) => dispatch('fetchItem', { resource: 'threads', id, emoji: '📄' }),
  fetchPost: ({ dispatch }, { id }) => dispatch('fetchItem', { resource: 'posts', id, emoji: '💭' }),
  fetchUser: ({ dispatch }, { id }) => dispatch('fetchItem', { resource: 'users', id, emoji: '🙋' }),
  fetchAuthUser: ({ dispatch, state }) => dispatch('fetchItem', { resource: 'users', id: state.authId, emoji: '🙋' }),
  // Fetch Multiple Resources
  fetchAllCategories: ({ commit }) => {
    process.env.NODE_ENV === 'development' && console.log('🔥', '🏷', 'all')

    return new Promise((resolve) => {
      getDocs(collection(db, 'categories')).then((querySnapshot) => {
        const categories = querySnapshot.docs.map(d => {
          const item = { id: d.id, ...d.data() }
          commit('setItem', { resource: 'categories', item })
          return item
        })

        resolve(categories)
      })
    })
  },
  fetchForums: ({ dispatch }, { ids }) => dispatch('fetchItems', { resource: 'forums', ids, emoji: '🏁' }),
  fetchThreads: ({ dispatch }, { ids }) => dispatch('fetchItems', { resource: 'threads', ids, emoji: '📄' }),
  fetchPosts: ({ dispatch }, { ids }) => dispatch('fetchItems', { resource: 'posts', ids, emoji: '💭' }),
  fetchUsers: ({ dispatch }, { ids }) => dispatch('fetchItems', { resource: 'users', ids, emoji: '🙋' }),
  fetchThreadsByForumId: ({ commit }, { forumId }) => {
    process.env.NODE_ENV === 'development' && console.log('🔥📄 forumId => ', forumId)
    return new Promise((resolve) => {
      getDocs(query(collection(db, 'threads'), where('forumId', '==', forumId))).then((querySnapshot) => {
        const threads = querySnapshot.docs.map((d) => {
          const item = { id: d.id, ...d.data() }
          commit('setItem', { resource: 'categories', item })
          return item
        })

        resolve(threads)
      })
    })
  },
  fetchPostsByThreadId: ({ commit }, { threadId }) => {
    process.env.NODE_ENV === 'development' && console.log('🔥💭 threadId => ', threadId)
    return new Promise((resolve) => {
      getDocs(query(collection(db, 'posts'), where('threadId', '==', threadId))).then((querySnapshot) => {
        querySnapshot.forEach(async (d) => {
          const post = {
            id: d.id,
            ...d.data()
          }

          // await dispatch('fetchUser', { id: post.userId })
          commit('setItem', { resource: 'posts', item: post })
          resolve(post)
        })
      })
    })
  },
  fetchUsersByIds: ({ commit }, { usersIds }) => {
    process.env.NODE_ENV === 'development' && console.log('🔥🙋 [usersIds] => ', usersIds)
    return new Promise((resolve) => {
      const users = []
      getDocs(query(collection(db, 'users'), where(documentId(), 'in', usersIds))).then((querySnapshot) => {
        querySnapshot.forEach(d => {
          const user = { id: d.id, ...d.data() }
          process.env.NODE_ENV === 'development' && console.log('🔥🙋 => ', user)
          commit('setItem', { resource: 'users', item: user })
          users.push(user)
        })
        resolve(users)
      })
    })
  },
  fetchItem: ({ commit }, { id, emoji, resource }) => {
    process.env.NODE_ENV === 'development' && console.log(`🔥 ${emoji} ${resource}: id => `, id)

    return new Promise((resolve) => {
      getDoc(doc(db, resource, id)).then((docSnap) => {
        const item = { id: docSnap.id, ...docSnap.data() }
        commit('setItem', { resource, id, item })
        resolve(item)
      })
    })
  },
  fetchItems: ({ dispatch }, { ids, emoji, resource }) => {
    process.env.NODE_ENV === 'development' && console.log(`🔥 ${emoji} ${resource}: ids => `, ids)

    return Promise.all(ids.map(id => dispatch('fetchItem', { id, emoji, resource })))
  }
}
