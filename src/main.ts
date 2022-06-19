import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './theme/index.less';
import './assets/icon/iconfont'
import './assets/icon/iconfont.css'
// TODO theme 

const app = createApp(App)
app.use(router).mount('#app')
app.use(store)
