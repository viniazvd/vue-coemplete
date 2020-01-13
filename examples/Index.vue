<template>
  <div id="app">
    <vue-coemplete placeholder="Pesquisar" :options="options" :display-by="['area']">
      <input class="input" slot-scope="{ onSearch }" @input="event => onSearch(event.target.value)" />
    </vue-coemplete>

    <vue-coemplete placeholder="Pesquisar" :options="options" :display-by="['area']" />
  </div>
</template>

<script>
import data from './data'
import { VueCoemplete } from '../dist/bundle'

export default {
  name: 'example',

  components: { VueCoemplete },

  computed: {
    options () {
      return data
    }
  }
}
</script>

<style lang="scss">
#app {
  display: flex;
  justify-content: space-evenly;
}

.input {
  width: 100%;
  border-radius: 20px;
  border: 0;
  outline: none;
  padding-left: 20px;
}
</style>
