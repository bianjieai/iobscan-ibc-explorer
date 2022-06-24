<template>
  <PageContainer>
    <PageTitle title="IBC Chains" subtitle="xxx chains supported" />

    <BjTable :data="data" :need-custom-columns="needCustomColumns" :columns="COLUMNS" need-count no-pagination
      :scroll="{ y: 610 }">

    </BjTable>
  </PageContainer>
</template>


<script lang="ts" setup>
// todo clippers => subtitle
// todo clippers => 请求
// todo clippers => 跳转
import PageContainer from '@/components/responsive/pageContainer.vue';
import PageTitle from '@/components/responsive/pageTitle.vue';
import BjTable from '@/components/responsive/table/index.vue'
import { COLUMNS } from './constants'


const data: any = [

]


const needCustomColumns = ['']


</script>

<style lang="less" scoped>
.table-warpper {
  margin-top: 32px;
}

// pc
@media screen and (min-width: 768px) {}

// tablet
@media screen and (min-width: 414px) and (max-width: 768px) {
  .table-warpper {
    margin-top: 24px;
  }
}

// mobile
@media screen and (max-width: 414px) {
  .table-warpper {
    margin-top: 16px;
  }
}
</style>