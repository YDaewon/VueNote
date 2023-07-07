import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
Vue.use(BootstrapVue)
Vue.prototype.$http = axios
Vue.config.productionTip = false
import { store } from './store/store.js'
window.Kakao.init('cd48461159e1d8ac85c6bb9ada37d0a7');
new Vue({
  store,
  render: h => h(App),
}).$mount('#app')
