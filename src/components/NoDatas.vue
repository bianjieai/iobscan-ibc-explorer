<template>
    <div class="nodatas">
        <img class="nodatas__icon" src="../assets/noDatas.png" />
        <p class="nodatas__title">No Data</p>
    </div>
</template>

<script>
export default {
  setup() {

  },
};
</script>

<style lang="less" scoped>

.nodatas {
    .flex-func(column, nowrap, center, center);
    &__icon {
        width: 120px;
    }
    &__title {
        margin-top: 16px;
        font-size: var(--bj-font-size-normal);
        font-family: Montserrat-Regular, Montserrat;
        font-weight: 400;
        color: @font-color2;
    }
}
</style>
