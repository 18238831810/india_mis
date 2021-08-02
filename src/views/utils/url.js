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
    sendCashinRebate: `${base.url}/admin/cashin/sendCashinRebate`,
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
    sendMessage: `${base.url}/admin/order/sendMessage`,
    sendProfitMessage: `${base.url}/admin/order/sendProfitMessage`,
  },
  account:{
    query: `${base.url}/admin/account/queryList`,
    updateRecordStatus: `${base.url}/admin/account/updateRecordStatus`,
    updateFee: `${base.url}/admin/account/updateFee`,
  },
  promotionRebate:{
    query: `${base.url}/admin/promotionRebate/queryList`,
    updateSetting: `${base.url}/admin/promotionRebate/updateSetting`,
    rebateQuery: `${base.url}/admin/cashinRebate/queryList`,
    rebateExport: `${base.url}/admin/cashinRebate/export`,
  },
  liveWatch:{
    query: `${base.url}/admin/liveWatchFee/queryList`,
    queryResult: `${base.url}/admin/liveWatchFee/queryResultList`,
  },
  push:{
    order:{
      query:`${base.url}/admin/settingOrder/queryList`,
      update:`${base.url}/admin/settingOrder/update`,
      delete:`${base.url}/admin/settingOrder/delete`,
    }
  }

};



