<template>
    <div>
        <el-form :inline="true" class="demo-form-inline">
            <el-form-item>
                <router-link to="/home/role/index"><el-button  type="primary" icon="el-icon-search">返回列表</el-button></router-link>
            </el-form-item>
            <el-form-item>
                <el-button  type="primary" icon="el-icon-plus" @click="submit()">提交</el-button>
            </el-form-item>
        </el-form>
        <el-form label-position="left"  class="demo-form-inline">
            <el-form-item label="角色名">
                <el-input v-model="role.name" placeholder="角色名" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="备注">
                <el-input v-model="role.text" placeholder="备注" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="管理员">
                <el-checkbox v-model="role.roleType" :true-label="1|toNumber" :false-label="0|toNumber"></el-checkbox>
            </el-form-item>
            <div v-if="role.roleType == 0"><span>功能权限</span>
                <el-tree
                        :data="menuList"
                        show-checkbox
                        default-expand-all
                        :default-checked-keys="checkedKeys"
                        node-key="id"
                        ref="tree"
                        highlight-current
                        :props="defaultProps">
                </el-tree>
            </div>
        </el-form>
    </div>
</template>

<script>
    import base from '@/base'
    import util from "@/utils/datautil"
    import {mapState} from "vuex"

    export default {
        computed: {
            ...mapState(['menus','user'])
        },
        data() {
            return {
                role:{roleType:1},
                menuList: [],
                checkedKeys:[],
                defaultProps: {
                    children: 'children',
                    label: 'name'
                }
            };
        },
        filters:{
           toNumber(val){
               return parseInt(val);
           }
        },
        methods: {
            submit() {
                this.role.updatedUser = this.user.username;
                if (!this.role.createdUser)  this.role.createdUser = this.user.username;
                this.role.updatedDate = new Date().getTime();
                if (!this.role.createdDate)  this.role.createdDate = this.role.updatedDate;
                //选中的菜单
                if (this.role.roleType == 0){
                    const keys = this.$refs.tree.getCheckedKeys();
                    this.role.menuId = keys.join(",");
                }
                var readyData=this.$qs.stringify(this.role);
                axios.post(base.baseURI.base+"/mis/role/edit",readyData).then( res => {
                    if (res.status == 200 && res.data.code == 200){
                        this.$alert('操作失败', res.data.code_desc , {
                            confirmButtonText: '确定',
                        });
                    }else{
                        this.$alert('操作失败', res.data.code_desc , {
                            confirmButtonText: '确定',
                        });
                    }
                })
            }
        },
        mounted() {
            this.menuList = util.buildTreeArr(this.menus, "id", "parentid", "children");
            if(this.$route.query.id){
                //更新数据
                this.axios.get(base.baseURI.base+"/mis/role/getById?id="+this.$route.query.id).then( res => {
                    console.log(res);
                    if (res.status === 200) {
                        this.role = res.data.role;
                        this.checkedKeys = res.data.rel;
                    }
                })
            }
        }
    };
</script>



