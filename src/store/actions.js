import {
  collection,
  doc,
  query,
  where,
  getDoc,
  getDocs,
  documentId,
  setDoc,
  updateDoc,
  addDoc,
  arrayUnion,
  writeBatch,
  serverTimestamp,
  increment,
  onSnapshot
} from 'firebase/firestore'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { db, auth } from '@/helpers/firebase'

import { docToResource, findById } from '@/helpers'

export default {
  async createPost ({ commit, state }, post) {
    post.userId = state.authId
    post.publishedAt = serverTimestamp()
    post.firstInThread = post.firstInThread || false
    const batch = writeBatch(db)
    const postRef = doc(collection(db, 'posts'))
    const threadRef = doc(db, 'threads', post.threadId)
    const userRef = doc(db, 'users', state.authId)
    batch.set(postRef, post)
    const threadUpdates = {
      posts: arrayUnion(postRef.id)
    }
    if (!post.firstInThread) {
      threadUpdates.contributors = arrayUnion(state.authId)
    }
    batch.update(threadRef, threadUpdates)
    batch.update(userRef, {
      postsCount: increment(1)
    })
    await batch.commit()
    const newPost = await getDoc(postRef)

    commit('setItem', { resource: 'posts', item: { ...newPost.data(), id: newPost.id } })
    commit('appendPostToThread', { childId: newPost.id, parentId: post.threadId })
    commit('appendContributorToThread', { childId: state.authId, parentId: post.threadId })
  },
  async createThread ({ commit, state, dispatch }, { text, title, forumId }) {
    const userId = state.authId
    const publishedAt = serverTimestamp()
    const threadRef = doc(collection(db, 'threads'))
    const thread = { forumId, title, publishedAt, userId, id: threadRef.id }
    const userRef = doc(db, 'users', userId)
    const forumRef = doc(db, 'forums', forumId)
    const batch = writeBatch(db)
    batch.set(threadRef, thread)
    batch.update(userRef, {
      threads: arrayUnion(threadRef.id)
    })
    batch.update(forumRef, {
      threads: arrayUnion(threadRef.id)
    })
    await batch.commit()
    const newThread = await getDoc(threadRef)
    commit('setItem', { resource: 'threads', item: { ...newThread.data(), id: newThread.id } })
    commit('appendThreadToUser', { parentId: userId, childId: threadRef.id })
    commit('appendThreadToForum', { parentId: forumId, childId: threadRef.id })
    await dispatch('createPost', { text, threadId: threadRef.id })

    return findById(state.threads, threadRef.id)
  },
  async updateThread ({ commit, state }, { title, text, id }) {
    const thread = findById(state.threads, id)
    const post = findById(state.posts, thread.posts[0])
    let updatedThread = { ...thread, title }
    let updatedPost = { ...post, text }
    const threadRef = doc(db, 'threads', id)
    const postRef = doc(db, 'posts', post.id)
    const batch = writeBatch(db)
    batch.update(threadRef, updatedThread)
    batch.update(postRef, updatedPost)
    await batch.commit()
    updatedThread = await getDoc(threadRef)
    updatedPost = await getDoc(postRef)

    commit('setItem', { resource: 'threads', item: updatedThread })
    commit('setItem', { resource: 'posts', item: updatedPost })

    return docToResource(updatedThread)
  },
  async registerUserWithEmailAndPassword (
    { dispatch },
    { avatar = null, email, name, username, password }
  ) {
    const result = await createUserWithEmailAndPassword(auth, email, password)
    await dispatch('createUser', { id: result.user.uid, email, name, username, avatar })
  },
  async createUser ({ commit }, { id, email, name, username, avatar = null }) {
    const registeredAt = serverTimestamp()
    const usernameLower = username.toLowerCase()
    email = email.toLowerCase()
    const user = { avatar, email, name, username, usernameLower, registeredAt }
    const userRef = doc(db, 'users', id)
    await setDoc(userRef, user)
    const newUser = await getDoc(userRef)
    commit('setItem', { resource: 'users', item: { ...newUser.data(), id: newUser.id } })
  },
  updateUser ({ commit }, user) {
    commit('setItem', { resource: 'users', item: user })
  },
  async updatePost ({ commit, state }, { text, id }) {
    const postOld = findById(state.posts, id)
    let updatedPost = {
      text,
      edited: {
        at: serverTimestamp(),
        by: state.authId,
        moderator: false
      },
      history: arrayUnion({ text: postOld.text })
    }

    const postRef = doc(db, 'posts', id)
    const batch = writeBatch(db)
    batch.update(postRef, updatedPost)
    await batch.commit()
    updatedPost = await getDoc(postRef)

    commit('setItem', { resource: 'posts', item: updatedPost })
  },
  // Fetch Single Resource
  fetchCategory: ({ dispatch }, { id }) => dispatch('fetchItem', { resource: 'categories', id, emoji: '🏷' }),
  fetchForum: ({ dispatch }, { id }) => dispatch('fetchItem', { resource: 'forums', id, emoji: '🏁' }),
  fetchThread: ({ dispatch }, { id }) => dispatch('fetchItem', { resource: 'threads', id, emoji: '📄' }),
  fetchPost: ({ dispatch }, { id }) => dispatch('fetchItem', { resource: 'posts', id, emoji: '💭' }),
  fetchUser: ({ dispatch }, { id }) => dispatch('fetchItem', { resource: 'users', id, emoji: '🙋' }),
  fetchAuthUser: ({ dispatch, state, commit }) => {
    const userId = auth.currentUser?.uid

    if (!userId) return

    dispatch('fetchItem', { resource: 'users', id: userId, emoji: '🙋' })
    commit('setAuthId', userId)
  },
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
      const docRef = doc(db, resource, id)
      const unsubscribe = onSnapshot(docRef, doc => {
        process.env.NODE_ENV === 'development' && console.log('📝 snapshot => ', id)
        const item = { id: doc.id, ...doc.data() }
        commit('setItem', { resource, item })
        resolve(item)
      })

      commit('appendUnsubscribe', { unsubscribe })

      // If dont want to use snapshot
      // getDoc(doc(db, resource, id)).then((docSnap) => {
      //   const item = { id: docSnap.id, ...docSnap.data() }
      //   commit('setItem', { resource, id, item })
      //   resolve(item)
      // })
    })
  },
  fetchItems: ({ dispatch }, { ids, emoji, resource }) => {
    process.env.NODE_ENV === 'development' && console.log(`🔥 ${emoji} ${resource}: ids => `, ids)

    return Promise.all(ids.map(id => dispatch('fetchItem', { id, emoji, resource })))
  },
  async unsubscribeAllSnapshots ({ state, commit }) {
    state.unsubscribes.forEach(unsubscribe => unsubscribe())
    commit('clearAllUnsubscribes')
  },
  clearItems ({ commit }, { modules = [] }) {
    commit('clearItems', { modules })
  }
}
