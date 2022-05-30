<template>
  <h1>Bem-vindo ao Unemática</h1>
  <CategoryList :categories="categories" />
</template>

<script>
import CategoryList from '@/components/CategoryList'
import sourceData from '@/data.json'

export default {
  components: { CategoryList },
  data () {
    return {
      categories: sourceData.categories
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
