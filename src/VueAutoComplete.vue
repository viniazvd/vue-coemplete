<template>
  <div class="c-auto-complete">
    <div class="search-wrapper">
      <slot name="input">
        <input
          class="search"
          :value="search"
          :placeholder="placeholder"
          @input="event => $emit('search', event.target.value)"
        />
      </slot>
    </div>

    <div v-show="search" class="list-wrapper">
      <div class="list">
        <a
          v-for="(item, index) in options"
          :key="index"
          :to="{ name: item.route }"
          class="item"
        >
          <slot class="text" :item="item" :index="index" />
        </a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'vue-auto-complete',

  props: {
    search: String,

    placeholder: String,

    options: {
      type: Array,
      required: true
    },

    displayBy: {
      type: Array,
      required: true
    }
  }
}
</script>

<style lang="scss">
.c-auto-complete {
  display: flex;

  max-height: 310px;
  box-shadow: unset;
  border-radius: 5px;
  flex-direction: column;
  background-color: #FFF;
  color: black;

  &:hover { box-shadow: unset; }

  & > .search-wrapper {
    border-bottom: 1px solid black;

    & > .search { margin: 10px; }
    & > .search > .input { max-width: 100%; }
  }

  & > .list-wrapper {
    display: flex;

    & > .list {
      font-size: 14px;
      overflow-y: auto;

      display: flex;
      flex-direction: column;
      flex-basis: 100%;

      & > .item {
        display: flex;
        flex-shrink: 0;
        align-items: center;

        height: 40px;

        opacity: 1;
        color: black;
        cursor: pointer;
        padding: 10px 15px;
        text-decoration: none;
        background-color: transparent;
        transition: opacity .3s,  background-color .3s;

        & > .text {
          overflow-x: hidden;
          white-space: nowrap;
          display: inline-block;
          text-overflow: ellipsis;
          max-width: calc(100% - 10px);
        }

        // &:hover { background-color: map-get($text-color, base-02); }
      }
    }
  }
}
</style>
