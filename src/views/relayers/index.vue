<template>
  <PageContainer>
    <PageTitle title="IBC Relayers" subtitle="xxx relayers found" />
    <!-- <DoubleAllChainsDropDown 
    
    /> -->
    <BjTable :data="data" :need-custom-columns="needCustomColumns" :columns="COLUMNS" need-count>
      
    </BjTable>
  </PageContainer>
</template>

<script setup lang="ts">
// todo clippers => subtitle
// todo clippers => 请求
import PageContainer from '@/components/responsive/pageContainer.vue';
import PageTitle from '@/components/responsive/pageTitle.vue';
import BjTable from '@/components/responsive/table/index.vue'
import { COLUMNS } from './constants'
// import DoubleAllChainsDropDown from '@/components/responsive/table/doubleAllChainsDropDown.vue';

const data:any = []
const needCustomColumns = ['']

</script>