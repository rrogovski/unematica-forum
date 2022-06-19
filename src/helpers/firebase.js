import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

import firebaseConfig from '@/config/firebase'
import store from '@/store'

const firebase = initializeApp(firebaseConfig)
const db = getFirestore(firebase)
const storage = getStorage(firebase)
const auth = getAuth()

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log('user => ', user)
    store.dispatch('fetchAuthUser')
  }
})

export { db, auth, storage }
