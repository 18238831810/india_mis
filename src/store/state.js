/*
状态对象模块
 */
import storageUtil from '@/utils/storageUtil'
export default {
  menus:[],
  user:storageUtil.readUser()
}
