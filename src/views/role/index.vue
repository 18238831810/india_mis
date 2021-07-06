<template>
    <div>
        <el-form :inline="true" class="demo-form-inline">
            <el-form-item label="用户名">
                <el-input v-model="role.name" placeholder="用户名"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button @click="initData()" type="primary" icon="el-icon-search" v-auth="15">查询</el-button>
            </el-form-item>
            <el-form-item>
                <router-link to="/home/role/edit"><el-button type="primary" icon="el-icon-plus" v-auth="18">添加</el-button></router-link>
            </el-form-item>
        </el-form>
        <TablePage ref="childTable" :pageData="pageData" @clickButton="clickButton"></TablePage>
    </div>
</template>

<script>
    import TablePage from '@/components/TablePage.vue'
    import base from "@/base"
    import moment  from "moment"
    export default {
        components: {TablePage},
        methods: {
            //查询按钮
            initData() {
                this.$refs.childTable.initData(this.pageData.queryUrl, this.role);
            },
            clickButton(row, act) {
                this.$router.push("/home/role/edit?id="+row.row.id);
            },
        },
        data() {
            return {
                role: {},
                pageData: {
                    queryUrl: base.baseURI.base+"/mis/role/queryPage",
                    //是否开启多选框
                    selection: false,
                    //是否显示序号
                    sequence: true,
                    cols: [
                        {title:"操作",field:"编辑",action:true,act:1,icon:"el-icon-edit",auth:19},
                        {field:"name",title:"角色名"},
                        {field:"text",title:"备注"},
                        {field:"updatedDate",title:"最后更新时间","render":function(data,full) {
                                return moment(new Date(data)).format("YYYY-MM-DD HH:mm:ss");
                            }},
                        {field:"updatedUser",title:"更新人"}
                    ],
                    //接收请求返回数据
                    tableData: [],
                }
            }
        },
    }
</script>

