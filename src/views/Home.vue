<template>
    <el-container style="height: 800px;width:100%; border: 1px solid #eee">
        <el-header>
            <password></password>
        </el-header>
        <el-container>
            <el-aside width="200px" style="background-color: rgb(238, 241, 246)" mode="horizontal">
                <el-menu  :unique-opened="uniqueOpened">
                    <el-submenu v-for="parent in menus" :key="parent.id" v-if="parent.parentId == 0" :index="parent.id | toString">
                        <template slot="title"><i class="el-icon-menu"></i>{{parent.name}}</template>
                        <el-submenu v-for="menu in menus" :key="menu.id" v-if="menu.parentId == parent.id && menu.url == '#'"
                                    :index="menu.id | toString">
                            <template slot="title"><i class="el-icon-menu"></i>{{menu.name}}</template>
                            <router-link :to="child.url" v-for="child in menus" :key="child.id"
                                         v-if="child.parentId == menu.id && child.type == 0">
                                <el-menu-item :index="child.id | toString"><i class="el-icon-edit-outline"></i>{{child.name}}
                                </el-menu-item>
                            </router-link>
                        </el-submenu>

                        <router-link :to="menu.url" v-for="menu in menus" :key="menu.id" v-if="menu.parentId == parent.id && menu.url != '#'">
                            <el-menu-item :index="menu.id | toString"><i class="el-icon-edit-outline"></i>{{menu.name}}
                            </el-menu-item>
                        </router-link>
                    </el-submenu>
                </el-menu>
            </el-aside>

            <el-main><router-view></router-view></el-main>

        </el-container>
    </el-container>
</template>

<script>
    import base from '@/base'
    import {mapState} from 'vuex'
    import storageUtil from '@/utils/storageUtil'
    import password from '@/views/password/index.vue'
    export default {
        components: {password},
        computed: {
            ...mapState(['menus'])
        },
        methods:{
            fromStatus(val){
                this.fromShow = val;
            }
        },
        data() {
            return {
                uniqueOpened: true,
                fromShow:false
            }
        },
        mounted() {
            if (this.menus.length == 0){
                this.axios.get(base.baseURI.base+"/admin/menu/queryAllMenu").then(res => {
                        if (res.code == 0) {
                            this.$store.dispatch('setMenus', res.data);
                        }
                    }
                )
            }
        },
        filters: {
            toString(number) {
                return JSON.stringify(number);
            }
        },
    }
</script>

