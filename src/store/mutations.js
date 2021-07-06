/*
包含n个用于直接更新状态的方法的对象模块
 */
export default {
    SETMEANS(state, {menus}) {
        state.menus = [];
        state.menus = menus;
    },
    SETUSER(state, {user}) {
        state.user = {};
        state.user = user;
    }
}
