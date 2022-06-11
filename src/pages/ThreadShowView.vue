<template>
  <div class="col-large push-top">

    <h1>
      {{ thread.title }}

      <router-link
        :to="{ name: 'ThreadEdit', params: { id: this.id } }"
        class="btn-green bth-small"
      >
        Editar tópico
      </router-link>
    </h1>

    <p>
        Por <a href="#" class="link-unstyled">{{ thread.author?.name }}</a>, <app-date :timestamp="thread.publishedAt" />.
        <span style="float:right; margin-top: 2px;" class="hide-mobile text-faded text-small">{{ thread.repliesCount }} respondido por {{ thread.contributorsCount }} participantes</span>
    </p>

    <post-list :posts="threadPosts" />

    <post-editor @save="addPost" />

  </div>
</template>

<script>
import { collection, doc, query, where, getDoc, getDocs } from 'firebase/firestore'
import db from '@/config/firebase'

import PostList from '@/components/PostList.vue'
import PostEditor from '@/components/PostEditor.vue'

export default {
  components: { PostList, PostEditor },
  name: 'ThreadShowView',
  props: {
    id: {
      required: true,
      type: String
    }
  },
  computed: {
    threads () {
      return this.$store.state.threads
    },
    posts () {
      return this.$store.state.posts
    },
    thread () {
      return this.$store.getters.thread(this.id)
    },
    threadPosts () {
      return this.posts.filter(post => post.threadId === this.id)
    }
  },
  methods: {
    addPost (eventData) {
      const post = {
        ...eventData.post,
        threadId: this.id
      }

      this.$store.dispatch('createPost', post)
    },
    async getThread () {
      const docSnap = await getDoc(doc(db, 'threads', this.id))

      // if (docSnap.exists()) {
      //   console.log(docSnap.data())
      // } else {
      //   console.log('Document does not exist')
      // }

      const thread = { id: this.id, ...docSnap.data() }
      this.$store.commit('setThread', { thread })
      this.getUser(thread.userId)

      // const q = query(collection(db, 'threads'), where('id', '==', this.id))

      // const querySnapshot = await getDocs(q)
      // querySnapshot.forEach((doc) => {
      //   // doc.data() is never undefined for query doc snapshots
      //   console.log(doc.id, ' => ', doc.data())
      //   const thread = {
      //     id: doc.id,
      //     ...doc.data()
      //   }

      //   this.$store.commit('setThread', { thread })
      // })
    },
    async getUser (id) {
      const docSnap = await getDoc(doc(db, 'users', id))

      const user = { id, ...docSnap.data() }
      this.$store.commit('setUser', { user })
    },
    async getPosts () {
      const querySnapshot = await getDocs(query(collection(db, 'posts'), where('threadId', '==', this.id)))
      querySnapshot.forEach(async (doc) => {
        const post = {
          id: doc.id,
          ...doc.data()
        }

        await this.getUser(post.userId)
        this.$store.commit('setPost', { post })
      })
    }
  },
  async created () {
    await this.getThread()
    await this.getPosts()
  }
}
</script>

<style lang="scss" scoped>

</style>
