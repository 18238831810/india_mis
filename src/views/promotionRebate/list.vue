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
    import download from '@/utils/download.js'
    import Qs from 'qs'
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
                if("查询" == clickName){
                    this.queryData = data;
                    this.$refs.childTable.defaultQueryData(data);
                }else if("导出" == clickName){
                  download.exportExcel(URL.promotionRebate.rebateExport,data,"注册充值返利记录表");
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
                  queryUrl: URL.promotionRebate.rebateQuery, //请求路径和参数
                  cols: [
                      { title: "用户账号", field: 'uid'},
                      { title: "直接推荐人", field: 'direct'},
                      { title: "直接返利金额", field: 'cashinDirect'},
                      { title: "间接推荐人", field: 'indirect'},
                      { title: "间接返利金额", field: 'cashinIndirect'},
                      { title: "返利时间", field: 'createTime',render:(data,full)=>{
                          return DateUtil.formatDate(data,"yyyy-MM-dd hh:mm:ss");
                        }},
                  ]
                }
            }
        }
    }
</script>
@Excel(name = "直接推荐人")
@ApiModelProperty(value = "直接推荐人")
private Long direct;

@Excel(name = "间接推荐人")
@ApiModelProperty(value = "间接推荐人")
private Long indirect;

@Excel(name = "直接返利金额")
@ApiModelProperty(value = "直接返利金额")
private BigDecimal cashinDirect;

@Excel(name = "间接返利金额")
@ApiModelProperty(value = "间接返利金额")
private BigDecimal cashinIndirect;

@Excel(name = "返利时间",dict = "t_yyyy-MM-dd HH:mm:ss")
@ApiModelProperty(value = "返利时间")
private Long createTime;