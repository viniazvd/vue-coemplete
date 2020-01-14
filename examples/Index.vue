<template>
  <div id="app">
    <with-slots />
    <without-slots />
  </div>
</template>

<script>
import WithSlots from './WithSlots.vue'
import WithoutSlots from './WithoutSlots.vue'

export default {
  name: 'example',

  components: { WithSlots, WithoutSlots }
}
</script>

<style lang="scss">
#app {
  display: flex;
  justify-content: space-evenly;
}
</style>
