import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './theme/index.less';
import './assets/icon/iconfont';
import './assets/icon/iconfont.css';
import './assets/icon/iconfont.js';
import { createPinia } from 'pinia';

const app = createApp(App);
app.use(router).use(createPinia()).mount('#app');
