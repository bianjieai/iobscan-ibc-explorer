<template>
    <div class="statistic__list">
        <!-- vertical -->
        <div v-if="type === 'vertical'" class="vertical__container">
            <div
                class="list__item ibc__selected__title"
                style="width: 100%"
                v-for="(item, name, index) of msg"
                :key="item.statistics_name"
                @click="clickListItem(item.statistics_name)"
            >
       <span class="list__item__name"
       >{{
               statisticsName[item.statistics_name]
           }}<span v-if="item.statistics_name.indexOf('24') !== -1" class="list__item__tip"
           >24hr</span
           ></span
       >
                <span class="list__item__value">{{ item.count }}</span>
                <a-divider class="list__item__divider" v-show="index < Object.keys(msg).length - 1"/>
            </div>
        </div>

        <!-- horizontal -->
        <div v-if="type === 'horizontal'" class="horizontal__container">
            <div
                class="list__item__horizontal ibc__selected__title"
                v-for="(item, name, index) of msg"
                :key="item.statistics_name"
                @click="clickListItem(item.statistics_name)"
            >
                <div class="list__item">
          <span class="list__item__name"
          >{{
                  statisticsName[item.statistics_name]
              }}<span v-if="item.statistics_name.indexOf('24') !== -1" class="list__item__tip"
              >24hr</span
              ></span
          >
                    <span class="list__item__value">{{ item.count }}</span>
                </div>
                <a-divider
                    class="list__item__divider__vertical"
                    type="vertical"
                    v-show="index < Object.keys(msg).length - 1"
                />
            </div>
        </div>
    </div>
</template>

<script>
import {statisticsName} from '../constant';

export default {
    props: {
        type: String,
        msg: Object,
    },
    setup(props, context) {
        const clickListItem = (value) => {
            context.emit('clickItem', value);
        };
        return {
            statisticsName,
            clickListItem,
        };
    },
};
</script>

<style lang="scss" scoped>
@import "../style/mixin.scss";
@import "../style/variable.scss";

.statistic__list {
    padding: 24px 0 24px 24px;
    width: 100%;
}

.vertical__container {
    @include flex(column, nowrap, flex-start, flex-start);
}

.horizontal__container {
    @include flex(row, nowrap, flex-start, flex-start);
}

.list__item {
    @include flex(column, nowrap, flex-start, flex-start);

    &__horizontal {
        width: 25%;
        @include flex(row, nowrap, space-between, flex-start);
    }

    &__name {
        font-size: $font-size4;
        font-family: Montserrat-Regular, Montserrat;
        color: $font-color2;
        line-height: $font-size4;
        margin-bottom: 16px;
    }

    &__value {
        transition: color 0.3s;
        transition-timing-function: ease;
        font-size: $font-size2;
        font-family: Montserrat-Regular, Montserrat;
        color: $font-color1;
        line-height: $font-size2;
    }

    &__tip {
        margin-left: 8px;
        padding: 0 4px;
        font-size: $font-size6;
        font-family: Montserrat-Regular, Montserrat;
        color: #3d50ff;
        line-height: $font-size6;
        background: rgba(61, 80, 255, 0.15);
        border-radius: 7px;
    }

    &__divider {
        width: 226px;
    }

    &__divider__vertical {
        height: 56px;
        margin-right: 24px;
    }
}
</style>
