<template>
  <div class="wrapper">
    <FORM  ref="childForm"  @formclick="formclick" :formData="formData"></FORM>
    <table-page ref="childTable" @btnclick="bthClick"  :pageData="pageData"></table-page>
    <UPDATE  ref="childUpdate"  @submit="submit" :updateData="updateData"></UPDATE>
  </div>
</template>

<script>
    //table封装组件
    import tablePage from '@/components/page/table.vue'
    import FORM from '@/components/page/form.vue'
    import UPDATE from '@/components/page/update.vue'
    import URL from '@/views/utils/url'
    import DateUtil from '@/utils/dataTimeUtil.js'
    import Qs from 'qs'
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
              }
          },
          bthClick(clickName, row){
            if (clickName == "update"){
              this.$refs.childUpdate.open(row);
            }
          },
          submit(model){
            this.dataChanage(URL.promotionRebate.updateSetting,model,res => {
              if (res.code == 0){
                this.$refs.childUpdate.close();
                this.$message.success("suc");
              }else{
                this.$message.error(res.message);
              }
            })
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
                    {click:"查询"},
                  ]
                },
                updateData:{
                  cols:[
                    { title: 'id', field: 'id',hidden:true},
                    { title: "注册直接返利金额", field: 'cashinDirect'},
                    { title: "注册间接返利金额", field: 'cashinIndirect'},
                    { title: "下单佣金百分比", field: 'orderCommission'},
                    { title: "下单直接返利百分比", field: 'orderDirect'},
                    { title: "下单间接返利百分比", field: 'orderIndirect'},
                  ],
                },
                /*table生成*/
                pageData: {
                  isPage:false,
                  sequence: true,
                  queryUrl: URL.promotionRebate.query, //请求路径和参数
                  cols: [
                      { title: "注册直接返利金额", field: 'cashinDirect'},
                      { title: "注册间接返利金额", field: 'cashinIndirect'},
                      { title: "下单佣金百分比", field: 'orderCommission'},
                      { title: "下单直接返利百分比", field: 'orderDirect'},
                      { title: "下单间接返利百分比", field: 'orderIndirect'},
                      { title: "更新时间", field: 'updateTime',render:(data,full)=> {
                          return DateUtil.formatDate(data, "yyyy-MM-dd hh:mm:ss");
                        }},
                      {field:"修改",title:"操作",size:"mini",click:"update",type:"primary",icon:"el-icon-edit"},
                  ]
                }
            }
        }
    }
</script>