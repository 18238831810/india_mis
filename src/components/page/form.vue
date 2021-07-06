<template>
  <div>
    <el-form style="width: 96%;margin: 10px auto" :inline="true" :model="formData" class="demo-form-inline">
      <el-form-item v-show="!col.hidden" :label="formData.hasLable?col.title:''"  v-for="(col,index) in formData.cols">
        <!--按钮-->
        <el-button v-if="col.click" v-auth="col.auth" @click="formclick(col)" :type="col.type?col.type:'primary'" :size="col.size" :icon="col.icon" v-model="col.data">{{col.click}}</el-button>

        <!--普通input框 type:1-->
        <el-input  v-else-if="!col.type || col.type == 1" @change="change()" v-model="col.data" :placeholder="col.title"></el-input>

        <!--select框 type:2-->
        <el-select :multiple="col.multiple" v-else-if="col.type == 2" v-model="col.data" :placeholder="col.title" @change="change()" clearable>
          <el-option v-if="col.optionList && col.optionList instanceof Array" v-for="(option,index) in col.optionList" :label="option.value" :value="col.isNumber?Number(option.key):option.key"></el-option>
          <el-option v-if="col.optionList && !(col.optionList instanceof Array)" v-for="(value,key) in col.optionList" :label="value" :value="col.isNumber?Number(key):key"></el-option>
          <el-option v-if="col.optionListArrRender" v-for="option in (col.optionListArrRender?col.optionListArrRender(queryData,col):[])" :label="option.value" :value="col.isNumber?Number(option.key):option.key"></el-option>
          <el-option v-if="col.optionListObjRender" v-for="(value,key) in (col.optionListObjRender?col.optionListObjRender(queryData,col):{})" :label="value" :value="col.isNumber?Number(key):key"></el-option>
        </el-select>

        <!--单选 type:3-->
        <el-radio-group v-else-if="col.type == 3"  v-model="col.data" @change="change()">
          <el-radio v-if="col.optionList instanceof Array" v-for="(option,index) in col.optionList" :label="col.isNumber?Number(option.key):option.key">{{option.value}}</el-radio>
          <el-radio v-if="!(col.optionList instanceof Array)" v-for="(value,key) in col.optionList" :label="col.isNumber?Number(key):key">{{value}}</el-radio>
        </el-radio-group>

        <!--复选框 type:4-->
        <el-checkbox-group v-else-if="col.type == 4"  v-model="col.data" @change="change()">
          <el-checkbox v-if="col.optionList instanceof Array" v-for="(option,index) in col.optionList" :label="col.isNumber?Number(option.key):option.key">{{option.value}}</el-checkbox>
          <el-checkbox v-if="!(col.optionList instanceof Array)" v-for="(value,key) in col.optionList" :label="col.isNumber?Number(key):key">{{value}}</el-checkbox>
        </el-checkbox-group>

        <!--时间 type:5-->
        <el-date-picker  v-else-if="col.type == 5" v-model="col.data" :type="col.dateType?col.dateType:'datetime'" @input="change()" :value-format="col.format?col.format:'timestamp'" :placeholder="col.title"></el-date-picker>

        <!--开始结束时间 type:6-->
        <el-date-picker :change="col.change?col.change(JSON.parse(JSON.stringify(queryData)),col):()=>{}" :range-separator="$t('page.to')"
                        :start-placeholder="col.title+$t('page.startTime')"
                        :end-placeholder="col.title+$t('page.endTime')" :readonly="col.readonly" v-if="col.type == 6" v-model="col.data"  type="datetimerange" @input="change()" :value-format="col.format?col.format:'timestamp'" :placeholder="col.title"></el-date-picker>

      </el-form-item>
    </el-form>
  </div>
</template>

