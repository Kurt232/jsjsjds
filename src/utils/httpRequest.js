import axios from 'axios'


const http = axios.create({
    baseURL:'http://120.24.194.69:88',
    withCredentials:true, //允许跨域传递cookie(登录)
})

export default http
