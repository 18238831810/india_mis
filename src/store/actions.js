/*
包含n个用于间接更新状态的方法的对象模块
 */
import storageUtil from '@/utils/storageUtil'
export default {

  setMenus ({commit}, menus) {
    // 提交一个comutation请求
    commit("SETMEANS", {menus}) // 传递给mutation的是一个包含数据的对象
  },
  setUser ({commit}, user) {
    // 提交一个comutation请求
    storageUtil.saveUser(user);
    commit("SETUSER", {user}) // 传递给mutation的是一个包含数据的对象
  },
}
