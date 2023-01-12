<template>
    <div class="type_button" :class="{ type_button_disabled: isDisabled }" @click="reset">
        <i class="iconfont" :class="resetorSearchIcon"></i>
    </div>
</template>

<script lang="ts" setup>
    import { TypeButtonProp } from '@/constants';
    import { debounce } from 'lodash-es';
    interface IProps {
        type?: TypeButtonProp.reset | TypeButtonProp.search;
        isDisabled?: boolean;
    }
    const props = withDefaults(defineProps<IProps>(), {
        type: TypeButtonProp.reset,
        isDisabled: false
    });
    const emits = defineEmits<{
        (e: 'onReset'): void;
    }>();
    const resetorSearchIcon = computed(() => {
        if (props.type === TypeButtonProp.reset) {
            return 'icon-reset1';
        } else if (props.type === TypeButtonProp.search) {
            return 'icon-icon_search';
        } else {
            return '';
        }
    });
    const reset = debounce(() => {
        if (props.isDisabled) return;
        emits('onReset');
    }, 300);
</script>

<style lang="less" scoped>
    .type_button {
        .flex(row,nowrap,center,center);
        width: 32px;
        height: 32px;
        color: #fff;
        background: var(--bj-primary-color);
        border-radius: 4px;
        cursor: pointer;
        .iconfont {
            font-size: 18px;
        }
        &:hover {
            background: #667aff;
            border-color: #667aff;
        }
    }
    .type_button_disabled {
        background: #9ba5fc;
        border: none;
        cursor: url(../../assets/forbidden.png), not-allowed !important;
        &:hover {
            background: #9ba5fc;
            border-color: #9ba5fc;
        }
    }
</style>
