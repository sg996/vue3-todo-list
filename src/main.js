import { createApp } from 'vue';
import App from './App.vue';
import store from './store';
import 'element-plus/theme-chalk/dark/css-vars.css';
import './assets/dark.css';
import 'element-plus/theme-chalk/el-message-box.css';
import 'element-plus/theme-chalk/el-message.css';

createApp(App).use(store).mount('#app');
