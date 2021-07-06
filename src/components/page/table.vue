<template>
  <div style="width: 96%;margin: 10px auto">
    <!--显示隐藏控制-->
    <el-checkbox-group v-show="pageData.isShow" v-model="checkList" style="margin: 20px auto">
      <el-checkbox :label="col.title" checked="checked" v-if="!col.click && !col.btnClick"  v-for="(col,index) in pageData.cols"></el-checkbox>
    </el-checkbox-group>

    <el-table border :data="tableData" border style="width: 100%;margin-bottom: 10px" @selection-change="checkbox">
      <!--多选-->
      <el-table-column :label="$t('page.selectAll')" v-if="pageData.selection" type="selection" width="80px"></el-table-column>
      <!--序号-->
      <el-table-column :label="$t('page.sort')" v-if="pageData.sequence" type="index" width="80px"></el-table-column>
      <el-table-column :show-overflow-tooltip="col.overflow||true" :fixed="col.btnClick && col.btnClick.length > 0?'right':col.fixed" :min-width="col.btnClick && col.btnClick.length > 0?col.minWidth||'100':col.minWidth||''" v-if="(col.btnClick && col.btnClick.length > 0) || col.click || (!isShow[col.title] || isShow[col.title] != 'hide')"  v-for="(col,index) in pageData.cols" :key="index" :prop="col.field" :label="col.title" :width="col.width">
        <template slot-scope="scope">
          <div v-if="col.btnClick && col.btnClick.length > 0"  style="text-align:center"><!--表格内按钮，可点击，传入方法类型，用clickType区分按钮点击事件。-->
            <el-button v-auth="btn.auth" v-show="!(typeof btn.hidden == 'function'?btn.hidden(scope.row[col.field],scope.row):btn.hidden)"  v-for="(btn,index) in col.btnClick"  :size="btn.size?btn.size:'mini'"  :key="index" :type="typeof btn.type == 'function'?btn.type(scope.row[col.field],scope.row):btn.type" :icon="typeof btn.icon == 'function'?btn.icon(scope.row[col.field],scope.row):btn.icon" @click="btnclick(btn,scope.row)">{{typeof btn.name == 'function'?btn.name(scope.row[col.field],scope.row):btn.name}}</el-button>
          </div>
          <div v-else-if="!col.render">
            <div v-if="!col.click">
              <span v-if="col.h5Click && (!col.h5ClickRender || (col.h5ClickRender && col.h5ClickRender(scope.row[col.field],scope.row)))" style="color: #0096dc;cursor: pointer;" @click="btnclick(col,scope.row)">{{scope.row[col.field]}}</span>
              <span v-if="!(col.h5Click && (!col.h5ClickRender ||  (col.h5ClickRender && col.h5ClickRender(scope.row[col.field],scope.row))))">{{scope.row[col.field]}}</span>
            </div>
            <el-button v-if="col.click" v-show="!(typeof col.hidden == 'function'?col.hidden(scope.row,col):col.hidden)" v-auth="col.auth"  @click="btnclick(col,scope.row)" :size="col.size?col.size:'mini'" :type="typeof col.type == 'function'?col.type(scope.row[col.field],scope.row):col.type" :icon="typeof col.icon == 'function'?col.icon(scope.row[col.field],scope.row):col.icon">{{col.field}}</el-button>
          </div>
          <div v-else-if="col.render">
            <div v-if="!col.click && col.h5Click && (!col.h5ClickRender ||  (col.h5ClickRender && col.h5ClickRender(scope.row[col.field],scope.row)))" style="color: #0096dc;cursor: pointer;" v-html="col.render(scope.row[col.field],scope.row)"  @click="btnclick(col,scope.row)"></div>
            <div v-if="!col.click && !(col.h5Click && (!col.h5ClickRender || (col.h5ClickRender && col.h5ClickRender(scope.row[col.field],scope.row))))" v-html="col.render(scope.row[col.field],scope.row)"></div>
            <el-button v-if="col.click" v-show="!(typeof col.hidden == 'function'?col.hidden(scope.row,col):col.hidden)" v-auth="col.auth" :size="col.size?col.size:'mini'"   @click="btnclick(col,scope.row)"  :type="typeof col.type == 'function'?col.type(scope.row[col.field],scope.row):col.type" :icon="typeof col.icon == 'function'?col.icon(scope.row[col.field],scope.row):col.icon"></el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination v-if="pageData.isPage == null || pageData.isPage"
                   @size-change="handleSizeChange"
                   @current-change="handleCurrentChange"
                   :current-page="pageNum"
                   :page-sizes="pageData.pageSizes || [10,50,100,500]"
                   :page-size="pageSize"
                   layout="total, sizes, prev, pager, next, jumper"
                   :total="total">
    </el-pagination>
  </div>
</template>

