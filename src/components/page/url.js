/**
 * 接口地址的统一管理
 */
const base = {
  url: process.env.VUE_APP_BASE_API,
};
export default {
//上传图片
  img:{
    upload:`${base.url}/cloud/file/uploadImage`,
  }
};


