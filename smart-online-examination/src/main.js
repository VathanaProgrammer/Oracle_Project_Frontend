import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import VueApexCharts from 'vue3-apexcharts';
import { createPinia } from 'pinia'
const pinia = createPinia()

const app = createApp(App)
app.use(router)
app.use(pinia)
app.component('apexchart', VueApexCharts);
app.mount('#app')
