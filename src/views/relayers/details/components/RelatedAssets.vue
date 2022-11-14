<template>
    <InfoCard
        class="related_asset_c"
        icon="icon-a-relayedassets"
        title="Related Assets"
        :is-show-choose-btn="true"
        :default-choose-btn="relayedAssetsChoose"
        @change-choose-btn="relayedAssetsChooseBtnFn"
    >
        <RelatedAssetChart
            ref="relatedAssetValueRef"
            class="related_asset_c__value"
            :relayed-assets-choose="relayedAssetsChoose"
            :type="RelatedAssetsPieType.relayedValue"
        />
        <RelatedAssetChart
            ref="relatedAssetFeeRef"
            class="related_asset_c__fee"
            :relayed-assets-choose="relayedAssetsChoose"
            :type="RelatedAssetsPieType.feeCost"
        />
    </InfoCard>
</template>

<script setup lang="ts">
    import { RelatedAssetsPieType } from '@/types/interface/relayers.interface';
    import RelatedAssetChart from './RelatedAssetChart.vue';

    const relayedAssetsChoose = ref(0);
    const relatedAssetValueRef = ref<any>(null);
    const relatedAssetFeeRef = ref<any>(null);
    const relayedAssetsChooseBtnFn = (index: number) => {
        relayedAssetsChoose.value = index;
        relatedAssetValueRef.value &&
            relatedAssetValueRef.value.relayedAssetsChooseBtnFn &&
            (relatedAssetValueRef.value as any).relayedAssetsChooseBtnFn(index);
        relatedAssetFeeRef.value &&
            relatedAssetFeeRef.value.relayedAssetsChooseBtnFn &&
            (relatedAssetFeeRef.value as any).relayedAssetsChooseBtnFn(index);
    };
</script>

<style lang="less" scoped>
    .related_asset_c {
        :deep(.info_card__primary) {
            padding: 0;
            height: 589px;
            .flex(column, nowrap);
        }
        &__value {
        }
        &__fee {
        }
    }
    @media screen and (max-width: 1183px) {
        .related_asset_c {
            :deep(.info_card__primary) {
                height: 250px;
                flex-direction: row;
            }
            &__value {
            }
            &__fee {
                border-right: none;
            }
        }
    }
    @media screen and (max-width: 767px) {
        .related_asset_c {
            :deep(.info_card__primary) {
                height: 450px;
                flex-direction: column;
            }
            &__value {
            }
            &__fee {
                margin: 0 0 10px 0;
            }
        }
    }
</style>
