import './assets/main.css'
// eslint-disable-next-line no-unused-vars
import * as bootstrap from 'bootstrap'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
