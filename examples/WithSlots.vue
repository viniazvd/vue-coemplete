<template>
  <vue-coemplete
    placeholder="Pesquisar"
    :options="options"
    @vue-complete:select="value => searchValue = value"
  >
    <input
      class="input"
      slot="input"
      slot-scope="{ onSearch, keyboardEvents }"

      :value="searchValue"

      @keydown.down.prevent="keyboardEvents.pointerForward"
      @keydown.up.prevent="keyboardEvents.pointerBackward"
      @keydown.enter.tab.stop.self="keyboardEvents.addPointerElement"

      @input="event => onInput(event.target.value, onSearch)"
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

  data () {
    return { searchValue: '' }
  },

  computed: {
    options () {
      return [ ...data ]
    }
  },

  methods: {
    onInput (value, onSearch) {
      this.searchValue = value
      onSearch(this.searchValue)
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
