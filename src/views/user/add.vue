<template>
    <el-dialog title="用户管理-设置" :visible.sync="dialogFormVisible" width="40%">

        <el-form  :model="form" class="demo-form-inline">
            <el-form-item label="用户名">
                <el-input v-model="form.username" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="电话">
                <el-input v-model="form.phone" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="邮箱">
                <el-input v-model="form.email" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="密码">
                <el-input v-model="form.password" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="角色">
                <el-select v-model="rids" multiple>
                    <el-option v-for="role in rolesList"  :label="role.name" :value="role.id" :key="role.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="备注">
                <el-input v-model="form.text" autocomplete="off"></el-input>
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
        props: ["fromShow",'formData','fromStatus'],
        filters:{
          toString(val){
              return JSON.stringify(val);
          }
        },
        computed: {
            rids:{
                get(){
                    const rid = this.formData.rid;
                    if (rid == null || rid == "") return [];
                    else return rid.split(",").filter(rid => rid != "").map(rid => parseInt(rid));
                },
                set(val){
                    this.form.rid = val.join(",");
                }
            },
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
                rolesList:[],
            };
        },
        methods: {
            submit(){
                var readyData=this.$qs.stringify(this.form);
                this.axios.post(base.baseURI.base+"/mis/user/edit",readyData).then(
                    res => {
                        if (res.status == 200 && res.data.code == 200) {
                            this.$emit("initData");
                            this.dialogFormVisible = false;
                            this.$alert('操作成功', '编辑操作', {
                                confirmButtonText: '确定',
                            });
                        }else this.$alert('操作失败:'+res.data.code_desc, '操作', {
                            confirmButtonText: '确定',
                        })
                    }
                );
            }
        },
        mounted() {
            this.axios.get(base.baseURI.base+"/mis/role/list").then(res => {
                if (res.status == 200 && res.data.code == 200) this.rolesList = res.data.data;
            });
        }
    };
</script>



