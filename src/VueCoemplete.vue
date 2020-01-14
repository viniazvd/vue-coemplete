<template>
  <div class="c-auto-complete">
    <div class="search-wrapper">
      <slot name="input" :on-search="onSearch">
        <input class="input" :value="search" @input="event => onSearch(event.target.value)" />
      </slot>
    </div>

    <div v-show="search" class="list-wrapper">
      <div class="list">
        <a
          v-for="(item, index) in items"
          :key="index"
          :to="{ name: item.route }"
          class="item"
        >
          <slot name="sufix" :item="item" />
          <span :ref="index" class="text">{{ setHightlight(item[searchProp], index) }}</span>
          <slot name="after" :item="item" />
        </a>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
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

    options: {
      type: Array as () => Item[],
      required: true
    },

    searchProp: {
      type: String,
      default: 'key'
    }
  },

  data () {
    return {
      items: [] as Item[],
      search: '' as string
    }
  },

  mounted () {
    this.search = this.value
  },

  methods: {
    onSearch (value: string): void {
      this.search = value
      this.$emit('input', value)

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
.c-auto-complete {
  display: flex;
  flex-direction: column;

  height: 100%;
  min-width: 350px;
  border-radius: 20px 20px 5px 5px;
  box-shadow: 0 2px 6px 0 rgba(0,0,0,0.2);
  background: linear-gradient(180deg, #FFFFFF 0%, rgba(255,255,255,0.83) 100%);

  & > .search-wrapper {
    display: flex;
    min-height: 40px;
    position: relative;

    & > .input {
      flex: 1;
      width: 100%;
      outline: 0;
      border: none;
      height: 40px;
      font-size: 14px;
      padding-left: 15px;
      border-radius: 20px;
      padding-right: 40px;
      transition: all .3s;
      box-shadow: 0 0 0 0 rgba(0,0,0,0);
    }
  }

  & > .list-wrapper {
    display: flex;

    // The entire popover's height minus the heading's height.
    max-height: calc(310px - 101px);

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
        cursor: pointer;
        font-size: 14px;
        color: #121E48;
        line-height: 19px;
        padding: 10px 15px;

        overflow-x: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        max-width: calc(100% - 10px);

        & > .text {}

        &:hover { background: rgba(18, 30, 72, 0.05); }
      }
    }
  }
}
</style>
