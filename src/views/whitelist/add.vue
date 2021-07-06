<template>
    <el-dialog title="白名单编辑" :visible.sync="dialogFormVisible" width="40%">
        <el-form  :model="form" class="demo-form-inline">
            <el-form-item label="身份证号">
                <el-input v-model="form.idNumber" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="电话">
                <el-input v-model="form.phone" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="邮箱">
                <el-input v-model="form.email" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="IP地址">
                <el-input v-model="form.ip" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="是否启用">
                <el-select v-model="form.status">
                    <el-option v-for="(value,key) in statusData" :key="value"  :label="key" :value="value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="备注">
                <el-input v-model="form.remark" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submit()">提交</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>

<script>
    import base from '@/base'
    export default {
        props: ["fromShow",'formData'],
        computed: {
            form:{
                get() {
                    return this.formData;
                },
            },
            dialogFormVisible: {
                get() {
                    return this.fromShow;
                },
                set(val) {
                    this.$emit("fromStatus", val);
                }
            }
        },
        data() {
            return {
                statusData:{"是":1,"否":0}
            };
        },
        methods: {
            submit(){
                var readyData=this.$qs.stringify(this.form);
                this.axios.post(base.baseURI.base+"/mis/whitelist/edit",readyData).then(
                    res => {
                        if (res.status == 200 && res.data.code == 200) {
                            this.$emit("initData");
                            this.dialogFormVisible = false;
                            this.$alert('添加成功', '添加操作', {
                                confirmButtonText: '确定',
                            });
                        }else{
                            this.$alert('操作失败', res.data.code_desc , {
                                confirmButtonText: '确定',
                            });
                        }
                    }
                );
            }
        }
    };
</script>



