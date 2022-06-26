import { db } from '@/helpers/firebase'
import {
  arrayUnion,
  serverTimestamp,
  writeBatch,
  doc,
  collection,
  increment,
  getDoc
} from 'firebase/firestore'
import { findById, makeFetchItemAction, makeFetchItemsAction } from '@/helpers'
export default {
  namespaced: true,
  state: {
    items: []
  },
  getters: {},
  actions: {
    async createPost({ commit, state, rootState }, post) {
      post.userId = rootState.auth.authId
      post.publishedAt = serverTimestamp()
      post.firstInThread = post.firstInThread || false
      const batch = writeBatch(db)
      const postRef = doc(collection(db, 'posts'))
      const threadRef = doc(db, 'threads', post.threadId)
      const userRef = doc(db, 'users', rootState.auth.authId)
      batch.set(postRef, post)
      const threadUpdates = {
        posts: arrayUnion(postRef.id)
      }
      if (!post.firstInThread) {
        threadUpdates.contributors = arrayUnion(rootState.auth.authId)
      }
      batch.update(threadRef, threadUpdates)
      batch.update(userRef, {
        postsCount: increment(1)
      })
      await batch.commit()
      const newPost = await getDoc(postRef)
      commit(
        'setItem',
        {
          resource: 'posts',
          item: { ...newPost.data(), id: newPost.id }
        },
        { root: true }
      )
      commit(
        'threads/appendPostToThread',
        {
          childId: newPost.id,
          parentId: post.threadId
        },
        { root: true }
      )
      if (!post.firstInThread) {
        commit(
          'threads/appendContributorToThread',
          { childId: rootState.auth.authId, parentId: post.threadId },
          { root: true }
        )
      }
    },
    async updatePost({ commit, state, rootState }, { text, id }) {
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
      commit(
        'setItem',
        { resource: 'posts', item: updatedPost },
        { root: true }
      )
    },
    fetchPost: makeFetchItemAction({ emoji: '💬', resource: 'posts' }),
    fetchPosts: makeFetchItemsAction({ emoji: '💬', resource: 'posts' })
  },
  mutations: {}
}
