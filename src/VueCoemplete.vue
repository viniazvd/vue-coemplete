<template>
  <div class="vue-coemplete" :style="border" v-click-outside="close" @keyup.esc="close">
    <div class="search-wrapper">
      <slot
        name="input"
        :on-search="onSearch"
        :keyboard-events="{ pointerForward, pointerBackward, addPointerElement }">

        <input
          class="input"
          :value="search"
          @keydown.down.prevent="pointerForward"
          @keydown.up.prevent="pointerBackward"
          @keydown.enter.tab.stop.self="addPointerElement"

          @input="event => onSearch(event.target.value)"
        />
      </slot>
    </div>

    <div v-show="search && showItems" class="list-wrapper">
      <div class="list">
        <component
          v-for="(item, index) in items"
          :is="tag"
          :key="index"
          :class="['item', { '-active': index === pointer }]"
          @mouseenter.self="pointerSet(index)"
          @click="$emit('vue-complete:item', item)"
        >
          <slot name="sufix" :item="item" />
          <span :ref="index" class="text">{{ setHightlight(item[searchProp], index) }}</span>
          <slot name="after" :item="item" />
        </component>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import clickOutside from './clickOutside'
import inclusiveSearch from './inclusiveSearch'

interface Item {
  [key: string]: string
  area: string
  route: string
  selector: string
}

export default Vue.extend({
  name: 'vue-coemplete',

  props: {
    placeholder: String,

    value: String,

    tag: {
      type: String,
      default: 'a'
    },

    options: {
      type: Array as () => Item[],
      required: true
    },

    searchProp: {
      type: String,
      default: 'key'
    }
  },

  directives: { clickOutside },

  data () {
    return {
      pointer: -1,
      items: [] as Item[],
      search: '' as string,
      showItems: false as boolean
    }
  },

  watch: {
    search () {
      this.showItems = true
    }
  },

  mounted () {
    this.search = this.value
  },

  computed: {
    border () {
      return {
        'border-radius': this.items.length && this.showItems
          ? '20px 20px 5px 5px'
          : '20px'
      }
    }
  },

  methods: {
    outside () {
      // this.isOpened = false
      // this.unsetFocus()
      this.pointerReset()
    },

    pointerReset () {
      this.pointer = -1
    },

    pointerSet (index) {
      this.pointer = index
    },

    pointerForward () {
      if (this.pointer < this.items.length - 1) this.pointer++
    },

    pointerBackward () {
      if (this.pointer > 0) this.pointer--
    },

    addPointerElement ({ key } = 'Enter') {
      if (this.items.length && key === 'Enter') {
        const value = this.items[this.pointer].key
        const hasSlot = !!Object.keys(this.$scopedSlots).length

        if (hasSlot) {
          this.onSearch(value)
          this.$emit('vue-complete:select', value)
        } else {
          this.search = value
        }

        this.$nextTick(() => {
          this.pointerReset()
          this.showItems = false
        })
      }
    },

    close () {
      this.showItems = false
    },

    onSearch (value: string): void {
      this.search = value

      const results = inclusiveSearch(this.options, this.search, this.searchProp)

      this.items = results
    },

    setHightlight (item: string, index: number): void {
      // reason: wait for loop items to render/assemble to use $refs
      this.$nextTick(() => {
        const itemRef: { [key: number]: any } = this.$refs[index]
        const el: HTMLSpanElement = itemRef[0]

        // reset data
        el.innerHTML = ''

        item
          .split(this.search)
          .forEach((chunk: string, i: number, array: string[]) => {
            const hasAfter: Boolean = !!array[i + 1]
            const hasBefore: Boolean = !!array[i - 1]
            const B_TAG: HTMLElement = document.createElement('b')

            if (!chunk) el.innerHTML += this.search
            if (!chunk && !hasBefore && !hasAfter) el.innerHTML = this.search

            B_TAG.innerHTML += chunk
            el.appendChild(B_TAG)

            if (chunk && !hasBefore && hasAfter) el.innerHTML += this.search
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

  box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.2);

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

    // 40 = input size
    max-height: calc(285px - 40px);

    & > .list {
      font-size: 14px;

      display: flex;
      flex-direction: column;
      flex-basis: 100%;

      overflow-y: auto;

      & > .item {
        display: flex;
        flex-shrink: 0;
        align-items: center;

        height: 40px;
        opacity: 0.8;
        color: #121E48;
        padding: 0 15px;
        font-size: 14px;
        line-height: 19px;

        cursor: pointer;

        overflow-x: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        max-width: calc(100% - 10px);

        &.-active { background-color: rgba(18, 30, 72, 0.05); }
      }
    }
  }
}
</style>
