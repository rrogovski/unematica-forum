<template>
<the-navbar />
  <div class="container">
    <router-view />
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import TheNavbar from './components/TheNavbar.vue'
export default {
  components: { TheNavbar },
  name: 'App',
  methods: {
    ...mapActions(['fetchAuthUser'])
  },
  created () {
    this.fetchAuthUser()
  }
}
</script>

<style lang="scss" scoped>
  @import "assets/style.css";

  .container {
    padding-top: 80px;
  }
</style>
