<template>
<the-navbar />
  <div class="container">
    <router-view v-show="showPage" @ready="showPage = true" />
    <app-spinner-pacman v-show="!showPage" />
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import TheNavbar from '@/components/TheNavbar.vue'
export default {
  components: { TheNavbar },
  name: 'App',
  data () {
    return {
      showPage: false
    }
  },
  methods: {
    ...mapActions(['fetchAuthUser'])
  },
  created () {
    this.fetchAuthUser()
    this.$router.beforeEach(() => {
      this.showPage = false
    })
  }
}
</script>

<style lang="scss" scoped>
  @import "assets/style.css";

  .container {
    padding-top: 80px;
  }
</style>
