<template>
    <div>
        <el-table :data="tableDatas" border style="width: 100%" @selection-change="handleSelectionChange">
            <!--多选-->
            <el-table-column label="全选" v-if="pageData.selection" type="selection" width="80px"></el-table-column>
            <!--序号-->
            <el-table-column label="序号" v-if="pageData.sequence" type="index" width="80px"></el-table-column>
            <!--操作按钮-->
            <el-table-column v-for="col in pageData.cols" v-if="col.action" label="操作" :width="col.width">
                <template slot-scope="scope">
                    <el-button @click="handleClick(scope,col.act)" :class="col.class" type="primary" v-auth="col.auth" :icon="col.icon">{{col.field}}</el-button>
                </template>
            </el-table-column>
            <!--列表数据-->
            <el-table-column v-for="col in pageData.cols" v-if="!col.action" :prop="col.field" :label="col.title"
                             :width="col.width"></el-table-column>
        </el-table>

        <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="1"
                :page-sizes="[10, 20, 30, 40, 50, 60, 100, 500]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
        </el-pagination>
    </div>
</template>

<script>
    /* 插件使用说明
    <Page ref="childTable" :pageData="pageData" @clickButton="clickButton" @checkBox="checkBox"></Page>
    pageData:初始化数据，clickButton(){}:获取操作数据按钮，checkBox(){}:获取多选数据
    data(){
        return{
            pageData: {
                queryUrl: "/mis/ValidateCodeLog/pageList",//请求路径和参数
                    //是否开启多选框
                    selection: false,
                    //是否显示序号
                    sequence:true,
                    //列表
                    cols: [
                    {title: "日期", file: "mobilePhone",render(data,full){
                            return full.mobilePhone;
                        }},
                    {title: "名称", file: "id"},
                    {title: "省份", file: "code"},
                    {title: "城市", file: "status"},
                     //按钮样式定义请参考element文档，也可自己修改本插件auth:权限id
                    {field:"修改",title:"操作",action:true,act:1,width:150,icon:"el-icon-edit",auth:19}
                ],
                    //接收请求返回数据
                    tableData: [],
            }
        }
    },
    methods: {
            //按钮事件需定义，row点击数据，act定义的事件类型
            clickButton(row, act) {
                console.log(row);
            },
            //多选框需定义（用来接收选中的数组数据）
            checkBox(val) {
                console.log(val);
            },
            //查询按钮
            initData(){
                this.$refs.childTable.initData(this.pageData.queryUrl,option);
            }
        },
    */
    export default {
        props: ["pageData"],
        //初始化数据
        created() {
            this.initData(this.pageData.queryUrl);
        },
        computed: {
            //监控数据变化
            tableDatas() {
                //深度拷贝
                const copy = JSON.parse(JSON.stringify(this.pageData.tableData));
                for (var i in this.pageData.cols) {
                    if (this.pageData.cols[i].render) {
                        for (var j in copy) {
                            copy[j][this.pageData.cols[i].field] = this.pageData.cols[i].render(copy[j][this.pageData.cols[i].field], copy[j]);
                        }
                    }
                }
                return copy;
            },
        },
        data() {
            return {
                total: 10,//初始总数
                pageSize: 10,//初始页面条数
            };
        },
        methods: {
            //用户查询按钮调用
            initData(queryUrl,option) {
                if (!option) option = {};
                option = Object.assign(option,{start:0,length:10});
                this.getData(queryUrl,option);
            },
            //调用后台接口获取数据
            getData(queryUrl,option) {
                this.axios.get(queryUrl,{params:(option||{})}).then(res => {
                        this.total = res.data.recordsTotal;
                        this.pageData.tableData = res.data.data;
                    }
                );
            },
            //点击按钮处理
            handleClick(row, act) {
                this.$emit("clickButton",row,act); /*this.clickButton(row, act);*/
            },
            //多选数据处理
            handleSelectionChange(val) {
                this.$emit("checkBox",val);
            },
            //监听分页条数变化
            handleSizeChange(val) {
                this.getData(this.pageData.queryUrl,{start:0,length:val});
            },
            //监听分页页数变化
            handleCurrentChange(val) {
                this.getData(this.pageData.queryUrl,{start:(val - 1) * this.pageSize,length:this.pageSize});
            }
        },
    }
</script>

