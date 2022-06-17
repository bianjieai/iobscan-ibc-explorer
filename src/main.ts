import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Antd from 'ant-design-vue'
import './theme/index.less';
// TODO theme 

const app = createApp(App)
app.use(router).mount('#app')
app.use(store)
app.use(Antd)
