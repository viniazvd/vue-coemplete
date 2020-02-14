<template>
  <div class="text-wrapper">
    <slot name="sufix" :item="item" />
    <span :ref="index" class="text">
      <component 
        v-for="(chunk, key) in chunks" 
        :key="key"
        :is="chunk.bold ? 'b' : 'span'"
      >{{ chunk.content }}</component>
    </span>
    <slot name="after" :item="item" />
  </div>
</template>

<script lang="ts">
import getDiacritic from '../utils/getDiacritic'
import normalizeDiacritics from '../utils/normalizeDiacritics'

import Vue from 'vue'

interface Chunk {
  content: string,
  bold: boolean,
}

export default Vue.extend({
  name: 'item',

  props: {
    diacritic: Boolean,

    searchProp: String,

    normalizeProp: String,

    item: {
      type: Object,
      required: true
    },

    index: Number,

    search: String
  },

  computed: {
    chunks () : Chunk[] {
      const typed = !this.diacritic
        ? this.search
        : getDiacritic(this.item, this.searchProp, normalizeDiacritics(this.search), this.item[this.normalizeProp])
      const chunks = this.item[this.searchProp]
          .split(typed)
          .reduce((chunks: Chunk[], split: string, i: number, splits: string[]) => {
            const hasAfter: Boolean = !!splits[i + 1]
            const hasBefore: Boolean = !!splits[i - 1]
            const typedChunk = {content: typed, bold: false}
            const splitChunk = {content: split, bold: true}
            const initialChunks = !split ? [...chunks, typedChunk] : [...chunks]
            const preChunks = (!split && !hasBefore && !hasAfter) ?
              [typedChunk] :
              initialChunks

           return split && hasAfter ? 
              [...preChunks, splitChunk, typedChunk] :
              [...preChunks, splitChunk]
          }, [])
      
      return chunks
    }
  }
})
</script>

<style lang="scss">

</style>