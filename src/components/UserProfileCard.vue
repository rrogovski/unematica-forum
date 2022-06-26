<template>
  <div>
    <div class="profile-card">
      <p class="text-center">
        <AppAvatarImg
          :src="user.avatar"
          :alt="`${user.name} imagem de perfil`"
          class="avatar-xlarge"
        />
      </p>

      <h1 class="title">{{ user.username }}</h1>

      <p class="text-lead">{{ user.name }}</p>

      <p class="text-justify">{{ user.bio || "Bio não informada." }}</p>

      <span class="online">{{ user.username }} está online</span>

      <div class="stats">
        <span>{{user.postsCount > 1 ? `${ user.postsCount} respostas` : `${ user.postsCount} resposta` }}</span>
        <span>{{ user.threadsCount > 1 ? `${user.threadsCount} tópicos` : `${user.threadsCount} tópico` }}</span>
      </div>

      <hr />

      <p v-if="user.website" class="text-large text-center">
        <fa-icon icon="globe" />
        <a :href="user.website" target="_blank">{{ user.website }}</a>
      </p>
    </div>
    <div class="text-center">
      <router-link
        :to="{name: 'ProfileEdit'}"
        class="btn-green btn-small">
          Editar Perfil
        </router-link>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    user: {
      type: Object,
      required: true
    }
  }
}
</script>
