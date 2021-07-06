<template>
    <el-container style="height: 800px;width:100%; border: 1px solid #eee">
        <el-main>
            <div style="height: 600px;width:300px;margin: 0 auto">
                <el-form :model="login">
                    <el-form-item label="用户">
                        <el-input v-model="login.userName" placeholder="用户"></el-input>
                    </el-form-item>
                    <el-form-item label="密码">
                        <el-input v-model="login.password" placeholder="密码"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="toLogin()">登录</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-main>
    </el-container>
</template>

<script>
    import base from '@/base'
    import {mapState} from 'vuex'
    export default {
        computed:{
            ...mapState(['user'])
        },
        data(){
            return{
                login:{}
            }
        },
        methods: {
            toLogin() {
                const readyData=this.$qs.stringify(this.login);
                this.axios.post(base.baseURI.base+"/public/user/login", readyData).then(res => {
                    if (res.code == 0) {
                        //登录成功,设置user并跳转到主页面
                        this.$store.dispatch("setUser",res.data);
                        this.$router.push("/home");
                    }else{
                        this.$alert(res.msg, '登录操作', {
                            confirmButtonText: '确定',
                        });
                    }
                })
            }
        },
    }
</script>

