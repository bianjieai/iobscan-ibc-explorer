<template>
    <a-popover placement="topLeft">
        <template #content>
            <div class="popover_c">
                <div>
                    <span class="tip_label">Relayer Name:</span>
                    <span class="tip_value">{{ relayerName ? relayerName : UNKNOWN }}</span>
                </div>
                <div>
                    <span class="tip_label">{{ `${chain_a_name} Address` }}:</span>
                    <span class="tip_value">{{ chainAAddress }}</span>
                </div>
                <div>
                    <span class="tip_label">{{ `${chain_b_name} Address` }}:</span>
                    <span class="tip_value">{{ chainBAddress }}</span>
                </div>
            </div>
        </template>
        <IconAndTitle :title="relayerName" :img-src="imgSrc" relayer icon-size="small" />
    </a-popover>
</template>

<script setup lang="ts">
    import { IIbcchain } from '@/types/interface/index.interface';
    import { computed } from 'vue';
    import { formatLongTitleString } from '@/helper/parseStringHelper';
    import { RELAYER_STATUS } from '@/constants/relayers';
    import { UNKNOWN } from '../../../constants';
    interface IProps {
        relayerName: string;
        imgSrc: string;
        chainAAddress: string;
        chainBAddress: string;
        chainA: string; // chain id
        chainB: string;
        ibcChains?: IIbcchain[];
    }

    const props = defineProps<IProps>();

    const findChainName = (chainId: string) => {
        if (Array.isArray(props.ibcChains)) {
            const ibcChain = props.ibcChains.find((item) => item.chain_id === chainId);
            if (ibcChain) {
                return formatLongTitleString(ibcChain.chain_name);
            } else {
                return RELAYER_STATUS.UNKNOWN;
            }
        } else {
            return RELAYER_STATUS.UNKNOWN;
        }
    };

    const chain_a_name = computed(() => {
        return findChainName(props.chainA);
    });

    const chain_b_name = computed(() => {
        return findChainName(props.chainB);
    });
</script>
<style lang="less" scoped>
    .tip_label {
        font-family: GolosUI_Medium;
    }
    .tip_value {
        margin-left: 4px;
    }
</style>
