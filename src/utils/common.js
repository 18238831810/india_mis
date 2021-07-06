
//次方法封装一些常用的函数，方便页面直接调用
const util = {
  //深度拷贝方法
  copy:(obj)=> {
    if (obj == null) {
      return null
    }
    let result = Array.isArray(obj) ? [] : {};
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (typeof obj[key] === 'object') {
          result[key] = util.copy(obj[key]); // 如果是对象，再次调用该方法自身
        } else {
          result[key] = obj[key];
        }
      }
    }
    return result;
  },


};

export default {
  install(Vue, options) {
    Vue.prototype.common = util;
  }
}

