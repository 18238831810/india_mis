<template>
  <el-dialog :visible.sync="visible" :title="formData.modelName || (!colData || !colData.id?$t('page.add'):$t('page.update'))"  :width="updateData.width" :close-on-click-modal="false" :before-close="beforeClose" :close-on-press-escape="false" class="dv_update">
    <el-form :model="formData" ref="dataForm" :style="{'max-height':maxHeight,'overflow-y':'scroll'}">
      <div v-for="(col,index) in formData.cols">
        <el-form-item :required="typeof col.required == 'function'?col.required(updateModel,col):col.required" v-if="col.type != 10" :style="{'display':(typeof col.hidden == 'function'?col.hidden(updateModel,col):col.hidden)?'none':'flex'}" :label="col.title"  >
          <el-upload v-if="col.upload"
                     :drag="col.drag"
                     :data="col.option"
                     :headers="uploadHeaders"
                     class="upload-demo"
                     :on-success="(response, file, fileList)=> uploadSuc(response, file, fileList, col)"
                     :action="col.action || defaultUploadUrl"
                     :show-file-list="false"
                     :auto-upload="true"
                     :before-upload="(file) => uploadProgress(file,col)">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">{{$t('page.drag')}}<em>{{$t('page.clickUpload')}}</em></div>
            <span>{{col.loading}}</span>
          </el-upload>
          <img v-if="col.upload && col.data" style="width: 150px" :src="col.data">

          <!--普通input框 type:1-->
          <el-input :readonly="typeof col.readonly == 'function'?col.readonly(updateModel,col):col.readonly" :disabled="col.disabled"  :type="col.textType" :autosize="true" v-if="!col.type || col.type == 1" @input="change()" v-model="col.data" :placeholder="col.placeholder==null?col.title:col.placeholder"></el-input>

          <!--select框 type:2-->
          <el-select :readonly="typeof col.disabled == 'function'?col.readonly(updateModel,col):col.readonly" :disabled="col.disabled" :multiple="col.multiple" @input="change()" v-if="col.type == 2" v-model="col.data" :placeholder="col.title">
            <el-option v-if="col.optionList && col.optionList instanceof Array" v-for="option in col.optionList" :label="option.value" :value="col.isNumber?Number(option.key):option.key"></el-option>
            <el-option v-if="col.optionList && !(col.optionList instanceof Array)" v-for="(value,key) in col.optionList" :label="value" :value="col.isNumber?Number(key):key"></el-option>
            <el-option v-if="col.optionListArrRender" v-for="option in (col.optionListArrRender?col.optionListArrRender(updateModel,col):[])" :label="option.value" :value="col.isNumber?Number(option.key):option.key"></el-option>
            <el-option v-if="col.optionListObjRender" v-for="(value,key) in (col.optionListObjRender?col.optionListObjRender(updateModel,col):{})" :label="value" :value="col.isNumber?Number(key):key"></el-option>
          </el-select>

          <!--单选 type:3-->
          <el-radio-group :disabled="typeof col.readonly == 'function'?col.readonly(updateModel,col):col.readonly || col.disabled" v-if="col.type == 3" @input="change()"  v-model="col.data">
            <el-radio v-if="col.optionList instanceof Array" v-for="option in col.optionList" :label="col.isNumber?Number(option.key):option.key">{{option.value}}</el-radio>
            <el-radio v-if="!(col.optionList instanceof Array)" v-for="(value,key) in col.optionList" :label="col.isNumber?Number(key):key">{{value}}</el-radio>
          </el-radio-group>

          <!--复选框 type:4-->
          <el-checkbox :indeterminate="col.isIndeterminate" :disabled="typeof col.readonly == 'function'?col.readonly(updateModel,col):col.readonly" v-if="col.type == 4 && col.hasCheckAll" v-model="col.checkAll" @change="(val)=>handleCheckAllChange(val,col)">{{col.checkAllName || $t('page.selectAll')}}</el-checkbox>
          <el-checkbox-group style="margin:auto 20px"  :disabled="typeof col.readonly == 'function'?col.readonly(updateModel,col):col.readonly || col.disabled"  v-if="col.type == 4" @input="change()"  v-model="col.data" @change="(val)=>handleCheckedCitiesChange(val,col)">
            <el-checkbox v-if="col.optionList instanceof Array" v-for="option in col.optionList" :label="col.isNumber?Number(option.key):option.key">{{option.value}}</el-checkbox>
            <el-checkbox v-if="!(col.optionList instanceof Array)" v-for="(value,key) in col.optionList" :label="col.isNumber?Number(key):key">{{value}}</el-checkbox>
          </el-checkbox-group>

          <!--时间 type:5-->
          <el-date-picker :readonly="typeof col.readonly == 'function'?col.readonly(updateModel,col):col.readonly || col.disabled"  v-if="col.type == 5" @input="change()" v-model="col.data"  type="datetime" :value-format="col.format?col.format:'timestamp'" :placeholder="col.title"></el-date-picker>

          <!--富文本编辑器 type:6,quill底层涉及到html的id，visible是把模态框隐藏，所以此次注意visible为false时要把quill干掉而不是隐藏，不然多个模态框时会再次id冲突，导致富文本显示异常-->
          <!--noTable:是否支持table样式（目前:36要求支持,108要求不支持）-->
          <!--<quill  v-if="col.type == 6 && visible" :uploadUrl="col.uploadUrl" :quillId="col.field" ref="quill"></quill>-->
          <Ueditor v-if="col.type == 14 && visible" :col="col"></Ueditor>

          <!--计数器 type:7-->
          <el-input-number :disabled="typeof col.readonly == 'function'?col.readonly(updateModel,col):col.readonly" v-if="col.type == 7" v-model="col.data" :min="col.min" :precision="col.precision" :label="col.title"></el-input-number>

          <!--分类多选框 type:8-->
          <el-checkbox-group :disabled="typeof col.readonly == 'function'?col.readonly(updateModel,col):col.readonly"  v-if="col.type == 8"  @input="change()"  v-model="col.data" @change="(val)=>handleCheckedCitiesChangeMu(val,col)">
            <div v-for="select in col.selectList">
              <div>
                <el-checkbox :indeterminate="select.isIndeterminate"  v-model="select.checkAll" @change="(val)=>handleCheckAllChangeMu(val,select,col)" :label="select.check">{{select.checkAllName}}</el-checkbox>
              </div>
              <div style="margin:auto 20px" v-if="select.optionList">
                <el-checkbox v-if="select.optionList instanceof Array" v-for="option in select.optionList" :label="col.isNumber?Number(option.key):option.key">{{option.value}}</el-checkbox>
                <el-checkbox v-if="!(select.optionList instanceof Array)" v-for="(value,key) in select.optionList" :label="col.isNumber?Number(key):key">{{value}}</el-checkbox>
              </div>
              <div style="margin:auto 20px" v-if="select.styleList" v-for="optionList in select.styleList">
                <el-checkbox v-if="optionList instanceof Array" v-for="option in optionList" :label="col.isNumber?Number(option.key):option.key">{{option.value}}</el-checkbox>
                <el-checkbox v-if="!(optionList instanceof Array)" v-for="(value,key) in optionList" :label="col.isNumber?Number(key):key">{{value}}</el-checkbox>
              </div>

            </div>
          </el-checkbox-group>

          <!--开始结束时间 type:9-->
          <el-date-picker :range-separator="$t('page.to')"
                          :start-placeholder="col.title+$t('page.startTime')"
                          :end-placeholder="col.title+$t('page.endTime')" :readonly="typeof col.readonly == 'function'?col.readonly(updateModel,col):col.readonly"  :disabled="col.disabled" v-if="col.type == 9" @input="change()" v-model="col.data"  type="datetimerange" :value-format="col.format?col.format:'timestamp'" :placeholder="col.title"></el-date-picker>

          <!--上传excel type:11-->
          <div v-if="col.type == 11">
            <el-upload
              :action="col.action || defaultUploadUrl"
              class="upload-demo"
              :data="col.option"
              :headers="uploadHeaders"
              drag
              :on-success="(response, file, fileList)=> uploadFileSuc(response, file, fileList,col)"
              :show-file-list="false"
              :auto-upload="true"
              :before-upload="(file)=> uploadFileProgress(file,col)">
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">{{$t('page.drag')}}<em>{{$t('page.clickUpload')}}</em></div>
              <span>{{col.loading}}</span>
            </el-upload>
            <el-input :readonly="col.readonly" v-model="col.fileName"></el-input>
            <el-button style="margin: 10px auto"  type="primary"  @click="downTemplate(col.downUrl)">{{$t('page.downTemplate')}}</el-button>
          </div>

          <!--默认从变量 type:12,请注意使用this.$set(col,"data",value)方式设置默认值-->
          <el-input :readonly="typeof col.readonly == 'function'?col.readonly(updateModel,col):col.readonly" :disabled="col.disabled" :type="col.textType"  v-if="col.type == 12"   v-model="col.dataRender(updateModel,col)?col.data:col.data" :placeholder="col.placeholder==null?col.title:col.placeholder"></el-input>

          <!--select框 type:13-->
          <el-select :readonly="typeof col.disabled == 'function'?col.readonly(updateModel,col):col.readonly" :disabled="col.disabled" :multiple="col.multiple" @input="change()" v-if="col.type == 13" v-model="col.dataRender(updateModel,col)?col.data:col.data" :placeholder="col.title">
            <el-option v-if="col.optionList && col.optionList instanceof Array" v-for="option in col.optionList" :label="option.value" :value="col.isNumber?Number(option.key):option.key"></el-option>
            <el-option v-if="col.optionList && !(col.optionList instanceof Array)" v-for="(value,key) in col.optionList" :label="value" :value="col.isNumber?Number(key):key"></el-option>
            <el-option v-if="col.optionListArrRender" v-for="option in (col.optionListArrRender?col.optionListArrRender(updateModel,col):[])" :label="option.value" :value="col.isNumber?Number(option.key):option.key"></el-option>
            <el-option v-if="col.optionListObjRender" v-for="(value,key) in (col.optionListObjRender?col.optionListObjRender(updateModel,col):{})" :label="value" :value="col.isNumber?Number(key):key"></el-option>
          </el-select>

          <!--如果需要带按钮-->
          <el-button style="margin:10px auto" type="primary" v-if="col.btn" @click="col.click(updateModel,col)">{{col.btn}}</el-button>

        </el-form-item>
        <!--自定义slot type:10-->
        <slot v-if="col.type == 10" :name="col.slot" :col="col" :updateModel="updateModel"></slot>

      </div>

    </el-form>

    <div v-show="!updateData.submit || updateData.submit == 'show'">
      <template  slot="footer" style="display: flex;justify-content: center;align-items: center;width: 100%">
        <el-button @click="close()">{{$t('page.cancel')}}</el-button>
        <el-button type="primary" @click="submit()" :disabled="submitBtn.disabled" :loading="submitBtn.loading">{{$t('page.submit')}}</el-button>
      </template>
    </div>
  </el-dialog>
