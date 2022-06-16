import { createPinia } from "pinia";
import { useCount } from "./modules/count";

const pinia = createPinia()

export default pinia

export {
    useCount
}