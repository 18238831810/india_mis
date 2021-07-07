/**
 * 接口地址的统一管理
 */
const base = {
  url: process.env.VUE_APP_URL,
};
export default {
  //白名单查询
  cashin: {
    query: `${base.url}/admin/cashin/queryList`,
  },
  cashout: {
    query: `${base.url}/admin/cashout/queryList`,
    approve: `${base.url}/admin/cashout/approve`,
  },
  balance:{
    query: `${base.url}/admin/balance/queryList`,
  },
  consume:{
    query: `${base.url}/admin/consume/queryList`,
  },

};



