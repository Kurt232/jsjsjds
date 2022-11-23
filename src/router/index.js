import { createRouter, createWebHashHistory } from 'vue-router'
import {localStorage} from '@/store/index'

const routes = [
{
    path:'/',
    name:'IndexView',
    // 异步组件，只有访问的时候才加载,"index"指的是代码包的名字
    component:()=>import(/* webpackChunName:"index" */ '../views/index/IndexView'),
    redirect: '/data1',  //默认跳转到miserware路由
    hidden: true,
    children: [
        {
          path: 'data1',
          name: 'data1',
            component: () => import( '../components/FormData1.vue')
        },
        {
          path: 'data2',
          name: 'data2',
          // route level code-splitting
          // this generates a separate chunk (about.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: () => import( '../components/FormData2.vue')
        },
        {
          path: 'data3',
          name: 'data3',
          component: () => import( '../components/FormData3.vue')
        },
        {
          path: 'data4',
          name: 'data4',
          component: () => import( '../components/FormData4.vue')
        },
        {
          path: 'data5',
          name: 'data5',
          component: () => import( '../components/FormData5.vue')
        },
        {
          path: 'data6',
          name: 'data6',
          component: () => import( '../components/FormData6.vue')
        },
        {
          path: 'drug',
          name: 'drug',
          component: () => import( '../components/formDrug.vue')
        },
        {
          path: 'drugMessage',
          name: 'drugMessage',
          component: () => import( '../components/drugMessage.vue')
        },
        {
          path: 'log',
          name: 'log',
          component: () => import( '../components/formLog.vue')
        },
        {
          path: 'drug',
          name: 'drug',
          component: () => import( '../components/formDrug.vue')
        },
        {
          path: 'user',
          name: 'user',
          component: () => import( '../components/formUser.vue')
        },
        {
          path: 'userMessage',
          name: 'userMessage',
          component: () => import( '../components/userMessage.vue')
        }
      ]
},
{
    path:'/login',
    name:'LoginView',
    component:()=>import(/* webpackChunName:"login" */ '../views/login/LoginView'),
    // 只有访问LoginView这个页面之前才会执行,作用是登录之后无法访问LoginView页面
    beforeEnter(to,from,next){
        const {isLogin} = localStorage;//解构赋值，相当于const isLogin = localStorage.isLogin
        // 如果已经登录，则跳转到IndexView页面，否则正常展示当前页面
        isLogin ? next({name:'IndexView'}): next();
    }
},
{
    path:'/register',
    name:'RegisterView',
    component:()=>import(/* webpackChunName:"register" */ '../views/register/RegisterView'),
    // 只有访问LoginView这个页面之前才会执行,作用是登录之后无法访问LoginView页面
    beforeEnter(to,from,next){
        const {isLogin} = localStorage;//解构赋值，相当于const isLogin = localStorage.isLogin
        // 如果已经登录，则跳转到IndexView页面，否则正常展示当前页面
        isLogin ? next({name:'IndexView'}): next();
    }
},
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

// 路由守卫实现基础登陆校验功能
// beforeEach表示在初始化时候被调用和每次路由切换之前别调用
router.beforeEach((to,from,next)=>{
    // isLogin在本地存储中
    const isLogin = localStorage.isLogin;

    if(!isLogin&&(to.name !=='LoginView'&&to.name !=='RegisterView')){
        next({name:'LoginView'})
    }else{
        next()
    }
})

export default router
