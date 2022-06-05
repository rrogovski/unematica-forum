<template>
  <form @submit.prevent="save">
    <div class="form-group">
      <label for="thread_title">Título:</label>
      <input
        v-model="form.title"
        type="text"
        id="thread_title"
        class="form-input"
        name="title"
      >
    </div>

    <div class="form-group">
      <label for="thread_content">Conteúdo:</label>
      <textarea
        v-model="form.text"
        id="thread_content"
        class="form-input"
        name="content"
        rows="8"
        cols="140">
      </textarea>
    </div>

    <div class="btn-group">
      <button class="btn btn-ghost" @click="$emit('cancel')">Cancelar</button>
      <button class="btn btn-blue" type="submit" name="Publish">{{ existing ? 'Atualizar' : 'Publicar' }} </button>
    </div>
  </form>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    text: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      form: {
        title: this.title,
        text: this.text
      }
    }
  },
  computed: {
    existing () {
      return !!this.title
    }
  },
  methods: {
    save () {
      this.$emit('save', { ...this.form })
    }
  }
}
</script>

<style>

</style>
