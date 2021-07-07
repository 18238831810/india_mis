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
                    { title: "用户账号", field: 'uid'},
                    { title: "主播账号", field: 'coverId'},
                    {click:"查询"},
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

/**
* 创建时间
*/
@ApiParam(hidden = true)
private long ctime;
/**
* 撮合时间
*/
@ApiParam(hidden = true)
private long utime;
/**
* 直播房间号
*/
private String roomId;
/**
* 下注当事人ID
*/
@ApiParam(hidden = true)
private long uid;
/**
* 下单总值
*/
@ApiParam(name = "payment", value = "下单总量")
private double payment;

/**
* 买涨跌或平这三个方向
* rise fall   equal
*/
@ApiParam(name = "buyDirection", allowableValues = "rise,fall,equal", value = "下单方向")
private String buyDirection;
/**
* 上期价格
*/
@ApiParam(hidden = true)
private String earlyStagePrice;
/**
* 上期时间
*/
@ApiParam(hidden = true)
private long earlyStageTime;
/**
* 下期价格
*/
@ApiParam(hidden = true)
private String nextStagePrice;
/**
* 下期时间
*/
@ApiParam(hidden = true)
private long nextStageTime;

/**
* 杠杆倍数
*/
@ApiParam(hidden = true)
private double lever;

/**
* 盈利
*/
@ApiParam(hidden = true)
private double profit;

/**
* 行情周期
*/
@ApiParam(hidden = true)
private String marketCycle;

/**
* 状态
* 0:刚生成，1是处理 -1：为撤销订单
*/
@ApiParam(hidden = true)
private int status;
