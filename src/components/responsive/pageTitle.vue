<template>
  <div class="page-title-container">
    <div class="icon"></div>
    <div class="flex">
      <div class="title-p">
        <div class="icon inline-icon"></div>
        <a-typography-text class="title">IBC Tokens1111</a-typography-text>
        <div class="background"></div>
      </div>
      <a-typography-text class="number">( 254 tokens found )</a-typography-text>
    </div>
  </div>
</template>

<script lang="ts" setup>
// TODO clippers => 完善props
interface IProps {
  hasIcon?: boolean
}

const props = defineProps<IProps>()

</script>

<style lang="less" scoped>
.page-title-container {
  display: inline-flex;
  align-items: center;
  line-height: 1;
  position: relative;
  justify-content: flex-start;

  .flex {
    display: flex;
    align-items: center;
  }

  .icon {
    width: 32px;
    height: 32px;
    border-radius: 32px;
    background-color: aqua;
    margin-right: 8px;
  }

  .inline-icon {
    display: none;
  }

  .title-p {
    margin-right: 8px;

    .title {
      font-size: var(--bj-font-size-title);
    }
  }

  .number {
    color: var(--bj-text-second);
  }

  .background {
    position: absolute;
    left: 0;
    right: -8px;
    height: 12px;
    bottom: 3px;
    background: linear-gradient(90deg, rgba(112, 136, 255, 0) 0%, rgba(61, 80, 255, 0.15) 100%);
    border-radius: 5px;
    box-sizing: border-box;
  }
}

// pc
@media screen and (min-width: 768px) {
  .page-title-container {
    padding-top: 48px; 
  }
}

// tablet
@media screen and (min-width: 414px) and (max-width: 768px) {
  .page-title-container {
    padding-top: 40px; 
  }
}

// mobile
@media screen and (max-width: 414px) {
  .page-title-container {
    display: inline-flex;
    text-align: left;
    padding-top: 24px;

    .flex {
      display: block;
    }

    .icon {
      display: none;
    }

    .inline-icon {
      display: block;

    }

    .title-p {
      position: relative;
      display: inline-flex;
      align-items: center;
      margin-right: 0;
      margin-bottom: 8px;
    }

    .number {
      display: block;
    }
  }
}
</style>