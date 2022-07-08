import { onBeforeMount,onMounted, onBeforeUnmount } from 'vue';
import { ageTimerInterval } from '@/constants';
export const useTimeInterval = (intervalCallBack: Function, interval = ageTimerInterval) => {
    let timer:number|null = null;
    intervalCallBack();
    onMounted(()=>{
        if(!timer){
            timer = setInterval(intervalCallBack, interval);
        }
    });
    onBeforeUnmount(()=>{
        if (timer) {
            clearInterval(timer);
        }
    },);
    return timer;
}