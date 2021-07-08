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
    export: `${base.url}/admin/cashin/export`,
  },
  cashout: {
    query: `${base.url}/admin/cashout/queryList`,
    approve: `${base.url}/admin/cashout/approve`,
    totalCount: `${base.url}/admin/cashout/queryTotalAmount`,
    export: `${base.url}/admin/cashout/export`,
  },
  balance:{
    query: `${base.url}/admin/balance/queryList`,
    export: `${base.url}/admin/balance/export`,
  },
  consume:{
    query: `${base.url}/admin/consume/queryList`,
    totalCount: `${base.url}/admin/consume/queryTotalAmount`,
    export: `${base.url}/admin/consume/export`,
  },
  order:{
    query: `${base.url}/admin/order/queryList`,
    totalCount: `${base.url}/admin/order/queryTotalAmount`,
    export: `${base.url}/admin/order/export`,
  },

};