<script>
    export default {
        props: ["formData"],
        mounted(){
            this.queryListData();
        },
        computed:{
            queryData:{
                get(){
                    let obj = {};
                    let arr = this.formData.cols;
                    for (let i in arr) {
                        if (arr[i].data instanceof Array && arr[i].data.length > 0) {
                            if (arr[i].type == 6) {
                                if (!arr[i].startEndParam) {
                                    obj[arr[i].field + 'Start'] = arr[i].data[0]
                                    obj[arr[i].field + 'End'] = arr[i].data[1]
                                } else {
                                    obj[arr[i].startEndParam[0]] = arr[i].data[0]
                                    obj[arr[i].startEndParam[1]] = arr[i].data[1]
                                }
                            }
                            if (!arr[i].isArray) {
                                obj[arr[i].field] = arr[i].data.join(',')
                            } else {
                                obj[arr[i].field] = arr[i].data
                            }
                        } else {
                            if (arr[i].data != null) {
                                obj[arr[i].field] = arr[i].data
                            }
                        }
                    }
                    return obj
                }
            }
        },
        methods:{
            getQueryData(){
                return JSON.parse(JSON.stringify(this.queryData));
            },
            formclick (col) {
                if (col.click.indexOf("删除") != -1 || col.confirm){
                    this.confirm(col.click);
                }else{
                    this.$emit("formclick",col.click,JSON.parse(JSON.stringify(this.queryData)));
                }
            },
            confirm (click) {
                this.$confirm(window.$t("page.confirm")+ click + window.$t("page.opertion"), click , {
                    confirmButtonText: window.$t("page.enter"),
                    cancelButtonText: window.$t("page.cancel"),
                    type: 'warning'
                }).then(() => {
                    this.$emit("formclick",click,JSON.parse(JSON.stringify(this.queryData)));
                });
            },
            queryListData(){
                if (this.formData.noInitClick) return;
                this.$emit("formclick","查询",JSON.parse(JSON.stringify(this.queryData)));
            },
            change(){
                //此处数据需要强制刷新，否则监听不到数据变化，数据会出现无法输入
                this.copy();
                this.$forceUpdate();
            },
            copy(){
                //深度拷贝数组，使计算属性能监听到数组的变化
                const copy = this.common.copy(this.formData.cols);
                this.formData.cols = [];
                this.formData.cols = copy;
            }
        }
    }

    /* 用法实例
     <FORM  ref="childForm"  @formclick="formclick" :formData="formData"></FORM>
    methods: {
         //此方法用来接收列表中定义的按钮，clickName（定义的按钮名称），data（表单数据）
         formclick(clickName, data){
             console.log(clickName,data);
             if("查询" == clickName){
                 this.$refs.childTable.defaultGetData(data);
             }
         }
     },
     data () {
         return {
             formData:{
                 //是否展示lable
                 hasLable: true,
                 cols:[
                     //title：数据框显示名称, filed：name属性（与后台查询字段名称对应）, type:数据框选项{1:普通 2:select 3:单选 4:复选 5:时间},如果需要默认初始值 data:初始默认值
                     // select框属性 multiple:是否支持多选 optionList：对象或数据组（内容 key:实际值，value:展示内容）
                     // 单选框属性 optionList：对象或数据组（内容 key:实际值，value:展示内容）
                     // 多选框属性 optionList：对象或数据组（内容 key:实际值，value:展示内容） data:框架需要不能为空，所以此处给个[],isNumber:标识此参数是number（vue遍历展示选项时会自动转）
                     { title: '手机号', field: 'phone'},
                     { title: '身份证号码', field: 'idNumber',type:1},
                     { title: '邮箱', field: 'email',type:2,multiple:false,optionList:[{key:"key",value:"value"},{key:"key1",value:"value2"}],isNumber:ture},
                     { title: '单选', field: 'radio',type:3,optionList:{"key":"value","key1":"value2"}},
                     { title: '复选', field: 'radio',type:4,optionList:{"key":"value","key1":"value2"},data:[]},
                     //时间没做属性封装，需要自定义数据的话可以去参考文档修改此处内容
                     { title: '时间', field: 'time',type:5},
                     // 按钮 click:按钮名称，点击时间会从formclick接收到并将click值作为clickName传递过来 type:按钮类型，默认primary  size：按钮大小,默认中等 icon：按钮图标，默认没图标
                     {click:"删除",type:"primary"},
                     {click:"批量修改",type:"primary"},
                 ]
             },
         }
     }*/
</script>

