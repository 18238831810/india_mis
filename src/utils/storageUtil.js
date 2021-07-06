/*
向local中存储数据的工具模块
1. 向外暴露一个函数(功能)
   只有一个功能需要暴露
2. 向外暴露一个对象(包含多个功能)
   有多个功能需要暴露
 */
const TODOS_KEY = 'user';
const MENUS = 'menus';
export default {
  readUser () {
    return JSON.parse(localStorage.getItem(TODOS_KEY) || '{}')
  },
  saveUser (user) {
    localStorage.setItem(TODOS_KEY, JSON.stringify(user))
  },
  readMenus(){
    return JSON.parse(localStorage.getItem(MENUS) || '[]')
  },
  saveMenus(menus){
    localStorage.setItem(MENUS, JSON.stringify(menus))
  }
}

