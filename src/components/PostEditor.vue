<template>
  <div class="col-full">
      <form @submit.prevent="save">
        <div class="form-group">
          <textarea
            v-model="text"
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
</template>

<script>
export default {
  data () {
    return {
      text: ''
    }
  },
  methods: {
    save () {
      const post = {
        text: this.text

      }

      this.$emit('save', { post })
      // this.posts.push(post)
      // this.thread.posts.push(postId)
      this.text = ''
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
