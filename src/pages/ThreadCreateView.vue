<template>
  <div v-if="forum" class="col-full push-top">

    <h1>Criar novo tópico em <i>{{ forum.name }}</i></h1>

      <thread-editor @save="save" @cancel="cancel" />

    </div>
</template>

<script>
import ThreadEditor from '@/components/ThreadEditor.vue'
export default {
  components: { ThreadEditor },
  props: {
    forumId: {
      type: String,
      required: true
    }
  },
  computed: {
    forum () {
      return this.$store.state.forums.find(forum => forum.id === this.forumId)
    }
  },
  methods: {
    async save ({ title, text }) {
      const thread = await this.$store.dispatch('createThread', {
        forumId: this.forum.id,
        title,
        text
      })

      this.$router.push({ name: 'ThreadShow', params: { id: thread.id } })
    },
    cancel () {
      this.$router.push({ name: 'Forum', params: { id: this.forumId } })
    }
  },
  created () {
    this.$store.dispatch('fetchForum', { id: this.forumId })
  }
}
</script>

<style>

</style>
