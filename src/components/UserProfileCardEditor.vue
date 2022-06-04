<template>
  <div class="profile-card">
    <form @submit.prevent="save">
      <p class="text-center">
          <img
            :src="user.avatar"
            :alt="`Imagem de perfil de ${user.name}`"
            class="avatar-xlarge img-update"
          >
      </p>

      <div class="form-group">
          <input
            v-model="activeUser.username"
            type="text"
            placeholder="Username"
            class="form-input text-lead text-bold"
          >
      </div>

      <div class="form-group">
          <input
            v-model="activeUser.name"
            type="text"
            placeholder="Nome completo"
            class="form-input text-lead"
          >
      </div>

      <div class="form-group">
          <label for="user_bio">Bio</label>
          <textarea
            v-model="activeUser.bio"
            class="form-input"
            id="user_bio"
            placeholder="Escreva algumas palavras sobre você."
          />
      </div>

      <div class="stats">
          <span>{{ user.postsCount }} comentários</span>
          <span>{{ user.threadsCount }} tópicos</span>
      </div>

      <hr>

      <div class="form-group">
          <label class="form-label" for="user_website">Website</label>
          <input
            v-model="activeUser.website"
            autocomplete="off"
            class="form-input"
            id="user_website"
          >
      </div>

      <div class="form-group">
          <label class="form-label" for="user_email">Email</label>
          <input
            v-model="activeUser.email"
            autocomplete="off"
            class="form-input"
            id="user_email"
          >
      </div>

      <div class="form-group">
          <label class="form-label" for="user_location">Localização</label>
          <input
            v-model="activeUser.location"
            autocomplete="off"
            class="form-input"
            id="user_location"
          >
      </div>

      <div class="btn-group space-between">
          <button class="btn-ghost">Cancelar</button>
          <button type="submit" class="btn-blue">Salvar</button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      activeUser: { ...this.user }
    }
  },
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  methods: {
    save () {
      this.$store.dispatch('updateUser', { ...this.activeUser })
    }
  }
}
</script>

<style>

</style>
