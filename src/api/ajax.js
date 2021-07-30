/*
能发送ajax异步请求的函数模块
封装axios库
返回值是promise对象
1.优化：统一处理请求异常
  在外层包一个自己创建的promise对象
  在请求出错是，不reject,，而是显示错误提示
2.希望异步得到的不是response而是data
  在resolve请求成功时：resolve(response.data)
*/

import axios from 'axios'
import { message } from 'antd';

export default function ajax(url, data = {}, type = 'GET') {
 return new Promise((resolve, reject) => {
  let promise
  // 1.异步请求ajax请求
  if (type === 'GET') {//发送GET请求
   promise = axios.get(url, {//配置对象
    params: data//指定请求参数
   });
  } else {//发送POST请求
   promise = axios.post(url, data);
  }
  // 2.成功则调用resolve(value)
  promise.then(response => {
   resolve(response.data)
   // 3.失败,不调用reject(reason)，而是提示异常
  }).catch(error => {
   // reject(error)
   //antd显示一个错误信息
   message.error(error.message);
  })


 })

}

//请求登录接口
// ajax('/login', {username:'zmz',password:'12345'}, 'POST').then()
// ajax
