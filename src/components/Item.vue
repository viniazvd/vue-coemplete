<template>
  <div class="text-wrapper">
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

</style>