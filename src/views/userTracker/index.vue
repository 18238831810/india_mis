<template>
    <div>
        <el-form :inline="true" class="demo-form-inline">
            <el-form-item label="会员账号">
                <el-input v-model="tracker.loginname"  placeholder="会员账号(忽略时间)"></el-input>
            </el-form-item>
            <el-form-item label="手机">
                <el-input v-model="tracker.phone" placeholder="手机(忽略时间)"></el-input>
            </el-form-item>
            <el-form-item label="开始时间">
                <el-date-picker type="datetime" value-format="timestamp" placeholder="开始时间" v-model="tracker.startDate"
                                style="width: 100%;"></el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间">
                <el-date-picker type="datetime" value-format="timestamp" placeholder="结束时间" v-model="tracker.endDate"
                                style="width: 100%;"></el-date-picker>
            </el-form-item>
            <el-form-item label="来源url">
                <el-input v-model="tracker.href" placeholder="来源url"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button @click="initData()" type="primary" icon="el-icon-search">查询</el-button>
            </el-form-item>
        </el-form>

        <TablePage ref="childTable" :pageData="pageData"></TablePage>
    </div>
</template>

<script>
    import base from "@/base"
    import TablePage from '@/components/TablePage.vue'
    import moment from 'moment'
    export default {
        components: {TablePage},
        methods: {
            //查询按钮
            initData() {
                this.$refs.childTable.initData(this.pageData.queryUrl, this.tracker);
            },

        },
        data() {
            return {
                tracker: {},
                pageData: {
                    queryUrl: base.baseURI.base+"/mis/tracker/queryPage",
                    //是否开启多选框
                    selection: false,
                    //是否显示序号
                    sequence: true,
                    cols: [
                        {title:"会员账号",checked:true,field: 'loginname',width:"150px"},
                        {title:"电话",checked:true,field: 'phone',width:"150px"},
                        {title:"distinct_id",checked:true,field: 'distinct_id'},
                        {title:"身份证",checked:false,field: 'idCard'},
                        {title:"开户日期",checked:true,field: 'createdDate',width:'200px',render(data,full){
                                return moment(new Date(data)).format('YYYY-MM-DD HH:mm:ss');
                            }},
                        {title:"来源url",checked:true,field: 'href'},
                        {title:"来源",checked:true,field: 'utm_source'},
                        {title:"媒介",checked:true,field: 'utm_medium'},
                        {title:"广告系列",checked:true,field: 'utm_campaign'},
                        {title:"广告组",checked:true,field: 'utm_content'},
                        {title:"关键字",checked:true,field: 'utm_term'},
                        {title:"开户来源",checked:true,field: 'channel'},
                        {title:"IP地址",checked:true,field: 'ip'},
                        {title:"浏览器",checked:true,field: 'userAgent'},
                        {label:"备注",checked:true,field: 'remark'}
                    ],
                    //接收请求返回数据
                    tableData: [],
                }
            }
        },
    }
</script>

