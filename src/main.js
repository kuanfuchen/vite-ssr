import {createSSRApp} from 'vue';
import App from './App.vue';
export function createApp(){
  const app = createSSRApp(App);
  return { app }
}
// import { createApp } from 'vue'
// import App from './App.vue'
// import router from './router'

// createApp(App).use(router).mount('#app')

