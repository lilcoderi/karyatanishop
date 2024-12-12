import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import $ from 'jquery';
window.$ = $;
window.jQuery = $;

import './assets/vendor/bootstrap/js/bootstrap.bundle.min.js'
import './assets/js/sb-admin-2.js'
import './assets/vendor/jquery/jquery.min.js'
import './assets/vendor/jquery-easing/jquery.easing.min.js'
import './assets/vendor/datatables/jquery.dataTables.min.js'
import './assets/vendor/datatables/dataTables.bootstrap4.min.js'
import './assets/js/demo/datatables-demo.js'
import "datatables.net";
import "datatables.net-bs4"; // Bootstrap 4 styling
import './assets/vendor/datatables/dataTables.bootstrap4.min.css'
import './assets/css/sb-admin-2.min.css'
import './assets/scss/sb-admin-2.scss'
import 'bootstrap-icons/font/bootstrap-icons.css';


createApp(App).use(store).use(router).mount('#app')
