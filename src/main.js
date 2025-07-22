import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './style.css'
import Layout from './components/Layout.vue'
import MdiIcon from './components/MdiIcon.vue'

// Import ECharts and Vue-ECharts
import * as echarts from 'echarts'
import VChart from 'vue-echarts'

// axios
import axios from 'axios'
import VueAxios from 'vue-axios'

// Light mode with Petrosea-inspired corporate theme is the default
// Dark mode can be enabled by setting data-theme="dark"

const app = createApp(App)
const pinia = createPinia()

// Register common component globally
app.component('VChart', VChart)
app.component('Layout', Layout)
app.component('MdiIcon', MdiIcon)

// pinia store and router
app.use(pinia)
app.use(router)

// axios setup

//-- prepare axios setting and loading it into vue
const api_url = import.meta.env.VITE_API_URL
const apiAxios = axios.create({
    baseURL: api_url
})

apiAxios.interceptors.request.use(function (cfg) {
    const auth = authStore()
    if (auth.appToken != '') cfg.headers.common['Authorization'] = 'Bearer ' + auth.appToken
    return cfg
})
apiAxios.interceptors.response.use(r => {
    if (r.data && r.data.error) {
        const errorMessage = r.data.error

        if (errorMessage == "EOF") {
            return Promise.reject("Data not found")
        } else if (errorMessage.indexOf("invalid access token") > 0 || errorMessage.indexOf("invalid token") > 0) {
            auth.clear()
        }
        return Promise.reject(errorMessage)
    }
    return Promise.resolve(r)
}, e => {
    return Promise.reject(e)
})
app.use(VueAxios, axios)
app.provide('axios', apiAxios)

app.mount('#app')
