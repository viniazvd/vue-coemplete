<template>
  <div
    :class="['vue-coemplete-item', { '-active': index === pointer }]"

    @click="$emit('item-list:click')"
    @mouseenter.self="$emit('item-list:mouseenter', index)"
  >
    <slot name="sufix" :item="item" />
    <span :ref="index" class="text">{{ setHightlight() }}</span>
    <slot name="after" :item="item" />
  </div>
</template>

<script lang="ts">
import getDiacritic from '../utils/getDiacritic'
import normalizeDiacritics from '../utils/normalizeDiacritics'

import Vue from 'vue'

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

  methods: {
    setHightlight (): void {
      // reason: wait for loop items to render/assemble to use $refs
      this.$nextTick(() => {
        const el: { [key: number]: HTMLSpanElement } = this.$refs[this.index]

        // reset data
        el.innerHTML = ''

        const typed = getDiacritic(this.item, this.searchProp, normalizeDiacritics(this.search), this.item[this.normalizeProp])

        this.item[this.searchProp]
          .split(typed)
          .forEach((chunk: string, i: number, array: string[]) => {
            const hasAfter: Boolean = !!array[i + 1]
            const hasBefore: Boolean = !!array[i - 1]
            const B_TAG: HTMLElement = document.createElement('b')

            if (!chunk) el.innerHTML += typed
            if (!chunk && !hasBefore && !hasAfter) el.innerHTML = typed

            B_TAG.innerHTML += chunk
            el.appendChild(B_TAG)

            if (chunk && hasAfter) el.innerHTML += typed
          })
      })
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