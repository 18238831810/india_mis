import Vue from 'vue';
import store from '@/store'
/*定义权限控制指令*/
Vue.directive('auth', {
    bind: function (el, binding, vnode) {
        const menus = store.state.menus;
        const value = binding.value;
        var show = "hidden";
        if (value != null && value != ''){
            for (var i in menus){
                if(menus[i].id == value) show = "visible";
            }
        } else show = "visible";
        el.style.visibility = show;
    }
});

