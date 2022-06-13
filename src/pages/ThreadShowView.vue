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
        Por <a href="#" class="link-unstyled">{{ thread.author?.name }}</a>, <app-date v-if="thread.publishedAt" :timestamp="thread.publishedAt" />.
        <span style="float:right; margin-top: 2px;" class="hide-mobile text-faded text-small">{{ thread.repliesCount }} {{thread.repliesCount > 1 ? 'respostas' : 'resposta'}} por {{ thread.contributorsCount }} participantes</span>
    </p>

    <post-list :posts="threadPosts" />

    <post-editor @save="addPost" />

  </div>
</template>

<script>
import { mapActions } from 'vuex'
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
    ...mapActions(['fetchThread', 'fetchUsers', 'fetchPosts', 'createPost', 'fetchPostsByThreadId']),
    addPost (eventData) {
      const post = {
        ...eventData.post,
        threadId: this.id
      }
      this.createPost(post)
    }
  },
  async created () {
    const thread = await this.fetchThread({ id: this.id })
    const posts = await this.fetchPosts({ ids: thread.posts })
    const users = posts.map(post => post.userId).concat(thread.userId)
    this.fetchUsers({ ids: users })
    await this.fetchPostsByThreadId({ threadId: this.id })
  }
}
</script>

<style lang="scss" scoped>

</style>
