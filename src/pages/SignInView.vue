<template>
  <div class="flex-grid justify-center">
    <div class="col-2">
      <VeeForm @submit="signIn" class="card card-form">
        <h1 class="text-center">Login</h1>

        <AppFormField label="E-mail" name="email" type="email" v-model="form.email" rules="required|email" />
        <AppFormField label="Password" name="password" type="password" v-model="form.password" rules="required" />

        <div class="push-top">
          <button type="submit" class="btn-blue btn-block">Entrar</button>
        </div>

        <div class="form-actions text-right">
          <router-link :to="{name: 'Register'}">Criar uma conta?</router-link>
        </div>
      </VeeForm>

      <div class="push-top text-center">
        <button @click="signInWithGoogle" class="btn-red btn-xsmall">
          <fa-icon icon="globe" class="fa-btn" />Entrar com sua conta Google
        </button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      form: {
        email: '',
        password: ''
      }
    }
  },
  methods: {
    async signIn () {
      try {
        await this.$store.dispatch('auth/signInWithEmailAndPassword', { ...this.form })
        this.successRedirect()
      } catch (error) {
        alert(error.message)
      }
    },
    async signInWithGoogle () {
      await this.$store.dispatch('auth/signInWithGoogle')
      this.successRedirect()
    },
    successRedirect () {
      const redirectTo = this.$route.query.redirectTo || { name: 'Home' }
      this.$router.push(redirectTo)
    }
  },
  created () {
    this.$emit('ready')
  }
}
</script>
