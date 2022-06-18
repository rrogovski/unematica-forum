<template>
<the-navbar />
  <div class="container">
    <router-view v-show="showPage" @ready="onPageReady" />
    <app-spinner-pacman v-show="!showPage" />
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import TheNavbar from '@/components/TheNavbar.vue'
import NProgress from 'nprogress'

export default {
  components: { TheNavbar },
  name: 'App',
  data () {
    return {
      showPage: false
    }
  },
  methods: {
    ...mapActions(['fetchAuthUser']),
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

  #nprogress .bar {
    background: #4b81df !important;
  }
  .container {
    padding-top: 80px;
  }
</style>
