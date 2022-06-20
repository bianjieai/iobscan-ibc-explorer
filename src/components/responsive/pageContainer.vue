<template>
  <div class="page-container">
    <div class="container">
      <slot></slot>
    </div>
  </div>
</template>

<style lang="less" scoped>
.page-container {
  background-color: var(--bj-background-color);
  flex: 1;
  width: 100%;
  text-align: left;
  box-sizing: border-box;
  .container {
    box-sizing: border-box;
  }
}

// pc
@media screen and (min-width: 768px) {
  .page-container {
    padding-left: 32px;
    padding-right: 32px;
  }
  .container {
    max-width: 1200px;
    margin: 0 auto;
  }
}

// tablet
@media screen and (min-width: 414px) and (max-width: 768px) {
  .page-container {
    padding-left: 32px;
    padding-right: 32px;
  }
  .container {
    width: 100%;
  }

}

// mobile
@media screen and (max-width: 414px) {
  .page-container {
    padding-left: 16px;
    padding-right: 16px;
  }
  .container {
    width: 100%;
  }
}
</style>