<script>
    import Qs from 'qs'
    export default {
        props: ["pageData"],
        data() {
            return {
                tableData:[],
                total: this.pageData.size || 10,//初始总数
                pageSize: this.pageData.size || 10,//初始页面条数
                pageNum:1,//当前页
                option:{},
                checkList:[],
            };
        },
        mounted(){
            if (this.pageData.checkList) this.checkList = this.common.copy(this.pageData.checkList);
            //console.log(this.checkList);
        },
        computed:{
            isShow:{
                get(){
                    let showObj = {};
                    for (let i in this.pageData.cols){
                        let title = this.pageData.cols[i].title;
                        if (this.checkList.indexOf(title) > -1) {
                            showObj[title] = 'show';
                        }else{
                            showObj[title] = 'hide';
                        }
                    }
                    return showObj;
                }
            }
        },
        methods: {
            defaultQueryData(option) {
                //点击查询则从首页开始查询
                this.pageNum = 1;
                this.initData(this.pageData.queryUrl, option);
            },
            //用户查询按钮调用
            defaultGetData(option) {
                this.initData(this.pageData.queryUrl, option);
            },
            //用户查询按钮调用
            initData(queryUrl, option) {
                if (!option) option = {};
                this.option = option;
                this.getData(queryUrl, !this.pageData.isPage?{pageNum: this.pageNum, pageSize: this.pageSize}:{});
            },
            //调用后台接口获取数据
            getData(queryUrl, option) {
                option = Object.assign(this.option, option);
                option = option || {};
                if(!this.pageData.method || this.pageData.method == "post"){
                    this.$axios.post(queryUrl, Qs.stringify(option)).then(res => {
                        if(this.pageData.isPage == null || this.pageData.isPage){
                            this.total = Number(res.data.total);
                            this.tableData = res.data.list;
                        }else{
                            this.tableData = res.data;
                        }
                        this.$emit("getTableData",this.tableData);
                    })
                } else if(this.pageData.method == "post-json"){
                    this.$axios.post(queryUrl, option, { headers:{"isAjax": 'true', 'Content-Type': 'application/json' }}).then(res => {
                        if(this.pageData.isPage == null || this.pageData.isPage){
                            this.total = Number(res.data.total);
                            this.tableData = res.data.list;
                        }else{
                            this.tableData = res.data;
                        }
                        this.$emit("getTableData",this.tableData);
                    })
                } else {
                    this.$axios.get(queryUrl, {params:option}).then(res => {
                        if(this.pageData.isPage == null || this.pageData.isPage){
                            this.total = Number(res.data.total);
                            this.tableData = res.data.list;
                        }else{
                            this.tableData = res.data;
                        }
                        this.$emit("getTableData",this.tableData);
                    })

                }
            },
            pageGetData(){
                this.getData(this.pageData.queryUrl, {pageNum: this.pageNum, pageSize: this.pageSize});
            },
            //自定义点击事件(click:事件名)
            btnclick(col,row){
                let clickName = col.click || col.h5Click;
                if (clickName.indexOf("delete") > -1 || col.confirm){
                    this.confirm(col,row);
                }else{
                    this.$emit("btnclick",clickName,JSON.parse(JSON.stringify(row)));
                }
            },
            confirm (col,row) {
                let name = col.field?col.field:((typeof col.name == 'function'?col.name(row[col.field],row):col.name));
                let notice = (!col.notice || col.notice == "")?name:col.notice;
                this.$confirm(window.$t("page.confirm")+ notice +window.$t("page.opertion"), notice , {
                    confirmButtonText: window.$t("page.enter"),
                    cancelButtonText: window.$t("page.cancel"),
                    type: 'warning'
                }).then(() => {
                    this.$emit("btnclick",col.click || col.h5Click,row);
                });
            },
            //多选数据处理
            checkbox(val) {
                this.$emit("checkbox", JSON.parse(JSON.stringify(val)));
            },
            //监听分页条数变化
            handleSizeChange(val) {
                this.pageSize = val;
                this.pageGetData();
            },
            //监听分页页数变化
            handleCurrentChange(val) {
                this.pageNum = val;
                this.pageGetData();
            }
        },
    }
    /* 插件使用说明
   <Page ref="childTable" @checkbox=checkbox :pageData="pageData" @btnclick="btnclick(actName,row)"></Page>
   pageData:初始化数据，btnclick(actName,row){}:获取操作数据按钮actName:事件名称,row选中的数据，checkBox(val){}:获取多选数据
   methods: {
      //用于接收类别中声明的点击事件，clickName（声明的事件名称），row(点击事件携带的对象数据)
      bthClick (clickName, row) {},
      //勾选的数据可以在此处接收到
      checkbox (row) {}
   },
   data(){
       return{
           pageData: {
               queryUrl: "/mis/ValidateCodeLog/pageList",//请求路径和参数
               initOption:{},//初始请求参数，初始化无请求参数的话可以不声明此属性
               //是否开启多选框
               selection: false,
               //是否显示序号
               sequence:true,
               //列表(title:表头名称，file:字段属性名称，render:数据格式化或者做相关的逻辑处理（data:当前字段的值，full:当前数据对象），click:添加点击事件btnclick(col,row)，btnClick：可点击按钮,fixed:固定（elemnet-ui属性），overflow:内容过长隐藏策略),minWidth:最新宽度,show:hide可以因此此列相间在展示
               cols: [
                 {title: "日期", field: "mobilePhone",fixed:false,overflow:true,render:(data,full)=>{
                         return data == 1?"开启":"关闭";
                     }},
                 {title: "名称", field: "id"},
                 {title: "省份", field: "code"},
                 {title: "城市", field: "status"},
                  //单事件操作，按钮样式定义请参考element,click:事件名称（会自动添加点击事件，bthClick事件会自动接收到此事件),auth（按钮权限）field：按钮名称,type:按钮类型(参考element-ui) icon：(按钮图标)参考element-ui,size(按钮大小，参考element-ui)
                 {title:"操作",field:"修改",click:"update",width:150,auth:"",name:"删除"},
                 //多事件操作，name：按钮名称 click：事件名称 type:按钮类型(参考element-ui) icon：(按钮图标)参考element-ui 默认添加点击事件btnclick(col,row){}  click:事件名称，row：当前行的数据  auth:权限，size(按钮大小，参考element-ui)
                 {title:"操作",btnClick:[{name:"删除",auth:"card:bank:update",click:"delete",type:"primary",icon:"el-icon-delete"},{name:"修改",click:"modify",type:"primary",icon: "el-icon-edit"}]},
               ],
           }
       }
   },
   */
</script>

