import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './style.css'

// Import ECharts and Vue-ECharts
import * as echarts from 'echarts'
import VChart from 'vue-echarts'

// Light mode with Petrosea-inspired corporate theme is the default
// Dark mode can be enabled by setting data-theme="dark"

const app = createApp(App)
const pinia = createPinia()

// Register Vue-ECharts component globally
app.component('VChart', VChart)

app.use(pinia)
app.use(router)

app.mount('#app')
