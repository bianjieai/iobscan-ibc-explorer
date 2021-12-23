<template>
  <a-input
    class="header__input"
    placeholder="Search by TxHash"
    allowClear
    disabled
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
  props: {
    disabled: Boolean,
  },
  setup(props, context) {
    const inputValue = ref('');
    const onPressEnter = (evt) => {
      context.emit('pressedEnter', evt.target.value);
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
    font-family: Montserrat-Regular, Montserrat;
  }
  .input__prefix {
    width: 24px;
    margin-right: 20px;
  }
}
</style>