</template>

<script>
    /*import { getToken } from '@/utils/auth'
    import { localRead, getQueryString } from '@/utils/tools'*/
    /*import quill from "@/components/page/quill.vue"*/
    import Url from "@/components/page/url"
    import Ueditor from "@/components/page/ueditor.vue"
    export default {
        components:{
          /*  quill,*/
            Ueditor,
        },
        props: ["updateData"],
        data(){
            return{
                defaultUploadUrl:Url.img.upload,
                maxHeight:"",
                visible:false,
                formData:{cols:[]},
                colData:{},
                uploadHeaders:{},
                submitBtn: {
                    loading: false,
                    disabled: false
                },
            }
        },
        computed:{
            updateModel:{
                get(){
                    let obj = {};
                    for (let i in this.formData.cols) {
                        if (this.formData.cols[i].type == 8){
                            let arr = this.formData.cols[i].data;
                            for (let j in this.formData.cols[i].selectList){
                                arr = arr.filter((item)=>{
                                    return item != this.formData.cols[i].selectList[j].check;
                                });
                            }
                            obj[this.formData.cols[i].field] = arr;
                        }
                        if (this.formData.cols[i].type == 9) {
                            if (!this.formData.cols[i].startEndParam) {
                                obj[this.formData.cols[i].field + 'Start'] = this.formData.cols[i].data[0]
                                obj[this.formData.cols[i].field + 'End'] = this.formData.cols[i].data[1]
                            } else {
                                obj[this.formData.cols[i].startEndParam[0]] = this.formData.cols[i].data[0]
                                obj[this.formData.cols[i].startEndParam[1]] = this.formData.cols[i].data[1]
                            }
                            let value = this.formData.cols[i].isArray
                            if (typeof (value) == 'undefined' || value === '' || value == null || value == true) {
                                obj[this.formData.cols[i].field] = this.formData.cols[i].data
                            } else {
                                obj[this.formData.cols[i].field] = this.formData.cols[i].data.join(',')
                            }
                        }
                        else obj[this.formData.cols[i].field] = this.formData.cols[i].data;
                    }
                    return obj;
                },
            }
        },
        methods:{
            downTemplate(url){
                window.location.href = url;
            },
            docHeight() {
                let docHeight = window.innerHeight || document.documentElement.clientHeight
                this.maxHeight = docHeight / 1.8 + 'px'
            },
            //提交状态
            loading(){
                this.changeSubmitBtnStatus(true);
            },
            beforeClose(done){
                this.changeSubmitBtnStatus(false);
                done();
            },
            close(){
                this.changeSubmitBtnStatus(false);
                this.visible = false;
            },
            open(data){
                this.colData = data || {};
                this.visible = true;
                this.formData = {cols:[]};
                this.formData.modelName = this.updateData.modelName;
                for (let i in this.updateData.cols) {
                    //更新操作，需要回显
                   let assign = Object.assign(this.common.copy(this.updateData.cols[i]));
                   if (this.colData[this.updateData.cols[i].field] !== undefined) {
                       //存在回显数据，则更换默认值
                       assign.data = this.colData[this.updateData.cols[i].field];
                   }
                   this.formData.cols.push(assign);
                }
                //处理多选框的全选回显样式
                for (let i in this.formData.cols) {
                    if (this.formData.cols[i].type == 8){
                        this.handleCheckedCitiesChangeMu(this.formData.cols[i].data,this.formData.cols[i]);
                    }else if(this.formData.cols[i].type == 4 && this.formData.cols[i].hasCheckAll){
                        this.handleCheckedCitiesChange(this.formData.cols[i].data,this.formData.cols[i]);
                    }
                }
                /*this.$nextTick(() => {
                    let index = 0;
                    for (let i in this.formData.cols) {
                        if (this.formData.cols[i].type == 6){
                            this.$refs.quill[index].init(this.formData.cols[i].data);
                            index ++;
                        }
                    }
                });*/
            },
            change(){
                //此处数据需要强制刷新，否则监听不到数据变化，数据会出现无法输入
                this.$forceUpdate();
            },
            pushArr(optionList,arr){
                if(optionList instanceof Array){
                    for (let i in optionList) {
                        arr.push(optionList[i].key);
                    }
                }else{
                    for (let i in optionList){
                        arr.push(i);
                    }
                }
            },
            getCheckAllArr(col){
                let optionList = [];
                if (col.optionList){
                    this.pushArr(col.optionList,optionList);
                }else if (col.styleList){
                    for (let i in col.styleList){
                        if (col.styleList[i]){
                            this.pushArr(col.styleList[i],optionList);
                        }
                    }
                }
                if (col.isNumber) optionList = optionList.map(key => {return Number(key)});
                return optionList;
            },
            selectAllOrRemoveAll(dataArr,selectArr,type){
                for (let i in selectArr) {
                    if (type == 1) {//全选
                        if (dataArr.indexOf(selectArr[i]) == -1) {
                            dataArr.push(selectArr[i]);
                        }
                    }else{//全不选
                        dataArr = dataArr.filter((item)=>{
                            return item != selectArr[i];
                        });
                    }
                }
                return dataArr;
            },
            handleCheckAllChange(val,col){
                let optionList = this.getCheckAllArr(col);
                col.data = val ? optionList:[];
                col.isIndeterminate = false;
                this.$forceUpdate();
            },
            handleCheckAllChangeMu(val,select,col){
                let optionList = this.getCheckAllArr(select);
                if (col.isNumber) {
                    col.data = col.data.map(key => {return Number(key)});
                    optionList = optionList.map(key => {return Number(key)});
                }
                if (val){
                    //全选
                    col.data = this.selectAllOrRemoveAll(col.data,optionList,1);
                }else{
                    //全不选
                    col.data = this.selectAllOrRemoveAll(col.data,optionList,0);
                }
                select.isIndeterminate = false;
                this.$forceUpdate();
            },
            handleCheckedCitiesChangeMu(val,col) {
                let dataList = col.data;
                if (col.isNumber) dataList = col.data.map(key => {return Number(key)});
                for(let i in col.selectList){
                    let optionList = this.getCheckAllArr(col.selectList[i]);
                    if (col.isNumber) optionList = optionList.map(key => {return Number(key)});
                    let flag = true;//是否全选
                    let hasData = false;//是否有选中值
                    let check = [col.isNumber?Number(col.selectList[i].check):col.selectList[i].check];
                    for(let j in optionList){
                        if (dataList.indexOf(optionList[j]) == -1) {
                            flag = false;
                            col.selectList[i].checkAll = false;
                            col.data = this.selectAllOrRemoveAll(col.data,check,0);
                        }else{
                            hasData = true;
                        }
                    }
                    if(flag) {
                        col.selectList[i].checkAll = true;
                        col.data = this.selectAllOrRemoveAll(col.data,check,1);
                    }
                    col.selectList[i].isIndeterminate = hasData && !flag;
                }
                this.$forceUpdate();
            },
            handleCheckedCitiesChange(val,col) {
                let optionList = this.getCheckAllArr(col);
                let checkedCount = val.length;
                col.checkAll = checkedCount === optionList.length;
                col.isIndeterminate = checkedCount > 0 && checkedCount < optionList.length;
                this.$forceUpdate();
            },
            changeSubmitBtnStatus(status){
                this.$set(this.submitBtn,"loading",status);
                this.$set(this.submitBtn,"disabled",status);
            },
            submit(){
                /*let index = 0;
                for (let i in this.formData.cols) {
                    if (this.formData.cols[i].type == 6){
                        this.formData.cols[i].data = this.$refs.quill[index].getHtml();
                        this.updateModel[this.formData.cols[i].field] = this.$refs.quill[index].getHtml();
                        index ++;
                    }
                }*/
                this.$forceUpdate();
                for (let i in this.formData.cols) {
                    let required = typeof this.formData.cols[i].required == 'function'?this.formData.cols[i].required(this.updateModel,this.formData.cols[i]):this.formData.cols[i].required;
                    if (required){
                        //包含必填验证
                        if (Array.isArray(this.updateModel[this.formData.cols[i].field]) && this.updateModel[this.formData.cols[i].field].length <= 0) {
                            if (this.updateModel[this.formData.cols[i].field].length <= 0) {
                                //空数据
                                this.alert(this.formData.cols[i].title, this.formData.cols[i].errorMsg)
                                return
                            }
                        } else {
                            let value = this.updateModel[this.formData.cols[i].field]
                            if (typeof (value) == 'undefined' || value === '' || value == null) {
                                //空数据
                                this.alert(this.formData.cols[i].title, this.formData.cols[i].errorMsg)
                                return
                            }
                        }
                    }
                }
                if (this.updateData.submitTimeout){
                    //设置按钮加载定时任务，submitTimeout内不允许重复点击提交按钮
                    this.changeSubmitBtnStatus(true);
                    //setTimeout(()=>{this.changeSubmitBtnStatus(false)},this.updateData.submitTimeout);
                }
                this.$emit("submit", JSON.parse(JSON.stringify(this.updateModel)));
            },
            alert(title, errorMsg){
                this.$alert(errorMsg || (window.$t('page.write')+title), window.$t('page.validate'), {
                    confirmButtonText: window.$t('page.enter'),
                    callback: action => {
                    }
                });
            },
            uploadSuc(response, file, fileList,col){
                if (response.code == 0){
                    this.$set(col, "data", response.result);
                    //col.data = response.result;
                    col.loading = "";
                }else{
                    col.loading = window.$t('page.uploadFail');
                }
                this.$forceUpdate();
            },
            uploadFileSuc(response, file, fileList,col){
                if (response.code == 0){
                    col.loading = "";
                    this.$message.success(window.$t('page.uploadSuc'));
                }else{
                    col.loading = window.$t('page.uploadFail');
                }
                this.$forceUpdate();
                this.$emit("uploadFile",col,response.result);
            },
            uploadProgress(file,col){
                col.loading = window.$t('page.uploading');
                this.$forceUpdate();
            },
            uploadFileProgress(file,col){
                col.loading = window.$t('page.uploading');
                col.fileName = file.name;
                this.$forceUpdate();
            }
        },
        mounted() {
            this.docHeight();
           /* if (localRead('sysToken')) {
                this.uploadHeaders.Authorization = localRead('sysToken');
            }else if (window.SITE_CONFIG['routerLabel']) {
                this.uploadHeaders.Authorization =  getToken(window.SITE_CONFIG['routerLabel'])
            } else if (window.location.href.indexOf('label') != -1) {
                let labelRouter = getQueryString('label')
                this.uploadHeaders.Authorization = getToken(labelRouter)
            }*/
            this.$forceUpdate();
        }
    }
    /* 用法说明
    <UPDATE  ref="childUpdate"  @submit="submit" :updateData="updateData"></UPDATE>
    methods: {
        //结合table组件点击跟新按钮
        bthClick (clickName, row) {
            console.log(clickName,row);
            if (clickName == "update"){
                //弹出更新数据框并回显数据
                this.$refs.childUpdate.open(row);
            }
        },
        /!*提交数据触发事件*!/
        submit(model){
            console.log(model);
            //根据是否包含id更新还是添加
        }
    },
    data () {
          return {
            updateData:{
                cols:[
                //title：数据框显示名称, filed：name属性（与后台查询字段名称对应）, type:数据框选项{1:普通 2:select 3:单选 4:复选 5:时间，6:富文本},upload:是否需要上传图片功能，action:上传图片接口地址，新增需要添加定义初始值时data字段定义
                    { title: 'id', field: 'id',hidden:true},
                    { title: '手机号', field: 'phone',type: 6},
                    { title: '证件号', field: 'idNumber'},
                    { title: '是否启用', field: 'status',type:3,optionList:DataUtil.whiteList.status,isNumber:true},
                    { title: '备注', field: 'remark',upload:true,action:'http://precrs.will68.com/public/card/upload'},
                    { title: '邮箱', field: 'email',upload:true,action:'http://precrs.will68.com/public/card/upload'},
                    { title: '富文本', field: 'text',type: 6},
                ]
            }
          ｝
    */
</script>
<style>
  .dv_update .el-form-item{
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
  .dv_update .el-form-item__content{
    width: 80%;
  }
  .dv_update .el-upload-dragger{width: 200px;}
  .dv_update .el-dialog__footer{
    display: flex;
    justify-content: center;
    align-items: center;
  }
  #edui_fixedlayer{z-index: 9999999!important;}
</style>





