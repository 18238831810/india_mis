<template>
  <div class="wrapper">
    <FORM  ref="childForm"  @formclick="formclick" :formData="formData"></FORM>
    <table-page ref="childTable"  :pageData="pageData"></table-page>
    <div>
      <span>收益总额: {{totalAmount}}</span>
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
    let typeList = {1:"打赏主播"};
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
                  this.$axios.post(URL.consume.totalCount, Qs.stringify(data)).then(res => {
                    if (res.code == 0) this.totalAmount = res.data;
                  })
                }else if("导出" == clickName){
                  download.exportExcel(URL.consume.export,data,"打赏记录表");
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
                    { title: "用户账号", field: 'uid'},
                    { title: "主播账号", field: 'coverId'},
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
                  queryUrl: URL.consume.query, //请求路径和参数
                  cols: [
                      { title: "用户账号", field: 'uid'},
                      { title: "主播账号", field: 'coverId'},
                      { title: "消费类型", field: 'type',render:(data,full)=>{
                          return typeList[data];
                        }},
                      { title: "用户消费金额", field: 'totalAmount'},
                      { title: "主播收益金额", field: 'coverAmount'},
                      { title: "备注", field: 'remark'},
                      { title: "打赏时间", field: 'createTime',render:(data,full)=> {
                          return DateUtil.formatDate(data, "yyyy-MM-dd hh:mm:ss");
                        }}
                  ]
                }
            }
        }
    }
</script>

/