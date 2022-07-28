<template>
    <a-popover placement="topLeft">
        <template #content>
            <div class="popover-c">
                <div>Relayer Name: {{ relayerName ? relayerName : UNKNOWN }}</div>
                <div>{{ `${chain_a_name} Address` }}: {{ chainAAddress }}</div>
                <div>{{ `${chain_b_name} Address` }}: {{ chainAAddress }}</div>
            </div>
        </template>
        <IconAndTitle :title="relayerName" :img-src="imgSrc" relayer icon-size="small" />
    </a-popover>
</template>

<script setup lang="ts">
    import IconAndTitle from '@/components/responsive/table/IconAndTitle.vue';
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
