<template>
  <div class="page-title-container">
    <img class="icon" v-if="hasIcon" :src="imgSrc">
    <div class="flex">
      <div class="title-p">
        <img class="icon inline-icon" v-if="hasIcon" :src="imgSrc">
        <a-typography-text class="title">{{ title }}</a-typography-text>
        <div class="background" :style="{ bottom: hasIcon ? '3px' : '-3px' }"></div>
      </div>
      <a-typography-text class="number">( {{ subtitle }} )</a-typography-text>
    </div>
  </div>
</template>

<script lang="ts" setup>
interface IProps {
  hasIcon?: boolean
  title: string
  subtitle: string
  imgSrc?:string
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

// mobile
@media screen and (max-width: 414px) {
  .page-title-container {
    display: inline-flex;
    text-align: left;

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