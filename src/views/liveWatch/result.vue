<template>
  <div class="wrapper">
    <FORM  ref="childForm"  @formclick="formclick" :formData="formData"></FORM>
    <table-page ref="childTable"  @btnclick="bthClick"  :pageData="pageData"></table-page>
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
    let typeList = {0:"直播",1:"录播"};
    let feeTypeList = {0:"分钟"};
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
                }else if("导出" == clickName){
                  download.exportExcel(URL.consume.export,data,"打赏记录表");
                }
            },
            bthClick(clickName, row){
              if (clickName == "detail"){
                this.$router.push({path:"/home/liveWatch/list", query: { liveId: row.liveId} });
              }
            },
        },
        data () {
            return {
                totalAmount:"--",
                queryData:{},
                /*from查询表单*/
                formData:{
                  hasLable: true,
                  cols:[
                    {click:"查询"},
                    {click:"导出"},
                  ]
                },
                /*table生成*/
                pageData: {
                  sequence: true,
                  queryUrl: URL.liveWatch.queryResult, //请求路径和参数
                  cols: [
                      { title: "用户账号", field: 'uid'},
                      { title: "主播账号", field: 'coverId'},
                      { title: "直播类型", field: 'type',render:(data,full)=>{
                          return typeList[data];
                        }},
                      { title: "扣费类型", field: 'feeType',render:(data,full)=>{
                          return feeTypeList[data];
                        }},
                      { title: "用户消费总金额", field: 'totalAmount'},
                      { title: "主播收益总金额", field: 'coverAmount'},
                      { title: "当次直播标识", field: 'liveId'},
                      { title: "观看时长", field: 'duration'},
                      { title: "扣费时间", field: 'createTime',render:(data,full)=> {
                          return DateUtil.formatDate(data, "yyyy-MM-dd hh:mm:ss");
                        }},
                      { title: "汇总时间", field: 'updateTime',render:(data,full)=> {
                          return DateUtil.formatDate(data, "yyyy-MM-dd hh:mm:ss");
                        }},
                     {field:"详细",title:"操作",size:"mini",click:"detail",type:"primary",icon:"el-icon-edit"},
                  ]
                }
            }
        }
    }
</script>


