<template>
<div class="col-full text-center">
  <h1>Não Encontrado</h1>
  <router-link :to="{name: 'Home'}">Voltar para a página inicial</router-link>
</div>
</template>

<script>
export default {
  created () {
    this.$emit('ready')
  }
}
</script>

<style lang="scss" scoped>

</style>
