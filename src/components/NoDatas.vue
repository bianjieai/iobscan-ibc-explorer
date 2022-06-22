<template>
    <div class="nodatas">
        <img class="nodatas_icon" src="../assets/noDatas.png" />
        <p class="nodatas_title">No Data</p>
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
    .flex(column, nowrap, center, center);
    &_icon {
        width: 120px;
    }
    &_title {
        margin-top: 16px;
        font-size: var(--bj-font-size-normal);
        font-family: Montserrat-Regular, Montserrat;
        font-weight: 400;
        color: @font-color2;
    }
}
</style>
