<template>
    <InfoCard icon="icon-a-baseinfo" title="Base Info">
        <loading-component
            v-show="baseInfoLoading"
            class="base_info_loading"
            :type="LoadingType.container"
        />
        <div v-show="!baseInfoLoading" class="base_info flex">
            <div class="base_info__left">
                <div class="base_info__qrcode_wrap flex justify-center items-center">
                    <div ref="qrCodeDom" class="base_info__qrcode"></div>
                </div>
                <div class="base_info__chain_wrap">
                    <div class="base_info__chain flex justify-center items-center">
                        <img
                            class="base_info__chain_icon"
                            :src="currentChainInfo.chainLogo"
                            alt=""
                        />
                        <a-popover v-if="isShowTooltip" destroy-tooltip-on-hide>
                            <template #content>
                                <span>{{ currentChainInfo.prettyName }}</span>
                            </template>
                            <span class="base_info__chain_name cursor">{{
                                currentChainInfo.prettyName
                            }}</span>
                        </a-popover>
                        <span v-else class="base_info__chain_name">{{
                            currentChainInfo.prettyName
                        }}</span>
                    </div>
                    <img
                        class="base_info__chain_icon_bg"
                        :src="currentChainInfo.chainLogo"
                        alt=""
                    />
                </div>
            </div>
            <div class="base_info__right">
                <div class="base_info__label_value flex">
                    <span class="base_info__label">Address</span>
                    <span class="base_info__value">
                        <span>{{ baseInfo.address }}</span>
                        <CopyComponent
                            v-if="baseInfo.address !== DEFAULT_DISPLAY_TEXT"
                            :copy-text="baseInfo.address"
                        ></CopyComponent>
                    </span>
                </div>
                <div class="base_info__label_value flex">
                    <span class="base_info__label">Total Value</span>
                    <span class="base_info__value">{{ totalValue }}</span>
                </div>
                <div class="base_info__label_value flex">
                    <span class="base_info__label">Key Algorithm</span>
                    <span class="base_info__value">{{ baseInfo.keyAlgorithm }}</span>
                </div>
                <div class="base_info__label_value flex">
                    <span class="base_info__label">Account Sequence</span>
                    <span class="base_info__value">{{ baseInfo.accountSequence }}</span>
                </div>
                <div class="base_info__label_value flex">
                    <span class="base_info__label">Pub Key</span>
                    <span class="base_info__value">{{ baseInfo.pubKey }}</span>
                </div>
            </div>
        </div>
    </InfoCard>
</template>

<script setup lang="ts">
    import type { IAddressBaseInfo, IAddressChainInfo } from '@/types/interface/address.interface';
    import { DEFAULT_DISPLAY_TEXT, LoadingType } from '@/constants';
    import { useCreateQRCode } from '../composable';

    interface IBaseInfo {
        baseInfoLoading: boolean;
        baseInfo: IAddressBaseInfo;
        currentChainInfo: IAddressChainInfo;
        isShowTooltip: boolean;
        totalValue: string;
    }
    defineProps<IBaseInfo>();
    const { qrCodeDom } = useCreateQRCode();
</script>

<style lang="less" scoped>
    .base_info_loading {
        min-height: 180px;
    }
    .base_info {
        &__left {
            width: 180px;
            text-align: center;
        }
        &__qrcode_wrap {
            width: 100%;
            height: 120px;
            background: #f5f7fc;
            border: 1px solid #eaeaea;
            border-radius: 4px 4px 0 0;
        }
        &__qrcode {
            padding: 8px;
            width: 96px;
            height: 96px;
            background: #fff;
        }
        &__chain_wrap {
            position: relative;
            padding: 8px 0;
            width: 100%;
            border: 1px solid #eaeaea;
            border-top: 0;
            border-radius: 0 0 4px 4px;
            overflow: hidden;
        }
        &__chain {
        }
        &__chain_icon {
            width: 32px;
            height: 32px;
        }
        &__chain_name {
            margin-left: 8px;
            max-width: 120px;
            font-size: var(--bj-font-size-sub-title);
            font-family: GolosUI_Medium;
            color: #000000;
            line-height: 18px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        &__chain_icon_bg {
            position: absolute;
            // todo shan 需要跟 UI 确认透明度及位置
            top: 0px;
            right: -16px;
            width: 80px;
            height: 80px;
            opacity: 0.2;
        }
        &__right {
            flex: 1;
            margin-left: 52px;
        }
        &__label_value {
            margin-top: 16px;
            line-height: 18px;
            &:first-child {
                margin-top: 0;
            }
        }
        &__label {
            width: 128px;
            font-size: var(--bj-font-size-normal);
            font-family: GolosUI_Medium;
            font-weight: 500;
            color: var(--bj-text-normal);
            white-space: nowrap;
        }
        &__value {
            flex: 1;
            margin-left: 24px;
            width: 100%;
            font-size: var(--bj-font-size-normal);
            color: var(--bj-text-second);
            word-break: break-all;
        }
    }
    @media screen and (max-width: 930px) {
        .base_info {
            &__left {
            }
            &__qrcode_wrap {
            }
            &__qrcode {
            }
            &__chain_wrap {
            }
            &__chain {
            }
            &__chain_icon {
            }
            &__chain_name {
            }
            &__chain_icon_bg {
            }
            &__right {
                margin-left: 24px;
            }
            &__label_value {
            }
            &__label {
            }
            &__value {
            }
        }
    }
    @media screen and (max-width: 895px) {
        .base_info {
            &__left {
                width: 146px;
            }
            &__qrcode_wrap {
            }
            &__qrcode {
            }
            &__chain_wrap {
            }
            &__chain {
            }
            &__chain_icon {
            }
            &__chain_name {
            }
            &__chain_icon_bg {
                top: 8px;
                right: 8px;
            }
            &__right {
            }
            &__label_value {
            }
            &__label {
            }
            &__value {
            }
        }
    }
    @media screen and (max-width: 640px) {
        .base_info {
            flex-direction: column;
            &__left {
                width: 100%;
            }
            &__qrcode_wrap {
            }
            &__qrcode {
            }
            &__chain_wrap {
            }
            &__chain {
            }
            &__chain_icon {
            }
            &__chain_name {
            }
            &__chain_icon_bg {
            }
            &__right {
                margin-top: 16px;
                margin-left: 0;
            }
            &__label_value {
            }
            &__label {
            }
            &__value {
            }
        }
    }
    @media screen and (max-width: 500px) {
        .base_info {
            &__left {
            }
            &__qrcode_wrap {
            }
            &__qrcode {
            }
            &__chain_wrap {
            }
            &__chain {
            }
            &__chain_icon {
            }
            &__chain_name {
            }
            &__chain_icon_bg {
            }
            &__right {
                margin-top: 16px;
                margin-left: 0;
            }
            &__label_value {
                flex-direction: column;
            }
            &__label {
                width: 100%;
            }
            &__value {
                margin-top: 2px;
                margin-left: 0;
            }
        }
    }
</style>
