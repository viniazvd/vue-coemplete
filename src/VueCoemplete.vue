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

    <item-list
      v-show="isOpened"

      :items="__items"
      :search="search"
      :pointer="pointer"
      :search-prop="searchProp"
      :normalize-prop="normalizeProp"

      @item-list:click="select({ key: 'Click' })"
      @item-list:mouseenter="index => pointer = index"
      @vue-coemplete-mouseenter="index => pointer = index"
    >
      <slot slot="before" name="before" slot-scope="{ item }" :item="item" />
      <slot slot="after" name="after" slot-scope="{ item }" :item="item" />
    </item-list>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import clickOutside from './clickOutside'

import findBy from './utils/findBy'
import bindEvent from './utils/bindEvent'
import setDiacritic from './utils/setDiacritic'
import normalizeDiacritics from './utils/normalizeDiacritics'

import ItemList from './components/ItemList.vue'

export default Vue.extend({
  name: 'vue-coemplete',

  components: { ItemList },

  props: {
    value: String,

    placeholder: String,

    options: {
      type: Array,
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
      showItems: false as boolean
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
    border (): object {
      return {
        'border-radius': this.isOpened
          ? '20px 20px 0 0'
          : '20px'
      }
    },

    hasSlots (): boolean {
      return !!Object.keys(this.$scopedSlots).length
    },

    isOpened (): boolean {
      return this.showItems && this.__items.length
    },

    __items (): object[] {
      if (!this.search) return this.options

      const query: string = normalizeDiacritics(this.search)
      const xs: object[] = setDiacritic(this.options, this.normalizeProp, this.searchProp)

      return findBy(xs, query, this.normalizeProp)
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

    select ({ key } = 'Enter'): void {
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
    },

    onVisibilityChange (): void {
      const action = document.visibilityState === 'visible' ? 'focus' : 'unfocus'

      this.$emit(`vue-coemplete:${action}`)

      if (!this.$refs.input) return

      this.$refs.input.focus()
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
}
</style>
