<template>
    <a-button class="type_button" type="primary" :disabled="isDisabled" @click="reset">
        <template #icon>
            <svg
                v-show="props.type === TypeButtonProp.reset"
                t="1669105259056"
                class="icon"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="2961"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                width="16"
                height="18"
            >
                <path
                    d="M929.052444 648.931556a50.119111 50.119111 0 0 0-39.822222-0.113778 53.020444 53.020444 0 0 0-28.216889 29.240889c-57.400889 144.497778-194.332444 237.340444-344.632889 233.699555-150.300444-3.640889-282.908444-103.025778-333.767111-250.140444-50.858667-147.057778-9.386667-311.466667 104.334223-413.752889 113.664-102.229333 276.138667-121.173333 408.860444-47.786667L612.124444 301.624889a34.588444 34.588444 0 0 0-3.754666 34.816c5.12 11.377778 16.042667 18.773333 28.16 19.228444h280.519111c9.329778-0.056889 18.204444-4.323556 24.291555-11.662222 6.030222-7.395556 8.760889-17.066667 7.395556-26.737778L905.671111 28.899556a32.540444 32.540444 0 0 0-22.755555-26.680889 30.947556 30.947556 0 0 0-32.824889 10.524444l-85.731556 104.220445C596.536889 12.8 384.170667 28.103111 231.822222 155.363556 79.473778 282.624 19.285333 494.933333 81.009778 687.729778c61.724444 192.796444 232.220444 325.347556 427.576889 332.344889 195.299556 6.997333 374.215111-113.038222 448.512-300.942223 10.808889-27.477333-1.706667-58.766222-28.046223-70.200888z"
                    p-id="2962"
                    fill="#ffffff"
                ></path>
            </svg>
            <svg
                v-show="props.type === TypeButtonProp.search"
                t="1667830466302"
                class="icon"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="3337"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                width="18"
                height="18"
            >
                <path
                    d="M1002.609778 907.946667l-206.734222-206.791111a438.158222 438.158222 0 0 0 85.560888-260.551112c0-242.915556-197.632-440.490667-440.490666-440.490666C197.973333 0.113778 0.398222 197.688889 0.398222 440.604444c0 242.915556 197.632 440.490667 440.547556 440.490667 97.393778 0 187.505778-31.800889 260.551111-85.560889l206.734222 206.734222a66.56 66.56 0 0 0 94.435556 0c25.998222-26.055111 25.998222-68.266667 0-94.378666zM108.885333 440.547556A332.458667 332.458667 0 0 1 440.888889 108.544a332.458667 332.458667 0 0 1 332.060444 332.060444 332.458667 332.458667 0 0 1-332.060444 332.060445 332.458667 332.458667 0 0 1-332.117333-332.060445z"
                    p-id="3338"
                    fill="#ffffff"
                ></path>
            </svg>
        </template>
    </a-button>
</template>

<script lang="ts" setup>
    import { TypeButtonProp } from '@/constants';
    import { debounce } from 'lodash-es';
    interface IProps {
        type?: 'reset' | 'search';
        isDisabled?: boolean;
    }
    const props = withDefaults(defineProps<IProps>(), {
        type: TypeButtonProp.reset,
        isDisabled: false
    });
    const emits = defineEmits<{
        (e: 'onReset'): void;
    }>();
    const reset = debounce(() => {
        if (props.isDisabled) return;
        emits('onReset');
    }, 300);
</script>

<style lang="less" scoped>
    .type_button {
        .flex(row,nowrap,center,center);
        &[disabled] {
            opacity: 0.8;
            color: #fff;
            border-color: var(--bj-primary-color);
            background: var(--bj-primary-color);
        }
    }
</style>
