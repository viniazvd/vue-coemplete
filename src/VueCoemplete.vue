<template>
  <div
    :style="border"
    :class="['vue-coemplete', { '--is-opened': isOpened }]"

    v-click-outside="reset"

    @keyup.esc="reset"
  >
    <div class="search-wrapper" @click="showItems = !showItems">
      <slot
        name="input"
        :on-search="onSearch"
        :keyboard-events="{ up, down, select }">

        <input
          ref="input"
          class="input"

          :value="search"

          @keydown.up.prevent="up"
          @keydown.down.prevent="down"
          @keydown.enter.tab.stop.self="select"

          @input="event => onSearch(event.target.value)"
        />
      </slot>
    </div>

    <div v-show="isOpened" class="list-wrapper">
      <div class="list">
        <div
          v-for="(item, index) in __items"

          :key="index"
          :class="['item', { '-active': index === pointer }]"

          @click="select({ key: 'Click' })"
          @mouseenter.self="pointer = index"
        >
          <slot name="sufix" :item="item" />
          <span :ref="index" class="text">{{ setHightlight(item, index) }}</span>
          <slot name="after" :item="item" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import clickOutside from './clickOutside'

import bindEvent from './utils/bindEvent'
import getDiacritic from './utils/getDiacritic'
import inclusiveSearch from './utils/inclusiveSearch'
import normalizeDiacritics from './utils/normalizeDiacritics'

interface Item {
  [key: string]: string
  area: string
  route: string
  selector: string
}

export default Vue.extend({
  name: 'vue-coemplete',

  props: {
    value: String,

    placeholder: String,

    options: {
      type: Array as () => Item[],
      default: () => []
    },

    items: {
      type: Array as () => Item[],
      default: () => []
    },

    searchProp: {
      type: String,
      default: 'key'
    },

    normalizeProp: {
      type: String,
      default: 'normalized'
    }
  },

  directives: { clickOutside },

  data () {
    return {
      search: '' as string,
      pointer: -1 as number,
      showItems: false as boolean,
      internalItems: [] as Item[]
    }
  },

  watch: {
    value (value) {
      this.search = value
    }
  },

  mounted () {
    bindEvent(document, 'visibilitychange', this.onVisibilityChange)
  },

  computed: {
    border () {
      return {
        'border-radius': this.isOpened
          ? '20px 20px 0 0'
          : '20px'
      }
    },

    hasSlots () {
      return !!Object.keys(this.$scopedSlots).length
    },

    isOpened () {
      return this.showItems && this.__items.length
    },

    __items () {
      if (this.items.length) return this.items

      return this.internalItems
    }
  },

  methods: {
    reset () {
      this.showItems = false
      this.pointer = -1 // reset pointer
    },

    down () {
      if (this.pointer < this.__items.length - 1) this.pointer++
    },

    up () {
      if (this.pointer > 0) this.pointer--
    },

    select ({ key } = 'Enter') {
      if (key !== 'Enter' && key !== 'Click') return

      const item = this.__items[this.pointer]

      this.$nextTick(this.reset)

      if (!this.hasSlots) {
        const value = item[this.searchProp]

        this.search = value
        this.onSearch(value)
      }

      this.$emit('vue-coemplete:select', item)
    },

    onSearch (value: string): void {
      this.search = value
      this.showItems = true

      const results = inclusiveSearch(this.options, normalizeDiacritics(this.search), this.normalizeProp)

      this.internalItems = results
    },

    onVisibilityChange () {
      const action = document.visibilityState === 'visible' ? 'focus' : 'unfocus'

      this.$emit(`vue-coemplete:${action}`)

      if (!this.$refs.input) return

      this.$refs.input.focus()
    },

    setHightlight (item: string, index: number): void {
      // reason: wait for loop items to render/assemble to use $refs
      this.$nextTick(() => {
        const itemRef: { [key: number]: any } = this.$refs[index]
        const el: HTMLSpanElement = itemRef[0]

        // reset data
        el.innerHTML = ''
        const typed = getDiacritic(item, this.searchProp, normalizeDiacritics(this.search), item[this.normalizeProp])

        item[this.searchProp]
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
.vue-coemplete {
  display: flex;
  flex-direction: column;

  position: relative;

  background: white;
  box-shadow: 0 2px 6px -2px rgba(0, 0, 0, 0.2);

  & > .search-wrapper {
    display: flex;
    min-height: 40px;
    position: relative;

    & > .input {
      flex: 1;
      outline: 0;
      width: 100%;
      border: none;
      height: 40px;
      font-size: 14px;
      padding-left: 15px;
      border-radius: 20px;
      padding-right: 40px;
      color: rgba(18, 30, 72, 0.8);
      background: rgba(18, 30, 72, 0.05);
    }
  }

  & > .list-wrapper {
    display: flex;

    position: absolute;
    left: 0;
    top: 100%;

    width: 100%;
    z-index: 10;
    background: white;
    border-radius: 0 0 5px 5px;
    box-shadow: 0 2px 6px -2px rgba(0, 0, 0, 0.2);
    max-height: calc(285px - 40px); // 40 = input size

    & > .list {
      width: 100%;
      font-size: 14px;
      overflow-y: auto;

      & > .item {
        opacity: 0.8;
        color: #121E48;
        padding: 0 15px;
        font-size: 14px;
        line-height: 40px;
        box-sizing: border-box;

        cursor: pointer;

        overflow-x: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;

        &.-active { background-color: rgba(18, 30, 72, 0.05); }
      }
    }
  }
}
</style>
