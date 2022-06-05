<template>
  <div class="col-full push-top">

    <h1>Criar novo tópico em <i>{{ forum.name }}</i></h1>

      <form @submit.prevent="save">
          <div class="form-group">
            <label for="thread_title">Título:</label>
            <input
              v-model="title"
              type="text"
              id="thread_title"
              class="form-input"
              name="title"
            >
          </div>

          <div class="form-group">
            <label for="thread_content">Conteúdo:</label>
            <textarea
              v-model="text"
              id="thread_content"
              class="form-input"
              name="content"
              rows="8"
              cols="140">
            </textarea>
          </div>

          <div class="btn-group">
            <button class="btn btn-ghost" @click="cancel">Cancelar</button>
            <button class="btn btn-blue" type="submit" name="Publish">Publicar </button>
          </div>
      </form>

    </div>
</template>

<script>
export default {
  props: {
    forumId: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      title: '',
      text: ''
    }
  },
  computed: {
    forum () {
      return this.$store.state.forums.find(forum => forum.id === this.forumId)
    }
  },
  methods: {
    async save () {
      const thread = await this.$store.dispatch('createThread', {
        forumId: this.forum.id,
        title: this.title,
        text: this.text
      })

      this.$router.push({ name: 'ThreadShow', params: { id: thread.id } })
    },
    cancel () {
      this.$router.push({ name: 'Forum', params: { id: this.forumId } })
    }
  }
}
</script>

<style>

</style>
