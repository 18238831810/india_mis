<template>
  <div class="wrapper">
    <FORM  ref="childForm"  @formclick="formclick" :formData="formData"></FORM>
    <table-page ref="childTable"  @btnclick="bthClick"   :pageData="pageData"></table-page>
    <UPDATE  ref="childUpdate"  @submit="submit" :updateData="updateData"></UPDATE>
  </div>
</template>

<script>
    //table封装组件
    import tablePage from '@/components/page/table.vue'
    import FORM from '@/components/page/form.vue'
    import UPDATE from '@/components/page/update.vue'
    import URL from '@/views/utils/url'
    import Qs from 'qs'
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
              }if("新增" == clickName){
                  this.$refs.childUpdate.open();
              }
          },
          bthClick(clickName, row){
            if (clickName == "update"){
              this.$refs.childUpdate.open(row);
            }else if (clickName == "delete"){
              this.dataChanage(URL.push.order.delete,{id:row.id},res => {
                if (res.code == 0){
                  this.$refs.childUpdate.close();
                  this.$message.success("suc");
                }else{
                  this.$message.error(res.message);
                }
              })
            }
          },
          submit(model){
            this.dataChanage(URL.push.order.update,model,res => {
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
                queryData:{},
                /*from查询表单*/
                formData:{
                  hasLable: true,
                  cols:[
                    {click:"查询"},
                    {click:"新增"},
                  ]
                },
                updateData:{
                  cols:[
                    { title: 'id', field: 'id',hidden:true},
                    { title: "用户昵称", field: 'name',required:true},
                    { title: "下单总值", field: 'payment',required:true},
                    { title: "下单方向", field: 'buyDirection',type:2,optionList:buyDirectionList,required:true},
                  ],
                },
                /*table生成*/
                pageData: {
                  sequence: true,
                  queryUrl: URL.push.order.query, //请求路径和参数
                  cols: [
                      { title: "用户昵称", field: 'name'},
                      { title: "下单总值", field: 'payment'},
                      { title: "下单方向", field: 'buyDirection',render:(data,full)=>{
                          return buyDirectionList[data];
                        }},
                      {field:"修改",title:"操作",size:"mini",click:"update",type:"primary",icon:"el-icon-edit"},
                      {field:"删除",title:"操作",size:"mini",click:"delete",type:"primary",icon:"el-icon-delete"},
                  ]
                }
            }
        }
    }
</script>


