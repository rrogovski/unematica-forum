<template>
  <AppHead>
    <title>Unemática</title>
    <meta name="description" content="Unemática fórum!">

    <!-- Social -->
    <meta property="og:title" content="Unemática Fórum">
    <meta property="og:description" content="Fórum para discussão ou troca de ideias entre a comunidade da Unemat!">
    <meta property="og:image" content="https://unematica.com.br/assets/unematica-not-transparent.jpg">

    <!-- Twitter -->
    <meta name="twitter:title" content="Unemática Fórum">
    <meta name="twitter:description" content="Fórum para discussão ou troca de ideias entre a comunidade da Unemat!">
    <meta name="twitter:image" content="https://unematica.com.br/assets/unematica-not-transparent.jpg">
    <meta name="twitter:card" content="summary_large_image">
  </AppHead>
  <the-navbar/>
  <div class="container">
    <router-view v-show="showPage" @ready="onPageReady" :key="`${$route.path}${JSON.stringify($route.query)}`"/>
    <app-spinner-pacman v-show="!showPage" />
    <AppNotifications />
  </div>
</template>

<script>
import TheNavbar from '@/components/TheNavbar'
import { mapActions } from 'vuex'
import NProgress from 'nprogress'
import AppNotifications from '@/components/AppNotifications'
export default {
  name: 'App',
  components: { TheNavbar, AppNotifications },
  data () {
    return {
      showPage: false
    }
  },
  methods: {
    ...mapActions('auth', ['fetchAuthUser']),
    onPageReady () {
      this.showPage = true
      NProgress.done()
    }
  },
  created () {
    this.fetchAuthUser()
    NProgress.configure({
      speed: 200,
      showSpinner: false
    })
    this.$router.beforeEach(() => {
      this.showPage = false
      NProgress.start()
    })
  }
}
</script>

<style lang="scss">
  @import "assets/style.css";
  @import "~nprogress/nprogress.css";
  #nprogress .bar{
    background: #57AD8D !important;
  }
  .container {
      padding: 60px 0 20px 0;
  }
</style>
