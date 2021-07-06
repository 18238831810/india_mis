import Vue from 'vue'
import './plugins/axios'
/*定义权限控制指令*/
import './plugins/vueAuth'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import Qs from 'qs'
import VueI18n from 'vue-i18n'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import common from '@/utils/common'

Vue.use(common);
Vue.use(VueI18n);

import en from "element-ui/lib/locale/lang/en";
import vn from "element-ui/lib/locale/lang/vi";
import cn from "element-ui/lib/locale/lang/zh-CN";

Vue.config.productionTip = false;
Vue.prototype.$qs = Qs;


const i18n = new VueI18n({

  locale: 'zh_CN', // 语言标识
  //this.$i18n.locale // 通过切换locale的值来实现语言切换
  messages: {
    'zh_CN': Object.assign(require("../src/assets/lang/lang-cn"), cn), // 中文语言包
    'en_US': Object.assign(require("../src/assets/lang/lang-en"), en), // 英文语言包
    'vi_VN': Object.assign(require("../src/assets/lang/lang-vn"), vn), // 越南语言包
  }
});


Vue.use(ElementUI, {
  i18n: (path, options)=> {
    let value = i18n.t(path, options);
    if (value !== null && value !== undefined) return value;
    return '';
  }
});
//window.$t('my.temp') 封装国际化函数，方便在js中和this不生效时使用
window.$t = (key, value) =>i18n.t(key, value);
Vue.config.productionTip = false

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app');
