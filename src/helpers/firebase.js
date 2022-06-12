import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

import firebaseConfig from '@/config/firebase'

const firebase = initializeApp(firebaseConfig)
const db = getFirestore(firebase)
export { db }
