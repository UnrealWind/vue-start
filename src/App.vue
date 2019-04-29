<template>
  <div id="app">
    <router-view></router-view>
    <tk-global :components="components"></tk-global>
  </div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      components: [
        {
          name: 'toast',
          component: 'tk-toast'
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
