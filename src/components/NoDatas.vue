<template>
    <div class="nodatas">
        <img class="nodatas__icon" :src="imgUrl" />
        <p class="nodatas__title">{{ displayText }}</p>
    </div>
</template>

<script setup lang="ts">
    import { NoDataType } from '@/constants';
    import { API_ERRPR_MESSAGE } from '@/constants/apiCode';
    import noDataImg from '@/assets/no_datas.png';
    interface IProps {
        text?: string;
        type?: NoDataType;
    }
    const props = withDefaults(defineProps<IProps>(), {
        type: NoDataType.noData
    });
    const imgUrl = computed(() => {
        switch (props.type) {
            case NoDataType.noData:
                return noDataImg;
            case NoDataType.loadFailed:
                // todo dj UI loading failed 图片待替换
                return noDataImg;
        }
    });
    const displayText = computed(() => {
        if (props.text !== undefined) {
            return props.text;
        }
        switch (props.type) {
            case NoDataType.noData:
                return API_ERRPR_MESSAGE.noData;
            case NoDataType.loadFailed:
                return API_ERRPR_MESSAGE.loadFailed;
        }
    });
</script>

<style lang="less" scoped>
    .nodatas {
        .flex(column, nowrap, center, center);
        margin: 30px 0 20px;
        &__icon {
            width: 120px;
        }
        &__title {
            margin-top: 16px;
            font-size: var(--bj-font-size-normal);
            font-weight: 400;
            color: var(--bj-font-color-65);
        }
    }
</style>
