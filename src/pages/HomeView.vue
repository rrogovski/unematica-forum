<template>
  <h1 class="push-top">Bem-vindo ao Unemática</h1>
  <CategoryList :categories="categories" />
</template>

<script>
import { mapActions } from 'vuex'
import CategoryList from '@/components/CategoryList'

export default {
  components: { CategoryList },
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
    this.fetchForums({ ids: forumsIds })
  }
}
</script>

<style lang="scss" scoped>

</style>
