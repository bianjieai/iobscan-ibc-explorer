import { defineStore } from "pinia";
import { ICount } from "./types";

export const useCount = defineStore({
    id: 'count',
    state: (): ICount => {
        return {
            count: 1
        }
    },
    getters: {
        countPow2(state: ICount) {
            return state.count ** 2;
        },
    },
    actions: {
        countPlusOne(temp: number) {
            this.count = temp;
        },
    }
})