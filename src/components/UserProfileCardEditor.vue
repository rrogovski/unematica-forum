<template>
  <div class="profile-card">
    <VeeForm @submit="save">
      <p class="text-center avatar-edit">
        <label for="avatar">
          <AppAvatarImg
            :src="activeUser.avatar"
            :alt="`${user.name} imagem de perfil`"
            class="avatar-xlarge img-update"
          />
          <div class="avatar-upload-overlay">
            <AppSpinner v-if="uploadingImage" color="white" />
            <fa-icon v-else icon="camera" size="3x" :style="{color: 'white', opacity: '.8'}" />
          </div>
          <input v-show="false" type="file" id="avatar" accept="image/*" @change="handleAvatarUpload">
        </label>
      </p>
      <UserProfileCardEditorRandomAvatar @hit="activeUser.avatar = $event" />

      <AppFormField label="Username" name="username" v-model="activeUser.username" :rules="`required|unique:users,username,${user.username}`" />
      <AppFormField label="Nome" name="name" v-model="activeUser.name" rules="required" />
      <AppFormField label="Bio" name="bio" as="textarea" v-model="activeUser.bio" placeholder="Escreva algumas palavras sobre você 😉" />

      <div class="stats">
        <span>{{user.postsCount > 1 ? `${ user.postsCount} respostas` : `${ user.postsCount} resposta` }}</span>
        <span>{{ user.threadsCount > 1 ? `${user.threadsCount} tópicos` : `${user.threadsCount} tópico` }}</span>
      </div>

      <hr />

      <AppFormField label="Website" name="website" v-model="activeUser.website" rules="url" />
      <AppFormField label="E-mail" name="email" v-model="activeUser.email" :rules="`required|email|unique:users,email,${user.email}`"/>
      <AppFormField label="Localização" name="location" v-model="activeUser.location" list="locations" @mouseenter="loadLocationOptions"/>
      <datalist id="locations">
        <option v-for="location in locationOptions" :value="location.name.common" :key="location.name.common" />
      </datalist>

      <div class="btn-group space-between">
        <button class="btn-ghost" @click.prevent="cancel">Cancelar</button>
        <button type="submit" class="btn-blue">Salvar</button>
      </div>
    </VeeForm>
    <UserProfileCardEditorReauthenticate
      v-model="needsReAuth"
      @success="onReauthenticated"
      @fail="onReauthenticatedFailed"
    />
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import UserProfileCardEditorRandomAvatar from './UserProfileCardEditorRandomAvatar'
import UserProfileCardEditorReauthenticate from './UserProfileCardEditorReauthenticate.vue'
import useNotifications from '@/composables/useNotifications'
export default {
  components: { UserProfileCardEditorRandomAvatar, UserProfileCardEditorReauthenticate },
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  setup () {
    const { addNotification } = useNotifications()
    return { addNotification }
  },
  data () {
    return {
      uploadingImage: false,
      activeUser: { ...this.user },
      locationOptions: [],
      needsReAuth: false
    }
  },
  methods: {
    ...mapActions('auth', ['uploadAvatar']),
    async loadLocationOptions () {
      if (this.locationOptions.length) return
      const res = await fetch('https://restcountries.com/v3/all')
      this.locationOptions = await res.json()
    },
    async handleAvatarUpload (e) {
      this.uploadingImage = true
      const file = e.target.files[0]
      const uploadedImage = await this.uploadAvatar({ file })
      this.activeUser.avatar = uploadedImage || this.activeUser.avatar
      this.uploadingImage = false
    },
    async handleRandomAvatarUpload () {
      const randomAvatarGenerated = this.activeUser.avatar.startsWith('https://pixabay')
      if (randomAvatarGenerated) {
        const image = await fetch(this.activeUser.avatar)
        const blob = await image.blob()
        this.activeUser.avatar = await this.uploadAvatar({ file: blob, filename: 'random' })
      }
    },
    async onReauthenticated () {
      await this.$store.dispatch('auth/updateEmail', { email: this.activeUser.email })
      this.saveUserData()
    },
    async onReauthenticatedFailed () {
      this.addNotification({ message: 'Erro ao atualizar os dados', type: 'error', timeout: 3000 })
      this.$router.push({ name: 'Profile' })
    },
    async saveUserData () {
      await this.$store.dispatch('users/updateUser', { ...this.activeUser, threads: this.activeUser.threadIds })
      this.$router.push({ name: 'Profile' })
      this.addNotification({ message: 'Dados atualizados com sucesso', timeout: 3000 })
    },
    async save () {
      await this.handleRandomAvatarUpload()
      const emailChanged = this.activeUser.email !== this.user.email
      if (emailChanged) {
        this.needsReAuth = true
      } else {
        this.saveUserData()
      }
    },
    cancel () {
      this.$router.push({ name: 'Profile' })
    }
  }
}
</script>
