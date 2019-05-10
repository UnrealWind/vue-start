<template>
  <div>
    <slot></slot>
  </div>
</template>
<script>
  import footerAddin from './footer-addin.vue'
  export default {
    name:'self-component',
    components: {
      footerAddin
    },
  }
</script>
