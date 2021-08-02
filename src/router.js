import Vue from 'vue'
import Router from 'vue-router'
import store from './store'

Vue.use(Router);

const router = new Router({
    mode: 'history',
    base: process.env.VUE_APP_TITLE,
    routes: [
        {
            path: '/',
            redirect: '/login'
        },
        {
            path: '/login',
            component: () => import('./views/Login.vue'),
        },
        {
            path: '/home',
            component: () => import('./views/Home.vue'),
            children: [
                {
                    path: 'user/index',
                    component: () => import('./views/user/index.vue')
                },
                {
                    path: 'role/index',
                    component: () => import('./views/role/index.vue')
                },
                {
                    path: 'role/edit',
                    component: () => import('./views/role/edit.vue')
                },
                {
                    path: 'valid/index',
                    component: () => import('./views/valid/index.vue')
                },
                {
                    path: 'userTracker/index',
                    component: () => import('./views/userTracker/index.vue')
                },
                {
                    path: 'whitelist/index',
                    component: () => import('./views/whitelist/index.vue')
                },
                {
                    path: 'cashin/list',
                    component: () => import('./views/cashin/list.vue')
                },
                {
                    path: 'cashout/list',
                    component: () => import('./views/cashout/list.vue')
                },
                {
                    path: 'balance/account',
                    component: () => import('./views/balance/account.vue')
                },
                {
                    path: 'balance/anchor',
                    component: () => import('./views/balance/anchor.vue')
                },
                {
                    path: 'consume/list',
                    component: () => import('./views/consume/list.vue')
                },
                {
                    path: 'order/list',
                    component: () => import('./views/order/list.vue')
                },
                {
                    path: 'account/anchorList',
                    component: () => import('./views/account/anchorList.vue')
                },
                {
                    path: 'account/accountList',
                    component: () => import('./views/account/accountList.vue')
                },
                {
                    path: 'promotionRebate/setting',
                    component: () => import('./views/promotionRebate/setting.vue')
                },
                {
                    path: 'cashinRebate/list',
                    component: () => import('./views/promotionRebate/list.vue')
                },
                {
                    path: 'liveWatch/list',
                    component: () => import('./views/liveWatch/list.vue')
                },
                {
                    path: 'liveWatch/result',
                    component: () => import('./views/liveWatch/result.vue')
                },
                {
                    path: 'push/order',
                    component: () => import('./views/push/order.vue')
                },
            ]
        },
    ]
});
router.beforeEach((to, from, next) => {
    console.log(store.state.user,to.fullPath);
    //访问主页但未登录
    if (to.fullPath.startsWith("/home") && store.state.user.tPassWord == null) next({path: '/login'});
    //访问登录页但已登录过
    else if (to.fullPath.startsWith("/login") && store.state.user.tPassWord != null) next({path: '/home'});
    else next();
});
export default router
