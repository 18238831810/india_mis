<template>
  <div class="wrapper">
    <FORM  ref="childForm"  @formclick="formclick" :formData="formData"></FORM>
    <table-page ref="childTable"  :pageData="pageData"></table-page>
  </div>
</template>

<script>
    //table封装组件
    import tablePage from '@/components/page/table.vue'
    import FORM from '@/components/page/form.vue'
    import UPDATE from '@/components/page/update.vue'
    import URL from '@/views/utils/url'
    import DateUtil from '@/utils/dataTimeUtil.js'
    let paymentIdList = {1:"UPI"};
    let statusList = {0:"未完成",1:"失败",2:"成功"};
    export default {
        name: 'list',
        components: {
            tablePage,
            FORM,
            UPDATE
        },
        methods: {
            /*查询表单按钮点击事件*/
            formclick(clickName, data){
                if("查询" == clickName || window.$t('txmis.bt.search') == clickName){
                    this.queryData = data;
                    this.$refs.childTable.defaultQueryData(data);
                }else if(window.$t('txmis.bt.add') == clickName){
                    this.$refs.childUpdate.open();
                }
            },
        },
        data () {
            return {
                queryData:{},
                /*from查询表单*/
                formData:{
                  hasLable: true,
                  cols:[
                    {click:"查询"},
                  ]
                },
                /*table生成*/
                pageData: {
                    queryUrl: URL.cashin.query, //请求路径和参数
                    cols: [
                        { title: "用户账号", field: 'uid'},
                        { title: "支付类型", field: 'paymentId',render:(data,full)=>{
                            return paymentIdList[data];
                          }},
                        { title: "订单号", field: 'orderSn'},
                        { title: "支付平台订单号", field: 'ptOrderSn'},
                        { title: "订单金额", field: 'amount'},
                        { title: "实际存款金额", field: 'realAmount'},
                        { title: "支付方UPI", field: 'payerAccount'},
                        { title: "商品信息", field: 'goodsInfo'},
                        { title: "客户端ip", field: 'ip'},
                        { title: "订单时间", field: 'orderTime',render:(data,full)=>{
                            return DateUtil.formatDate(data,"yyyy-MM-dd hh:mm:ss");
                          }},
                        { title: "实际到账时间", field: 'dealTime',render:(data,full)=>{
                            return DateUtil.formatDate(data,"yyyy-MM-dd hh:mm:ss");
                          }},
                        { title: "订单状态", field: 'status',render:(data,full)=>{
                            return statusList[data];
                          }},
                    ]
                }
            }
        }
    }
</script>
