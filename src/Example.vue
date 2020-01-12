<template>
  <div id="app">
    <vue-auto-complete
      placeholder="Pesquisar"
      :search="search"
      :display-by="['area']"
      :options="options"
      @search="onSearch"
    >
      <span :ref="index" class="text" slot-scope="{ item, index }">
        {{ getResult(item, index) }}
      </span>
    </vue-auto-complete>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import data from './data'
import inclusiveSearch from './inclusiveSearch'
import VueAutoComplete from './VueAutoComplete.vue'

interface Item {
  key: string
  area: string
  route: string
  selector: string
}

export default Vue.extend({
  name: 'example',

  components: { VueAutoComplete },

  data () {
    return {
      search: '' as string,
      options: [] as Item[],
      searchProp: 'key' as string
    }
  },

  methods: {
    onSearch (value: string) {
      this.search = value

      const results = inclusiveSearch(data, this.search, this.searchProp)

      this.options = results
    },

    getResult (item: Item, index: number) {
      const itemRef: any = this.$refs[index]

      if (!itemRef || !item) return

      // reset data
      itemRef.innerHTML = ''

      item[this.searchProp]
        .split(this.search)
        .forEach((chunk: string, i: number, array: string[]) => {
          const hasAfter: Boolean = !!array[i + 1]
          const hasBefore: Boolean = !!array[i - 1]
          const B_TAG: HTMLElement = document.createElement('b')

          if (!chunk) itemRef.innerHTML += this.search

          B_TAG.innerHTML += chunk
          itemRef.appendChild(B_TAG)

          if (chunk && !hasBefore && hasAfter) itemRef.innerHTML += this.search
        })
    }
  }
})
</script>
