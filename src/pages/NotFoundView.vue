<template>
  <div class="col-full text-center">
    <div class="wrapper">
      <h1>Não Encontrado</h1>
      <router-link :to="{name: 'Home'}">Voltar para a página inicial</router-link>
    </div>
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
  .wrapper {
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
</style>
