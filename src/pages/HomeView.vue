<template>
  <h1 class="push-top">Bem-vindo ao Unemática</h1>
  <CategoryList :categories="categories" />
</template>

<script>
import CategoryList from '@/components/CategoryList'

export default {
  components: { CategoryList },
  computed: {
    categories () {
      return this.$store.state.categories
    }
  },
  async beforeCreate () {
    const categories = await this.$store.dispatch('fetchAllCategories')
    const forumsIds = categories.map(category => category.forums).flat()
    this.$store.dispatch('fetchForums', { ids: forumsIds })
  }
}
</script>

<style lang="scss" scoped>

</style>
