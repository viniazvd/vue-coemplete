<template>
  <vue-coemplete placeholder="Pesquisar" :options="options" />
</template>

<script>
import data from './data'
import { VueCoemplete } from '../dist/bundle.cjs'

export default {
  name: 'without-slots',

  components: { VueCoemplete },

  computed: {
    options () {
      return [ ...data ]
    }
  }
}
</script>
