<template>
  <PageContainer>
    <PageTitle title="xxx IBC Tokens" subtitle="254 tokens found" has-icon/>
    <BjTable :data="data" :need-custom-columns="needCustomColumns" :columns="IBC_COLUMNS" need-count>
    
    </BjTable>
  </PageContainer>
</template>

<script setup lang="ts">
// todo clippers => tilte 
// todo clippers => subtitle
import PageContainer from '@/components/responsive/pageContainer.vue';
import PageTitle from '@/components/responsive/pageTitle.vue';
import BjTable from '@/components/responsive/table/index.vue'
import { IBC_COLUMNS } from './constants'

const data:any = []
const needCustomColumns = ['']

</script>