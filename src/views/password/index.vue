<template>
    <div>
        {{user.username}}
        <el-button type="info" @click="formShow=true">修改密码</el-button>
        <el-button type="info" @click="logout()">退出登录</el-button>
        <el-dialog title="更改密码" :visible.sync="formShow" width="40%">
            <el-form :model="form" class="demo-form-inline">
                <el-form-item label="原始密码">
                    <el-input type="password" v-model="form.oldPassword" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="新密码">
                    <el-input type="password" v-model="form.newPassword" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="确认密码">
                    <el-input type="password" v-model="form.confirmPassword" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submit()">提交</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
    import {mapState} from 'vuex'
    import base from "@/base"
    import router from '@/router'
    import store from '@/store'
    export default {
        computed: {
            ...mapState(['user']),
        },
        data() {
            return {
                form: {},
                formShow:false
            };
        },
        methods: {
            submit(){
                if (this.form.confirmPassword != this.form.newPassword) {
                    this.$alert('确认密码和新密码不一致', '修改操作', {
                        confirmButtonText: '确定',
                    });
                    return;
                }
                var readyData=this.$qs.stringify(this.form);
                this.axios.post(base.baseURI.base+"/mis/user/modifyPassword",readyData).then(
                    res => {
                        if (res.status == 200 && res.data.code == 200) {
                            this.formShow = false;
                            this.$alert('修改成功', '修改操作', {
                                confirmButtonText: '确定',
                            });
                        }
                    }
                );
            },
            logout(){
                this.axios.get(base.baseURI.base+"/mis/user/logout").then(
                    res => {
                        if (res.status == 200 && res.data.code == 200) {
                            this.$store.dispatch("setUser",{});
                            router.push('/login');
                        }else{
                            this.$alert(res.data.code_desc, '修改操作', {
                                confirmButtonText: '确定',
                            });
                        }
                    }
                );
            }
        }
    };
</script>

