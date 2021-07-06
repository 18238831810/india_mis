<template>
    <div>
        <el-form :inline="true" class="demo-form-inline">
            <el-form-item label="用户名">
                <el-input v-model="user.username" placeholder="用户名"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button @click="initData()" type="primary" icon="el-icon-search" v-auth="14">查询</el-button>
            </el-form-item>
            <el-form-item>
                <el-button @click="addUser()" type="primary" icon="el-icon-plus" v-auth="16">添加</el-button>
            </el-form-item>
        </el-form>
        <TablePage ref="childTable" :pageData="pageData" @clickButton="clickButton"></TablePage>
        <add :fromShow="fromShow" :formData="formData" @fromStatus="fromStatus" @initData="initData"></add>
    </div>
</template>

<script>
    import TablePage from '@/components/TablePage.vue'
    import add from '@/views/user/add.vue'
    import base from "@/base"
    export default {
        components: {TablePage, add},
        methods: {
            //查询按钮
            initData() {
                this.$refs.childTable.initData(this.pageData.queryUrl, this.user);
            },
            fromStatus(status) {
                this.fromShow = status;
                if (!status) this.formData = {rid:""};
            },
            addUser(){
                this.fromStatus(true);
            },
            clickButton(row, act) {
                if (act == 1){
                    //编辑
                    this.formData = JSON.parse(JSON.stringify(this.pageData.tableData[row.$index]));
                    this.fromShow = true;
                } else if(act == 2){
                    //删除
                    const id = row.row.id;
                    this.axios.get(base.baseURI.base+"/mis/user/del/"+id).then( res => {
                        if (res.status == 200 && res.data.code == 200){
                            this.initData();
                            this.$alert('删除成功', '删除操作', {
                                confirmButtonText: '确定',
                            });
                        }
                        else this.$alert('删除失败:'+res.data.code_desc, '删除操作', {
                            confirmButtonText: '确定',
                        });
                    });
                }
            },
        },
        data() {
            return {
                user: {},
                formData:{rid:""},
                fromShow: false,
                pageData: {
                    queryUrl: base.baseURI.base+"/mis/user/queryPage",
                    //是否开启多选框
                    selection: false,
                    //是否显示序号
                    sequence: true,
                    cols: [
                        {title:"操作",field:"编辑",action:true,act:1,icon:"el-icon-edit",auth:17},
                        {title:"操作",field:"删除",action:true,act:2,icon:"el-icon-delete",auth:25},
                        {field:"username",title:"用户名"},
                        {field:"roleNames",title:"角色"},
                        {field:"phone",title:"电话"},
                        {field:"email",title:"邮件"},
                        {field:"text",title:"备注"}
                    ],
                    //接收请求返回数据
                    tableData: [],
                }
            }
        },
    }
</script>

