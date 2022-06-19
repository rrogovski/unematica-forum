import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { getAuth } from 'firebase/auth'

import firebaseConfig from '@/config/firebase'

const firebase = initializeApp(firebaseConfig)
const db = getFirestore(firebase)
const storage = getStorage(firebase)
const auth = getAuth()
export { db, auth, storage }
