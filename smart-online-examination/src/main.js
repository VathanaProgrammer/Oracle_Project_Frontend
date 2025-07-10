import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import VueApexCharts from 'vue3-apexcharts';
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import Toast from "vue-toastification"
import "vue-toastification/dist/index.css"

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const app = createApp(App)
app.use(router)
app.use(pinia)
app.use(Toast)
app.component('apexchart', VueApexCharts);
app.mount('#app')
