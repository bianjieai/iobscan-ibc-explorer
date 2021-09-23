<template>
  <a-input
    class="header__input"
    placeholder="Basic usage"
    v-model:value="inputValue"
    @pressEnter="onPressEnter"
  >
    <template #prefix>
      <img class="input__prefix" src="../assets/search.png" alt="search" />
    </template>
  </a-input>
</template>

<script>
import { ref } from 'vue';

export default {
  setup(props, context) {
    const inputValue = ref('');
    const onPressEnter = () => {
      context.emit('pressEnter', inputValue.value);
    };
    return {
      inputValue,
      onPressEnter,
    };
  },
};
</script>

<style lang="scss">
.header__input {
  height: 40px;
  background-color: rgba(#ffffff, 0.1);
  border: 1px solid rgba(61, 80, 255, 0.5);
  border-radius: 20px;
  input {
    background-color: transparent;
    color: #ffffff;
  }
  .input__prefix {
    width: 24px;
    margin-right: 20px;
  }
}
</style>
