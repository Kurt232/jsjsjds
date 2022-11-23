import axios from 'axios'

// 创建axios实例
const instance = axios.create({
  baseURL:'http://120.24.194.69:88',
  withCredentials:true, //允许跨域传递cookie(登录)
})

// 手动封装的get方法，使请求默认带上baseURL
export const get = (url, params = {}) => {
  return new Promise((resolve, reject) => {
    instance.get(url, {params}, {
    }).then((response) => {
      // 本来是resolve(response)的，但是不用返回这么多，返回需要的data数据即可
      resolve(response.data)
    }, err => {
      reject(err)
    })
  })
}

// 手动封装的post方法，使请求默认带上baseURL
export const post = (url, data = {}) => {
  return new Promise((resolve, reject) => {
    instance.post(url, data, {
      // Content-Type 标头告诉客户端实际返回的内容的内容类型。
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((response) => {
      // 本来是resolve(response)的，但是不用返回这么多，返回需要的data数据即可
      resolve(response.data)
    }, err => {
      reject(err)
    })
  })
}
