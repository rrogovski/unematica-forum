<template>
<h1>{{ category.name }}</h1>
  <forum-list
    :title="category.name"
    :forums="getForumsForCategory(category)"
  />
</template>

<script>
import ForumList from '@/components/ForumList.vue'

export default {
  components: { ForumList },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  computed: {
    category () {
      return this.$store.state.categories.find(category => category.id === this.id) || {}
    }
  },
  methods: {
    getForumsForCategory (category) {
      return this.$store.state.forums.filter(forum => forum.categoryId === category.id)
    }
  },
  async created () {
    const category = await this.$store.dispatch('fetchCategory', { id: this.id })
    this.$store.dispatch('fetchForums', { ids: category.forums })
  }
}
</script>

<style lang="scss" scoped>

</style>
