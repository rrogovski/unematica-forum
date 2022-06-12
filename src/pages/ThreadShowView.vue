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
        <span style="float:right; margin-top: 2px;" class="hide-mobile text-faded text-small">{{ thread.repliesCount }} {{thread.repliesCount > 1 ? 'respostas' : 'resposta'}} por {{ thread.contributorsCount }} participantes</span>
    </p>

    <post-list :posts="threadPosts" />

    <post-editor @save="addPost" />

  </div>
</template>

<script>
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
    }
  },
  async created () {
    const thread = await this.$store.dispatch('fetchThread', { id: this.id })
    this.$store.dispatch('fetchUser', { id: thread.userId })

    // thread.posts.forEach(async (postId) => {
    //   const post = await this.$store.dispatch('fetchPost', { id: postId })
    //   this.$store.dispatch('fetchUser', { id: post.userId })
    // })

    await this.$store.dispatch('fetchPostsByThreadId', { threadId: this.id })
    // const posts = await this.$store.dispatch('fetchPosts', { ids: thread.posts })
    // const users = posts.map(post => post.userId)
    // this.$store.dispatch('fetchUsers', { ids: users })
  }
}
</script>

<style lang="scss" scoped>

</style>
