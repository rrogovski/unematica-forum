<template>
  <h1>Bem-vindo ao Unemática</h1>
  <ForumList :forums="forums" />
</template>

<script>
import ForumList from '@/components/ForumList'
import sourceData from '@/data.json'

export default {
  components: { ForumList },
  data () {
    return {
      forums: sourceData.forums
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
