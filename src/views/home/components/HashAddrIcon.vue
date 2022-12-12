<template>
    <div class="out_hash">
        <HashAddrIconItem
            :hash="item.sc_tx_info.hash"
            :go-hash-value="item.sc_tx_info.hash"
            :chain="sc_chain"
            :chain-logo-url="scChainIcon"
            :address="item.sc_addr"
        />
        <img class="status_icon" :src="getImageUrl(item.status)" alt="status" />
        <HashAddrIconItem
            :hash="item?.dc_tx_info?.hash || ''"
            :go-hash-value="item.sc_tx_info.hash"
            :chain="dc_chain"
            :chain-logo-url="dcChainIcon"
            :address="item.dc_addr"
        />
    </div>
</template>

<script setup lang="ts">
    import HashAddrIconItem from './HashAddrIconItem.vue';
    import { useHashAddrIcon } from '../composable';
    const props = defineProps({
        item: {
            type: Object,
            required: true
        }
    });
    const { sc_chain, dc_chain } = toRefs(props.item);

    const { getImageUrl, scChainIcon, dcChainIcon } = useHashAddrIcon(sc_chain, dc_chain);
</script>

<style lang="less" scoped>
    .out_hash {
        .flex(row, nowrap, space-between, center);
    }
    .status_icon {
        width: 24px;
        margin: 0 16px;
    }
    @media screen and (max-width: 600px) {
        .status_icon {
            margin: 7px 0 7px 1px;
            height: auto;
            transform: rotateZ(90deg);
        }
    }
</style>
