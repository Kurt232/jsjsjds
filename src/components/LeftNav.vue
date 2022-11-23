<!-- 左侧导航栏组件 -->
<template>
  <el-menu router :default-active="this.$route.path?this.$route.path:miserware" :collapse="collapsed" collapse-transition unique-opened class="el-menu-vertical-demo" background-color="#334157" text-color="#fff" active-text-color="#ffd04b">
    <div class="logobox">
      <img class="logobox__logoimg" src="../assets/images/logo.png" alt="">
    </div>
    <el-menu-item v-for="chmenu in allmenu" :index="'/'+chmenu.url" :key="chmenu.menuid">
          <i class="iconfont" :class="chmenu.icon"></i>
          <span>{{chmenu.menuname}}</span>
    </el-menu-item>
  </el-menu>
</template>

<script>
export default {
  name: 'LeftNav',
  data() {
    return {
      collapsed: false, //类似于v-model，表示这个element是可折叠的
      allmenu: []
    }
  },
  // 创建完毕状态(里面是操作)
  created() {
    let res = {
        success: true,
        data: [
          {
            menuid: 1,
            icon: 'icon-data',
            menuname: '信号强度表',
            url: 'data1',
            menus: null
          },
          {
            menuid: 2,
            icon: 'icon-data',
            menuname: '病例信息表',
            url: 'data2',
            menus: null
          },
          {
            menuid: 3,
            icon: 'icon-data',
            menuname: '药品信息表',
            url: 'data3',
            menus: null
          },{
            menuid: 4,
            icon: 'icon-data',
            menuname: '不良事件表',
            url: 'data4',
            menus: null
          },{
            menuid: 5,
            icon: 'icon-data',
            menuname: '用药目的表',
            url: 'data5',
            menus: null
          },{
            menuid: 6,
            icon: 'icon-data',
            menuname: '病例结果表',
            url: 'data6',
            menus: null
          },{
            menuid: 7,
            icon: 'icon-data',
            menuname: '用户基表',
            url: 'user',
            menus: null
          },
          {
            menuid: 8,
            icon: 'icon-data',
            menuname: '用户详情表',
            url: 'userMessage',
            menus: null
          },{
            menuid: 9,
            icon: 'icon-data',
            menuname: '药品注册表',
            url: 'drugMessage',
            menus: null
          },{
            menuid: 10,
            icon: 'icon-data',
            menuname: '药品关联表',
            url: 'drug',
            menus: null
          },{
            menuid: 11,
            icon: 'icon-data',
            menuname: '反馈记录',
            url: 'log',
            menus: null
          },

        ],
        msg: 'success'
    }
    this.allmenu = res.data,

    // 监听切换显示
    this.$bus.on('toggle', value => {
        this.collapsed = !value
    })
  },
}
</script>

<style lang="scss" scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 2rem;
  min-height: 100vh;
  border:none;
}
.el-menu-vertical-demo.el-menu--collapse {
  border:none;
  text-align: left;
}
.el-menu-bg {
  background-color: #1f2d3d !important;
}
.iconfont{
  font-size: .18rem;
  margin-right: .1rem;
  color:#909399;
}
.logobox {
  height: 0.8rem;
  line-height: 0.8rem;
  color: #9d9d9d;
  text-align: center;
  padding: 0.2rem 0;
  &__logoimg {
    height: 0.4rem;
  }
}
</style>
