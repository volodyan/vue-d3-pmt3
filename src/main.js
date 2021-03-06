import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import './plugins/wyz-echarts/wyz-echarts.js'
import i18n from './i18n'
import './plugins/svgIcon.js'
import '@/assets/icons'
import moment from "moment";
Vue.prototype.$moment = moment;
import * as d3 from "d3";
Vue.prototype.$d3 = d3;
window.d3 = d3;
import Utils from './utils/utils'
Vue.prototype.$Utils = Utils
import vuescroll from "vuescroll";
import VueAMap from 'vue-amap';
Vue.use(VueAMap);
VueAMap.initAMapApiLoader({
    key: 'b6893f078a0becb6e6df47a5311c9bab',
    plugin: ['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor'],
    // 默认高德 sdk 版本为 1.4.4
    v: '1.4.4'
});
//动画插件

import VAnimateCss from 'v-animate-css';

Vue.use(VAnimateCss);
import Vuebar from 'vuebar'
Vue.use(Vuebar)
    //获取配置文件信息config
import configMethods from './config/config.js'
configMethods.GetConfig() //基础url接口初始化调用
configMethods.GetbaseMapPath() //地图url接口初始化调用


import './mockserver/mockserver'

import vueEsign from 'vue-esign'
Vue.use(vueEsign)

Vue.use(vuescroll, {
    ops: {
        vuescroll: {
            mode: "native",
            sizeStrategy: "number",
            detectResize: true,
        },
        scrollPanel: {
            initialScrollY: false,
            initialScrollX: false,
            scrollingX: true,
            scrollingY: true,
            speed: 300,
            easing: "easeInOutQuint",
            verticalNativeBarPos: "right",
            maxHeight: undefined,
            maxWidth: undefined,
        },
        rail: {
            background: "#2C2F3A",
            opacity: 0,
            size: "6px",
            specifyBorderRadius: false,
            gutterOfEnds: null,
            gutterOfSide: "2px",
            keepShow: false,
        },
        bar: {
            showDelay: 500,
            onlyShowBarOnScroll: false,
            keepShow: true,
            background: "#A2A1A6",
            opacity: 1,
            hoverStyle: false,
            specifyBorderRadius: false,
            minSize: false,
            size: "4px",
            disable: false,
        },
    }, // 在这里设置全局默认配置
});

Vue.config.productionTip = false



new Vue({
    router,
    store,
    i18n,
    render: h => h(App)
}).$mount('#app')