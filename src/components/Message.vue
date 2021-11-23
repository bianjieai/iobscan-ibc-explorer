<template>
  <div class="tip">
      <div class="tip__icon">
        <img style="width: 90%; height: 90%" src="../assets/commingsoon.png" />
      </div>
    <span class="tip__title">Coming Soon…</span>
  </div>
</template>

<script>
export default {
  setup() {},
};
</script>

<style lang="scss" scoped>
.tip {
  min-width: 120px;
  position: relative;
  &__icon {
    width: 32px;
    height: 32px;
    background-color: #3d50ff;
    border-radius: 50%;
    padding: 4px;
    position: absolute;
    left: -32px;
    top: -6px;
  }
  &__title {
    margin-left: 16px;
    font-family: Montserrat-Regular, Montserrat;
  }
}
</style>
