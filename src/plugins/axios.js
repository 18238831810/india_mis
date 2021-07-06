"use strict";

import Vue from 'vue';
import axios from "axios";
import store from '@/store'
import router from '@/router'
import StorageUtil from '@/utils/storageUtil'

// Full config:  https://github.com/axios/axios#request-config
// axios.defaults.baseURL = process.env.baseURL || process.env.apiUrl || '';
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

let config = {
    // baseURL: process.env.baseURL || process.env.apiUrl || ""
    // timeout: 60 * 1000, // Timeout
    // withCredentials: true, // Check cross-site Access-Control
};

const _axios = axios.create(config);

_axios.interceptors.request.use(
    function (config) {
        //请求头添加token
        if (store.state.user && store.state.user.tPassWord) config.headers["Authorization"] = store.state.user.tPassWord;
        return config;
    },
    function (error) {
        // Do something with request error
        return Promise.reject(error);
    }
);

// Add a response interceptor
_axios.interceptors.response.use(
     (response) => {
        //用户权限过期
        if (response.status === 200 && response.data.code === 401) {
            //清空用户数据并跳转到登录页面
            store.state.user = {};
            StorageUtil.saveUser({});
            router.push('/login');
        }
        return response.data;
    },
    function (error) {
        // Do something with response error
        return Promise.reject(error);
    }
);

Plugin.install = function (Vue, options) {
    Vue.axios = _axios;
    window.axios = _axios;
    Object.defineProperties(Vue.prototype, {
        axios: {
            get() {
                return _axios;
            }
        },
        $axios: {
            get() {
                return _axios;
            }
        },
    });
};

Vue.use(Plugin)

export default Plugin;
