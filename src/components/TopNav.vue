<!-- 顶部导航栏组件 -->
<template>
  <el-menu class="el-menu-demo" mode="horizontal" background-color="#334157" text-color="#fff" active-text-color="#fff">
    <div class="buttonimg">
      <img class="showimg" :src="collapsed?imgClose:imgOpen" @click="toggle(collapsed)">
    </div>
    <el-sub-menu index="1" class="submenu">
      <template v-slot:title>
        <i class="iconfont icon-xitongguanliyuan"></i>
        <span>超级管理员</span>
      </template>
      <el-menu-item @click="content()" index="1-1">
        <i class="iconfont icon-shezhi"></i>
        <span>设置</span>
      </el-menu-item>
      <el-menu-item @click="content()" index="1-2">
        <i class="iconfont icon-gerenzhongxin"></i>
        <span>个人中心</span>
      </el-menu-item>
      <el-menu-item @click="exit()" index="1-3">
        <i class="iconfont icon-tuichu"></i>
        <span>退出</span>
      </el-menu-item>
    </el-sub-menu>
  </el-menu>
</template>
<script>
import { useRouter } from 'vue-router'
//import {post} from '../utils/request';
import { ElMessage } from "element-plus";
import { localStorage } from '@/store/index'

export default {
  name: 'TopNav',
  data() {
    return {
      collapsed: true,
      imgClose: require('../assets/images/menuClose.png'),
      imgOpen: require('../assets/images/menuOpen.png'),
      user: {}
    }
  },
  setup() {
    const router = useRouter()
    const handleLogout = async() => {
      try{
        localStorage.isLogin = false
        router.replace({ name: 'LoginView'})
          // const result = await post(`/user/login/loginout`)
          // if (result?.msg === "登出成功") {
          //   ElMessage.success("已成功退出！");
          //   localStorage.removeItem('isLogin')
          // router.replace({ name: 'LoginView'})
          // }else{
          //   ElMessage.error("请重试！");
          // }
      }catch{
          ElMessage.error("请重试！");
      }
    }
    return { handleLogout }
  },
  methods: {
    //设置、个人中心未开发的提示
    content(){
      this.$confirm('功能尚未开发，敬请期待！', '提示', {
        confirmButtonText: '确定',
        showCancelButton: false,
        type: 'warning'
      }).catch(()=>{})//记得要catch
    },
    // 退出登录
    exit() {
      this.$confirm('退出登录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.handleLogout();
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
    // 触发切换显示
    toggle(showtype) {
      this.collapsed = !showtype
      this.$bus.emit('toggle', this.collapsed)
    }
  },
}
</script>
<style lang="scss">
.el-menu-vertical-demo:not(.el-menu--collapse) {
  border: none;
}
.el-menu--collapse .el-menu .el-submenu, .el-menu--popup{
  min-width: 1rem !important;
  position:absolute;
  float: right;
  right: -1.2rem;
}
.el-menu--horizontal>.el-sub-menu .el-sub-menu__title:hover{
  background-color: #293446 !important;
}
.el-menu--horizontal>.el-sub-menu .el-sub-menu__title{
  height: .6rem;
  border:0;
}
.el-menu--horizontal>.el-sub-menu.is-active .el-sub-menu__title {
  border:0;
}
.submenu{
  width:1.6rem;
  position:absolute;
  float: right;
  right:0;
}
.buttonimg {
  height: .6rem;
  width:.6rem;
  background-color: transparent;
  border: none;
  cursor: pointer;
}
.buttonimg:hover{
  background-color:#293446;
}
.iconfont{
  font-size: .18rem;
  margin-right: .1rem;
  color:#909399 !important;
}
.showimg {
  width: .26rem;
  height: .26rem;
  position: absolute;
  top: .17rem;
  left: .17rem;
}
.showimg:active {
  border: none;
}
</style>
