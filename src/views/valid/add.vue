<template>
    <el-dialog title="生成验证码" :visible.sync="dialogFormVisible" width="40%">
        <el-form :inline="true" :model="form" class="demo-form-inline">
            <el-form-item label="手机号码">
                <el-input v-model="form.mobilePhone" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="验证码">
                <el-input v-model="form.code"  autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submit()">生成</el-button>
            </el-form-item>
            <el-form-item>
                <el-button @click="dialogFormVisible=false">取 消</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>

<script>
    import base from "@/base"
    export default {
        props: ["fromShow"],
        computed: {
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
                form: {},
            };
        },
        methods: {
            random(_idx){
                var str = '';
                for(var i = 0; i < _idx; i++){
                    str += Math.floor(Math.random() * 10);
                }
                return str;
            },
            submit(){
                this.form.code = this.random(4);
                this.$forceUpdate();//强制及时渲染
                var readyData=this.$qs.stringify(this.form);
                this.axios.post(base.baseURI.base+"/mis/valid/add",readyData).then(
                    res => {
                        if (res.status == 200 && res.data.code == 200) {
                            this.$emit("initData");
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



