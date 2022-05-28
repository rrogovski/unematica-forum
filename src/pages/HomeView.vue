<template>
  <h1>Bem-vindo ao Unemática</h1>
  <ThreadList :threads="threads" />
</template>

<script>
import ThreadList from '@/components/ThreadList'
import sourceData from '@/data.json'

export default {
  components: { ThreadList },
  data () {
    return {
      threads: sourceData.threads
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
