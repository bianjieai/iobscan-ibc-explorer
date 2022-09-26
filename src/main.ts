import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './theme/index.less';
import './assets/icon/iconfont';
import './assets/icon/iconfont.css';
import { createPinia } from 'pinia';
// todo replace
// import { injectGtag } from '@/utils/injectGtag';
// injectGtag();

const app = createApp(App);
app.use(router).use(createPinia()).mount('#app');
