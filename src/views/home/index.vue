<template>
    <div class="home">
        <layer-block class="home_top" title="Chains" type="dark">
            <div class="home_top_slot">
                <div class="home_top_left">
                    <card :msg="ibcStatisticsChains.chains_24hr" @click="onClickViewAll('chains')" />
                    <card :msg="ibcStatisticsChains.chain_all" style="margin-top: 18px;"
                        @click="onClickViewAll('chains')" />
                </div>
                <div class="home_top_right">
                    <card-list :chainList="ibcChains.value" @onMenuSelected="onMenuSelected"
                        @clickItem="onClickViewAll" />
                </div>
            </div>
        </layer-block>
    </div>
</template>

<script setup lang="ts">
import { message } from 'ant-design-vue';
import LayerBlock from '../../components/LayerBlock.vue';
import Card from '../../components/Card.vue';
import { useIbcStatisticsChains } from '../../store/home/index';
import { useRouter } from 'vue-router';
import { computed } from 'vue';

const router = useRouter();
const ibcStatisticsChainsStore = useIbcStatisticsChains();
let ibcStatisticsChains = ibcStatisticsChainsStore.ibcStatisticsChains;
const ibcChains = computed(() => ibcStatisticsChainsStore.ibcChains)?.value;

const onClickViewAll = (msg: string) => {
    if (msg?.includes && msg.includes('chains')) {
        router.push({
            name: 'Chains'
        })
    } else if (msg?.includes && msg.includes('channel')) {
        router.push({
            name: 'Channels'
        })
    } else if (msg?.includes && msg.includes('tx')) {
        if (msg === 'tx_all') {
            router.push({
                name: 'Transfers',
                query: {
                    status: '1,2,3,4'
                }
            });
        } else if (msg === 'tx_24hr_all') {
            router.push({
                name: 'Transfers',
                query: {
                    status: '1,2,3,4'
                }
            });
        } else if (msg === 'tx_success') {
            router.push({
                name: 'Transfers',
                query: {
                    status: '1'
                }
            });
        } else if (msg === 'tx_failed') {
            router.push({
                name: 'Transfers',
                query: {
                    status: '2,4'
                }
            });
        }
    } else if (msg?.includes && msg.includes('denom')) {
        router.push({
            name: 'Tokens',
        });
    } else {
        // TODO shan 路由中不包含以上路由的提示

        // message.info({
        //     content: h(Message),
        //     icon: h('div'),
        // });
    }
}
const onMenuSelected = (menuKey: number) => {
    // console.log(menuKey);
    // ibcChainsFilter
};

</script>

<style lang="less">
.home {
    box-sizing: border-box;
    padding: 48px 32px 102px 32px;
    width: 100%;

    &_top {
        width: 100%;

        &_slot {
            .flex(row, nowrap, space-between, center);
            box-sizing: border-box;
            padding: 24px;
            width: 100%;
            max-width: 1200px;
        }
    }
}
</style>