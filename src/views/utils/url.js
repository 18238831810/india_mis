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
    totalCount: `${base.url}/admin/cashin/queryTotalAmount`,
  },
  cashout: {
    query: `${base.url}/admin/cashout/queryList`,
    approve: `${base.url}/admin/cashout/approve`,
    totalCount: `${base.url}/admin/cashout/queryTotalAmount`,
  },
  balance:{
    query: `${base.url}/admin/balance/queryList`,
  },
  consume:{
    query: `${base.url}/admin/consume/queryList`,
    totalCount: `${base.url}/admin/consume/queryTotalAmount`,
  },
  order:{
    query: `${base.url}/admin/order/queryList`,
    totalCount: `${base.url}/admin/order/queryTotalAmount`,
  },

};



