<template>
    <div class="hash_addr_icon">
        <div
            class="hash_addr_icon__address_link cursor"
            @click="goTransfersDetails(goHashValue)"
            @mouseover="changeHover(true)"
            @mouseleave="changeHover(false)"
        >
            <img class="hash_addr_icon__address_icon" :src="chainLogoUrl" />
        </div>
        <div class="hash_addr_icon__container">
            <span
                class="hash_addr_icon__value hash_addr_icon__hover cursor"
                @click="goTransfersDetails(goHashValue)"
            >
                <img class="hash_addr_icon__icon" src="../../../assets/home/tx.png" alt="icon" />
                <a-popover v-if="hash" destroy-tooltip-on-hide>
                    <template #content>
                        <div>
                            <p class="popover_c">{{ hash }}</p>
                        </div>
                    </template>
                    <span class="hover" :class="{ primary_color: isHover }">{{
                        getRestString(hash, 6, 5)
                    }}</span>
                </a-popover>
                <span v-else :class="{ primary_color: isHover }">--</span>
            </span>
            <span
                class="hash_addr_icon__value"
                :class="{
                    cursor: isAddressCursor,
                    hash_addr_icon__hover: isAddressCursor
                }"
                style="margin-top: 14px"
                @click="goAddressDetails(address)"
            >
                <img
                    class="hash_addr_icon__icon"
                    src="../../../assets/home/address.png"
                    alt="icon"
                />
                <a-popover destroy-tooltip-on-hide>
                    <template #content>
                        <div>
                            <p class="popover_c">{{ address }}</p>
                        </div>
                    </template>
                    <span>{{ getRestString(address, 6, 6) || '--' }}</span>
                </a-popover>
            </span>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { getRestString } from '@/helper/parseStringHelper';
    import { useGoAddressDetail, useGoTransfersDetail } from '@/composables';
    export interface IProps {
        hash: string;
        goHashValue: string;
        address: string;
        chainLogoUrl: string;
    }
    const props = defineProps<IProps>();
    const { goTransfersDetails } = useGoTransfersDetail();
    const { goAddressDetails, judgeIsAddressCursor } = useGoAddressDetail();
    const isHover = ref(false);
    const changeHover = (flag: boolean) => {
        isHover.value = flag;
    };
    const isAddressCursor = computed(() => {
        return judgeIsAddressCursor(props.address);
    });
</script>

<style lang="less">
    .hash_addr_icon {
        .flex(row, nowrap);
        &__address_link {
            padding: 0 10px 0 0;
            width: 100%;
            height: 44.33px;
            .flex(row, nowrap,center,center);
        }
        &__address_icon {
            width: 24px;
            height: 24px;
            border-radius: 50%;
        }
        &__container {
            .flex(column, nowrap, flex-start, flex-start);
            &:hover {
                color: var(--bj-primary-color);
            }
        }
        &__value {
            .flex(row, nowrap, flex-start, center);
            width: 100%;
            min-width: 145px;
            font-size: var(--bj-font-size-normal);
            font-weight: 400;
            color: var(--bj-font-color-65);
            line-height: var(--bj-font-size-normal);
        }
        &__hover {
            &:hover {
                color: var(--bj-primary-color);
            }
        }
        &__icon {
            width: 14px;
            margin-right: 10px;
        }
    }
</style>
