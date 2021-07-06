<template>
    <div>
        <el-form :inline="true" class="demo-form-inline">
            <el-form-item label="开始时间">
                <el-date-picker type="datetime" placeholder="开始时间" v-model="validLog.startDate"
                                style="width: 100%;"></el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间">
                <el-date-picker type="datetime" placeholder="结束时间" v-model="validLog.endDate"
                                style="width: 100%;"></el-date-picker>
            </el-form-item>
            <el-form-item label="手机号码">
                <el-input v-model="validLog.mobilePhone" placeholder="手机号码"></el-input>
            </el-form-item>
            <el-form-item label="邮箱地址">
                <el-input v-model="validLog.email" placeholder="邮箱地址"></el-input>
            </el-form-item>
            <el-form-item label="验证码状态">
                <el-select v-model="validLog.codeStatus" placeholder="验证码状态">
                    <el-option v-for="(value,key) in codeStatus" :label="value" :value="key"></el-option>
                </el-select>
            </el-form-item>
        </el-form>

        <el-form :inline="true" class="demo-form-inline">
            <el-form-item>
                <el-button type="primary" icon="el-icon-plus" @click="fromShow=true">新增验证码</el-button>
            </el-form-item>
            <el-form-item>
                <el-button @click="initData()" type="primary" v-auth="14" icon="el-icon-search">查询</el-button>
            </el-form-item>
            <el-form-item>
                <el-button @click="download()" type="primary" v-auth="35" icon="el-icon-download">下载</el-button>
            </el-form-item>
        </el-form>
        <TablePage ref="childTable" :pageData="pageData"></TablePage>
        <add :fromShow="fromShow" @fromStatus="fromStatus" @initData="initData"></add>
    </div>
</template>

<script>
    import TablePage from '@/components/TablePage.vue'
    import add from '@/views/valid/add.vue'
    import moment from 'moment'
    import util from "@/utils/datautil"
    import base from "@/base"
    export default {
        components: {TablePage, add},
        methods: {
            //查询按钮
            initData() {
                this.$refs.childTable.initData(this.pageData.queryUrl, this.validLog);
            },
            fromStatus(status) {
                this.fromShow = status;
            },
            download(){
                window.location = base.baseURI.base+"/mis/valid/download";
            }
        },
        data() {
            return {
                validLog: {},
                codeStatus:util.validlog.codeStatus,
                fromShow: false,
                pageData: {
                    queryUrl: base.baseURI.base+"/mis/valid/queryPage",
                    //是否开启多选框
                    selection: false,
                    //是否显示序号
                    sequence: true,
                    cols: [
                        {field: "code", title: "验证码"}
                        , {
                            field: "mobilePhone", title: "手机号码", width: 200, render(data, full) {
                                if (data == null) return "";
                                const reg = new RegExp("(\\d{3})(\\d{4})(\\d{4})");
                                return data.replace(reg, "$1****$3");
                            }
                        }
                        , {field: "codeStatus", title: "状态",render(data, full){
                                return util.validlog.codeStatus[data] || "";
                            }}
                        , {field: "receiveTunnel", title: "接收方式"}
                        , {field: "email", title: "邮箱"}
                        , {field: "smsTunnel", title: "验证码通道",render(data, full){
                                return  util.validlog.smsTunnel[data] || "";
                            }}
                        , {
                            field: "createdDate", title: "建立时间", width: 200, render(data, full){
                                return moment(new Date(data)).format('YYYY-MM-DD HH:mm:ss');
                            }
                        }
                        , {
                            field: "updatedDate", title: "最后更新时间", width: 200, render(data, full) {
                                return moment(new Date(data)).format('YYYY-MM-DD HH:mm:ss');
                            }
                        }
                        , {field: "remark", title: "备注"}
                    ],
                    //接收请求返回数据
                    tableData: [],
                }
            }
        },
    }
</script>

