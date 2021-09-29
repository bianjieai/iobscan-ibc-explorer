import { createApp } from 'vue';
import {
  Layout,
  Menu,
  Row,
  Col,
  Button,
  Input,
  List,
  Card,
  Anchor,
  Divider,
  message,
} from 'ant-design-vue';
import router from './router';
import store from './store';
import App from './App.vue';

message.config({
  maxCount: 1,
  top: '100px',
  duration: 3,
});

createApp(App)
  .use(store)
  .use(router)
  .use(Layout)
  .use(Row)
  .use(Col)
  .use(Menu)
  .use(List)
  .use(Card)
  .use(Anchor)
  .use(Divider)
  .use(Button)
  .use(message)
  .use(Input)
  .mount('#app');
