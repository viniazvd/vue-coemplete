<template>
  <vue-coemplete placeholder="Pesquisar" :options="options">
    <input
      class="input"
      slot="input"
      slot-scope="{ onSearch }"
      @input="event => onSearch(event.target.value)"
    />

    <div slot="after" slot-scope="{ item }"> - {{ item.area }}</div>
  </vue-coemplete>
</template>

<script>
import data from './data'
import { VueCoemplete } from '../dist/bundle.cjs'

export default {
  name: 'example',

  components: { VueCoemplete },

  computed: {
    options () {
      return [ ...data ]
    }
  }
}
</script>

<style lang="scss">
.input {
  border: 0;
  width: 100%;
  outline: none;
  padding-left: 20px;
  border-radius: 20px;
}
</style>
