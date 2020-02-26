<template>
  <div
    :class="['vue-coemplete-item', { '-active': index === pointer }]"

    @click="$emit('item-list:click')"
    @mouseenter.self="$emit('item-list:mouseenter', index)"
  >
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
    searchProp: String,

    normalizeProp: String,

    item: {
      type: Object,
      required: true
    },

    index: Number,

    pointer: Number,

    search: String
  },

  computed: {
    chunks () : Chunk[] {
      const typed = getDiacritic(this.item, this.searchProp, normalizeDiacritics(this.search), this.item[this.normalizeProp])

      const chunks = this.item[this.searchProp]
        .split(typed)
        .reduce((chunks: Chunk[], split: string, i: number, splits: string[]) => {
          const hasAfter: Boolean = !!splits[i + 1]
          const hasBefore: Boolean = !!splits[i - 1]
          const splitChunk = { content: split, bold: true }
          const typedChunk = { content: typed, bold: false }
          const initialChunks = !split ? [ ...chunks, typedChunk ] : [ ...chunks ]
          const preChunks = (!split && !hasBefore && !hasAfter)
            ? [ typedChunk ]
            : initialChunks

          return [
            ...preChunks,
            splitChunk,
            split && hasAfter ? typedChunk : {}
          ]
        }, [])

      return chunks
    }
  }
})
</script>

<style lang="scss">
.vue-coemplete-item {
  opacity: 0.8;
  color: #121E48;
  padding: 0 15px;
  font-size: 14px;
  line-height: 40px;

  cursor: pointer;

  overflow-x: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  &.-active { background-color: rgba(18, 30, 72, 0.05); }
}
</style>
