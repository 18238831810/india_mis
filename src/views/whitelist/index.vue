<template>
    <div>
        <el-form :inline="true" class="demo-form-inline">
            <el-form-item label="身份证号">
                <el-input v-model="white.idNumber" placeholder="手机号码"></el-input>
            </el-form-item>
            <el-form-item label="手机号码">
                <el-input v-model="white.phone" placeholder="电话"></el-input>
            </el-form-item>
            <el-form-item label="邮箱地址">
                <el-input v-model="white.ip" placeholder="IP地址"></el-input>
            </el-form-item>

            <el-form-item>
                <el-button @click="initData()" type="primary" icon="el-icon-search">查询</el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-plus" @click="fromShow=true">添加</el-button>
            </el-form-item>
        </el-form>

        <TablePage ref="childTable" :pageData="pageData" @clickButton="clickButton"></TablePage>

        <add :fromShow="fromShow" :formData="formData" @fromStatus="fromStatus" @initData="initData"></add>
    </div>
</template>

<script>
    import TablePage from '@/components/TablePage.vue'
    import moment from 'moment'
    import add from '@/views/whitelist/add.vue'
    import base from '@/base'
    export default {
        components: {TablePage,add},
        methods: {
            fromStatus(status) {
                this.fromShow = status;
                if (!status) this.formData = {};
            },
            //查询按钮
            initData() {
                this.$refs.childTable.initData(this.pageData.queryUrl, this.white);
            },
            //按钮事件需定义，row点击数据，act定义的事件类型
            clickButton(row, act) {
                if (act === 1){
                    //修改
                    this.formData = JSON.parse(JSON.stringify(this.pageData.tableData[row.$index]));
                    this.fromShow = true;
                }else if (act === 2){
                    //删除
                    const  id = row.row.id;
                    const url = base.baseURI.base+"/mis/whitelist/delete?id="+id;
                    this.axios.get(url).then(res =>{
                        if (res.status === 200 && res.data.code === 200) {
                            this.initData();
                            this.$alert('删除成功', '删除操作', {
                                confirmButtonText: '确定',
                            });
                        }
                        else this.$alert('删除失败:'+res.data.code_desc, '删除操作', {
                            confirmButtonText: '确定',
                        });
                    })
                }
            },
        },
        data() {
            return {
                formData:{},
                white: {},
                fromShow: false,
                pageData: {
                    queryUrl: base.baseURI.base+"/mis/whitelist/queryPage",
                    //是否开启多选框
                    selection: false,
                    //是否显示序号
                    sequence: true,
                    cols: [
                        {field:"修改",title:"操作",action:true,act:1,width:150,icon:"el-icon-edit"},
                        {field:"删除",title:"操作",action:true,act:2,width:150,icon:"el-icon-delete"},
                        {field: "phone", title: "电话"},
                        {field: "idNumber", title: "身份证号"},
                        {field: "email", title: "邮箱"},
                        {field: "status", title: "是否启用", render: function (data, type, full, callback) {
                                if (data === 1) {
                                    return "启用"
                                }
                                return "禁用"
                            }
                        },
                        {field: "updateTime", title: "修改时间",
                            "render": function (data, type, full, callback) {
                                return moment(data).format("YYYY-MM-DD HH:mm:ss");
                            }
                        },
                        {field: "createTime", title: "创建时间",
                            "render": function (data, type, full, callback) {
                                return moment(data).format("YYYY-MM-DD HH:mm:ss");
                            }
                        },
                        {field: "ip", title: "IP地址"},
                        {field: "remark", title: "备注"}
                    ],
                    //接收请求返回数据
                    tableData: [],
                }
            }
        },
    }
</script>

