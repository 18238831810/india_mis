<template>
  <div class="wrapper">
    <FORM  ref="childForm"  @formclick="formclick" :formData="formData"></FORM>
    <table-page ref="childTable"  @btnclick="bthClick" :pageData="pageData"></table-page>
    <div>
      <span>提现总额: {{totalAmount}}</span>
    </div>
  </div>
</template>

<script>
    //table封装组件
    import tablePage from '@/components/page/table.vue'
    import FORM from '@/components/page/form.vue'
    import UPDATE from '@/components/page/update.vue'
    import URL from '@/views/utils/url'
    import DateUtil from '@/utils/dataTimeUtil.js'
    import download from '@/utils/download.js'
    import Qs from 'qs'
    let paymentIdList = {1:"UPI代付",3:"IFSC代付"};
    let statusList = {0:"未完成",1:"失败",2:"成功"};
    let approveStatusList = {0:"未审批",1:"已审批"};
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
                if("查询" == clickName){
                    this.queryData = data;
                    this.$refs.childTable.defaultQueryData(data);
                }else if("统计" == clickName){
                  this.totalAmount = "--";
                  this.$axios.post(URL.cashout.totalCount, Qs.stringify(data)).then(res => {
                    if (res.code == 0) this.totalAmount = res.data;
                  })
                }else if("导出" == clickName){
                  download.exportExcel(URL.cashout.export,data,"提现记录表");
                }
            },
          bthClick(clickName, row){
            if (clickName == "approve"){
              this.dataChanage(URL.cashout.approve,{id:row.id},res =>{
                if (res.code == 0){
                  this.$message.success("suc");
                }else{
                  this.$message.error(res.msg);
                }
              });
            }
          },
          dataChanage(url,option,suc,fail){
            this.$axios.post(url, Qs.stringify(option || {})).then(res => {
              this.$refs.childTable.defaultGetData(this.queryData);
              if(suc && (typeof suc == 'function')) suc(res);
            }).catch(res => {
              if(fail && (typeof fail == 'function')) fail(res);
            })
          }
        },
        data () {
            return {
                totalAmount:"--",
                queryData:{},
                /*from查询表单*/
                formData:{
                  hasLable: true,
                  cols:[
                    { title: "用户账号", field: 'uid'},
                    { title: "订单状态", field: 'status',type: 2, optionList: statusList, isNumber: true},
                    { title: "开始时间", field: 'startTime',type: 5},
                    { title: "结束时间", field: 'endTime',type: 5},
                    {click:"查询"},
                    {click:"统计"},
                    {click:"导出"},
                  ]
                },
                /*table生成*/
                pageData: {
                  sequence: true,
                  queryUrl: URL.cashout.query, //请求路径和参数
                  cols: [
                      { title: "用户账号", field: 'uid'},
                      { title: "支付类型", field: 'paymentId',render:(data,full)=>{
                          return paymentIdList[data];
                        }},
                      { title: "订单号", field: 'orderSn'},
                      { title: "支付平台订单号", field: 'ptOrderSn'},
                      { title: "订单金额", field: 'amount'},
                      { title: "实际存款金额", field: 'realAmount'},
                      { title: "IFSC编码", field: 'payerIfsc'},
                      { title: "收款人手机号", field: 'payerMobile'},
                      { title: "收款人名称", field: 'payerName'},
                      { title: "收款人账号", field: 'payerAccount'},
                      { title: "备注", field: 'remark'},
                      { title: "订单时间", field: 'orderTime',render:(data,full)=>{
                          return DateUtil.formatDate(data,"yyyy-MM-dd hh:mm:ss");
                        }},
                      { title: "实际到账时间", field: 'dealTime',render:(data,full)=>{
                          return DateUtil.formatDate(data,"yyyy-MM-dd hh:mm:ss");
                        }},
                      { title: "订单状态", field: 'status',render:(data,full)=>{
                          return statusList[data];
                        }},
                    { title: "审批状态", field: 'approveStatus',render:(data,full)=>{
                        return approveStatusList[data];
                      }},
                    {field:"审批",title:"审批",size:"mini",click:"approve",type:"primary",icon:"el-icon-edit",hidden:(full,data)=>{
                      return  full.approveStatus == 1;
                      }},
                  ]
                }
            }
        }
    }
</script>


