<template>
<div class="bgContainer">
  <div class="wrapper">
    <div class="wrapper__logintext">
        <h2>管理系统</h2>
    </div>
    <div class="wrapper__input">
        <el-form ref="form" :model="form" :rules="rules">
          <el-form-item prop="userId">
            <el-input
              v-model.number="form.userId"
              clearable
              placeholder="请输入账号"
            ></el-input>
          </el-form-item>
          <el-form-item prop="passWord">
            <el-input
              v-model="form.passWord"
              clearable
              placeholder="请输入密码"
              show-passWord
            ></el-input>
          </el-form-item>
        </el-form>
    </div>
    <div class="wrapper__tool">
        <div class="wrapper__tool__remenberTool">
          <el-checkbox v-model="checked" @change="remenber" style="color:#fff;">记住密码</el-checkbox>
        </div>
        <div class="wrapper__tool__forgetpasTool" @click="forgetpas">忘记密码？</div>
    </div>
    <div class="wrapper__login-button" @click=handleLogin(form)>登录</div>
    <div class="wrapper__login-link" @click="handleRegisterClick">立即注册</div>
  </div>
</div>
</template>

<script>
import router from '@/router'
import {localStorage} from '@/store/index'
//import {post} from '../../utils/request';

export default {
  name: 'LoginView',
  data(){
    return{
      form: {
        userId: "",
        passWord: "",
      },
      rules: {
        userId: [{ required: true, message: "请输入账号", trigger: "blur" },{ type:'number',message:'必须是数字',trigger: 'blur' }],
        passWord: [{ required: true, message: "请输入密码", trigger: "blur" },],
      },
      checked: false,
    }
  },
  methods:{
    async handleLogin(form){
      console.log(form)
      localStorage.isLogin = true
      // 在登录之后，通过路由实例跳转
      setTimeout(()=>{
        router.push({name:'data1'})
      }, 500)
      // try{
      //   let result='';
      //   let submitData = {
      //     userId:'',
      //     userPassword:'',
      //   };
      //   if(form.userId==''||form.passWord==''){
      //     this.$message.info('请输入账户或密码')
      //     return;
      //   }else{
      //     // submitData.userId = '后端处理userId',
      //     submitData.userId = form.userId,
      //     submitData.userPassword = form.passWord,
      //     result = await post('/user/login/login',submitData)
      //   }
      //   if(result?.msg === "success"){
      //     localStorage.isLogin = true;
      //     // 在登录之后，通过路由实例跳转
      //     router.push({name:'IndexView'})
      //     this.$message.success('登录成功')
      //   }else{
      //     this.$message.error('登录失败')
      //   }
      // }catch(e){
      //   this.$message.error('登录失败')
      // }
    },
    async handleRegisterClick(){
      router.push({name:'RegisterView'})
      this.$message.info("系统默认注册低权限管理员，若想提高权限，请联系高级管理员")
    },
    // 记住密码
    remenber(data){
      this.checked=data
      if(this.checked){
          localStorage.setItem("news",JSON.stringify(this.form))
      }else{
        localStorage.removeItem("news")
      }
    },
    // 忘记密码
    forgetpas(){
      this.$message.info('请联系高级管理员或系统开发者进行密码修改')
    }
  }
}
</script>

<style lang="scss" scoped>
.bgContainer{
  width:100%;
  height: 100vh;
  background-repeat: no-repeat !important;
	background-size: 100% 100% !important;
  background:url('../../assets/images/bg.jpg');
}
.wrapper {
  background-color: rgba(0, 0, 0, .1);
  width:4.5rem;
  position: absolute;
  top: 27%;
  left:50%;
  margin-left: -2.25rem;
  transform: translateY(-50%);
  &__logintext {
    margin-bottom: 0.2rem;
    line-height: 0.5rem;
    text-align: center;
    font-size: 0.3rem;
    font-weight: bolder;
    color: #fff;
    text-shadow: 0.02rem 0.02rem 0.04rem #000000;
  }
  &__input {
    width: 3.8rem;
    transform: translate(-50%);
    margin-left: 50%;
  }
  &__tool{
    width: 3.8rem;
    height: .3rem;
    margin:0 auto;
    color:#fff;
    &__remenberTool{
      height: .3rem;
      float:left;
    }
    &__forgetpasTool{
      height: .3rem;
      line-height: .3rem;
      font-size: .14rem;
      float:right;
      cursor: pointer;
    }
  }
  &__login-button {
    margin: .14rem 1.4rem .16rem 1.4rem;
    line-height: .3rem;
    background: #0091FF;
    box-shadow: 0 .04rem .08rem 0 rgba(0,145,255,0.32);
    border-radius: .04rem;
    border-radius: .04rem;
    color: #fff;
    font-size: .16rem;
    text-align: center;
    letter-spacing:.4rem;
    text-indent: .4rem;
    cursor: pointer;
  }
  &__login-link {
    margin:0 1.4rem 0.15rem 1.4rem;
    text-align: center;
    font-size: .14rem;
    color: #999;
    cursor: pointer;
  }
}
</style>
