import Vue from "vue";
import App from "./App";

// BootstrapVue add
import BootstrapVue from "bootstrap-vue";
// Router & Store add
import router from "./router";
import store from "./store";
// Multi Language Add
import en from "./locales/en.json";
import ar from "./locales/ar.json";
import es from "./locales/es.json";
import Vuelidate from 'vuelidate'


import VueI18n from "vue-i18n";
import { firebaseConfig } from "./constants/config";
// Notification Component Add
import Notifications from "./components/Common/Notification";
// Breadcrumb Component Add
import Breadcrumb from "./components/Common/Breadcrumb";
// RefreshButton Component Add
import RefreshButton from "./components/Common/RefreshButton";
// Colxx Component Add
import Colxx from "./components/Common/Colxx";
// Perfect Scrollbar Add
import vuePerfectScrollbar from "vue-perfect-scrollbar";
import contentmenu from "v-contextmenu";
import VueLineClamp from "vue-line-clamp";
import VueScrollTo from "vue-scrollto";
import "firebase/auth";
import { getCurrentLanguage } from "./utils";
import auction from "./plugins/services/auction";
import './registerServiceWorker';
// date picker

Vue.use(BootstrapVue);
Vue.use(VueI18n);
const messages = { en: en, ar: ar, es: es };
const locale = getCurrentLanguage();
const i18n = new VueI18n({
  locale: locale,
  fallbackLocale: "en",
  messages
});
Vue.use(Notifications);
Vue.use(require("vue-shortkey"));
Vue.use(contentmenu);
Vue.use(Vuelidate)
Vue.use(VueScrollTo);
Vue.use(VueLineClamp, {
  importCss: true
});
// Vue.use(auction)
Vue.component("piaf-breadcrumb", Breadcrumb);
Vue.component("b-refresh-button", RefreshButton);
Vue.component("b-colxx", Colxx);
Vue.component("vue-perfect-scrollbar", vuePerfectScrollbar);

Vue.config.productionTip = false;

export default new Vue({
  i18n,
  router,
  store,
  render: h => h(App)
}).$mount("#app");
