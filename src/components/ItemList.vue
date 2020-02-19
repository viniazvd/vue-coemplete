<template>
  <div class="list-wrapper">
    <div class="list">
      <item
        v-for="(item, index) in items"

        :key="index"
        :item="item"
        :index="index"
        :pointer="pointer"

        v-bind="$attrs"
        v-on="$listeners"
      >
        <slot slot="before" name="before" slot-scope="{ item }" :item="item" />
        <slot slot="after" name="after" slot-scope="{ item }" :item="item" />
      </item>
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
  }
}
</style>