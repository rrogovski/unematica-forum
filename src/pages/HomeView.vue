<template>
<div v-if="ready" class="container">
  <h1 class="push-top">Bem-vindo ao Unemática</h1>
  <CategoryList :categories="categories" />
</div>
</template>

<script>
import { mapActions } from 'vuex'
import CategoryList from '@/components/CategoryList'

export default {
  components: { CategoryList },
  data () {
    return {
      ready: false
    }
  },
  computed: {
    categories () {
      return this.$store.state.categories
    }
  },
  methods: {
    // To map actions to methods with other names
    // ...mapActions({getCatas: 'fetchAllCategories', getForums: 'fetchForums'})
    ...mapActions(['fetchAllCategories', 'fetchForums'])
  },
  async created () {
    const categories = await this.fetchAllCategories()
    const forumsIds = categories.map(category => category.forums).flat()
    await this.fetchForums({ ids: forumsIds })
    this.ready = true
  }
}
</script>

<style lang="scss" scoped>

</style>
