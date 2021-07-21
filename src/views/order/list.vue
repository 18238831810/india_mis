<template>
  <div class="wrapper">
    <FORM  ref="childForm"  @formclick="formclick" :formData="formData"></FORM>
    <table-page ref="childTable" @btnclick="bthClick" :pageData="pageData"></table-page>
    <div>
      <span>盈亏总额: {{totalAmount}}</span>
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
    let statusList = {0:"刚生成",1:"处理","-1":"撤销订单"};
    let buyDirectionList = {rise:"涨",fall:"跌",equal:"平"};
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
                  this.$axios.post(URL.order.totalCount, Qs.stringify(data)).then(res => {
                      if (res.code == 0) this.totalAmount = res.data;
                  })
              }else if("导出" == clickName){
                download.exportExcel(URL.order.export,data,"交易明细表");
              }
          },
          bthClick(clickName, row){
            if (clickName == "sendMessage"){
              this.dataChanage(URL.order.sendMessage,{id:row.id},res =>{
                this.$message.success("suc");
              });
            }else if (clickName == "sendProfitMessage"){
              this.dataChanage(URL.order.sendProfitMessage,{id:row.id},res =>{
                this.$message.success("suc");
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
                  queryUrl: URL.order.query, //请求路径和参数
                  cols: [
                      { title: "用户账号", field: 'uid'},
                      { title: "直播房间号", field: 'roomId'},
                      { title: "下单总值", field: 'payment'},
                      { title: "下注方向", field: 'buyDirection',render:(data,full)=> {
                          return buyDirectionList[data];
                        }},
                      { title: "上期时间", field: 'earlyStageTime',render:(data,full)=> {
                          return DateUtil.formatDate(data, "yyyy-MM-dd hh:mm:ss");
                        }},
                      { title: "下期价格", field: 'nextStagePrice'},
                      { title: "下期时间", field: 'nextStageTime',render:(data,full)=> {
                          return DateUtil.formatDate(data, "yyyy-MM-dd hh:mm:ss");
                        }},
                      { title: "盈利", field: 'profit'},
                      { title: "行情周期", field: 'marketCycle'},
                      { title: "状态", field: 'status',render:(data,full)=> {
                          return statusList[data];
                        }},
                      { title: "创建时间", field: 'ctime',render:(data,full)=> {
                          return DateUtil.formatDate(data, "yyyy-MM-dd hh:mm:ss");
                        }},
                      { title: "撮合时间", field: 'utime',render:(data,full)=> {
                          return DateUtil.formatDate(data, "yyyy-MM-dd hh:mm:ss");
                        }},
                      {field:"下单通知",title:"操作",size:"mini",click:"sendMessage",type:"primary",icon:"el-icon-edit"},
                      {field:"盈利通知",title:"操作",size:"mini",click:"sendProfitMessage",type:"primary",icon:"el-icon-edit",hidden:(full,data)=>{
                          return  (full.status != 1 || full.profit <= 0);
                        }},
                  ]
                }
            }
        }
    }
</script>
