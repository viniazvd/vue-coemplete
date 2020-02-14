<template>
  <div class="list-wrapper">
    <div class="list">
      <div
        v-for="(item, index) in items"

        :key="index"
        :class="['item', { '-active': index === pointer }]"

        @click="$emit('item-list:click')"
        @mouseenter.self="$emit('item-list:mouseenter', index)"
      >
        <item :item="item" :index="index" v-bind="$attrs">
          <slot slot="before" name="before" slot-scope="{ item }" :item="item" />
          <slot slot="after" name="after" slot-scope="{ item }" :item="item" />
        </item>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Item from './Item.vue'

export default Vue.extend({
  components: { Item },

  props: {
    items: {
      type: Array,
      required: true
    },

    pointer: Number
  }
})
</script>

<style lang="scss">
.list-wrapper {
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
</style>