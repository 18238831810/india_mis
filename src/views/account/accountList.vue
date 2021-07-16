<template>
  <div class="wrapper">
    <FORM  ref="childForm"  @formclick="formclick" :formData="formData"></FORM>
    <table-page ref="childTable"  @btnclick="bthClick"  :pageData="pageData"></table-page>
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
    const sexList = {0:"女",1:"男"};
    const statusList = {0:"正常",1:"封号",2:"禁用"};
    const recordList = {0:"不支持",1:"支持"};
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
            if (clickName == "recordStauts"){
              this.dataChanage(URL.account.updateRecordStatus,{tId:row.tId,tRecord:row.tRecord == 1?0:1},res =>{
                if (res.code == 0){
                  this.$message.success("suc");
                }else{
                  this.$message.error(res.msg);
                }
              });
            }else if (clickName == "updateFee"){
                this.$refs.childUpdate.open(row);
            }
          },
          submit(model){
              this.dataChanage(URL.account.updateFee,model,res => {
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
                    { title: "用户类型", field: 'tRole',data: 0,hidden:true},
                    { title: "用户账号", field: 'tId'},
                    {click:"查询"},
                  ]
                },
                updateData:{
                    cols:[
                        { title: 'tId', field: 'tId',hidden:true},
                        { title: "收费标准(/min)", field: 'tFeeStandard'},
                    ],
                },
                /*table生成*/
                pageData: {
                  sequence: true,
                  queryUrl: URL.account.query, //请求路径和参数
                  cols: [
                      { title: "用户账号", field: 'tId'},
                      { title: "手机号", field: 'tPhone'},
                      { title: "用户昵称", field: 'tNickName'},
                      { title: "性别", field: 'tSex',render:(data,full)=>{
                        return sexList[data];
                        }},
                      { title: "年龄", field: 'tAge'},
                      { title: "推荐人", field: 'tReferee'},
                      { title: "用户状态", field: 'tDisable',render:(data,full)=>{
                          return statusList[data];
                        }},
                      { title: "录播状态", field: 'tRecord',render:(data,full)=>{
                          return recordList[data];
                        }},
                      { title: "收费标准(/min)", field: 'tFeeStandard'},
                      {field:"收费设置",title:"操作",size:"mini",click:"updateFee",type:"primary",icon:"el-icon-edit"},
                      {field:"切换录播状态",title:"操作",size:"mini",click:"recordStauts",type:"primary",icon:"el-icon-edit"},
                  ]
                }
            }
        }
    }
</script>



@TableId
@JsonProperty("tId")
private Integer tId;

@JsonProperty("tPhone")
private String tPhone;

@JsonProperty("tIdcard")
private Integer tIdcard;

@JsonProperty("tNickName")
private String tNickName;

@JsonProperty("tSex")
private Integer tSex;

@JsonProperty("tAge")
private Integer tAge;

@JsonProperty("tRole")
private Integer tRole;

@JsonProperty("tDisable")
private Integer tDisable;

@JsonProperty("tRecord")
private Integer tRecord;
