<template>
  <div class="col-large push-top">

    <h1>{{ thread.title }}</h1>

    <PostList :posts="threadPosts" />

    <div class="col-full">
      <form @submit.prevent="addPost">
        <div class="form-group">
          <textarea
            v-model="newPostText"
            name="new-post"
            id="new-post"
            cols="30"
            rows="10"
            class="form-input" />
        </div>
        <div class="form-actions">
          <button class="btn-blue">Salvar comentário</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import sourceData from '@/data.json'
import PostList from '@/components/PostList.vue'

export default {
  components: { PostList },
  name: 'ThreadShowView',
  props: {
    id: {
      required: true,
      type: String
    }
  },
  data () {
    return {
      threads: sourceData.threads,
      posts: sourceData.posts,
      newPostText: ''
    }
  },
  computed: {
    thread () {
      return this.threads.find(thread => thread.id === this.id) // You also can get the params from this.$route.params.id
    },
    threadPosts () {
      return this.posts.filter(post => post.threadId === this.id)
    }
  },
  methods: {
    addPost () {
      const postId = 'post-' + Math.random()

      const post = {
        id: postId,
        text: this.newPostText,
        publishedAt: Math.floor(Date.now() / 1000),
        threadId: this.id,
        userId: 'HJNTR1nN8tgbB148RJrPYbby8Vl1'

      }

      this.posts.push(post)
      this.thread.posts.push(postId)
      this.newPostText = ''
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
