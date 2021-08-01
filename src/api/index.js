/*
能根据接口文档定义接口请求函数
包含应用中所有的接口请求函数的模块
每个函数的返回值都是promise
*/
import { message } from 'antd'
import jsonp from 'jsonp'
import ajax from './ajax'

// const BASE = 'http://localhost:5000'
const BASE = ''

//登录
// export function reqLogin(username, paasword) {
//  return ajax('/login', {username, password},'POST')

// } 
export const reqLogin = (username, password) => ajax(BASE + '/login', { username, password }, 'POST')

// 添加用户
export const reqAddUser = (user) => ajax(BASE + 'manage/user/add', user, 'POST')

// json请求的接口请求函数

export const reqWeather = (city) => {

 return new Promise((resolve, reject) => {
  const url = `https://restapi.amap.com/v3/weather/weatherInfo?city=${city}&key=4b0ed7d6d050431793f82c14b1d38d03`
  jsonp(url, {}, (err, data) => {
   console.log('jsonp()', 'err', err, 'data', data);
   // 如果成功
   if (!err && data.status === "1") {
    const { weather, temperature } = data.lives[0];
    console.log('reqWeather', weather, temperature, '°C');
    resolve({ weather, temperature })
   } else {
    //如果失败
    message.error('获取天气信息失败！')
   }
  })
 })
}

// 获取一级/二级分类列表
export const reqGetCategory = (parentId) => ajax(BASE + '/manage/category/list', { parentId })

//添加分类
export const reqAddCategory = (parentId, categoryName) => ajax(BASE + '/manage/category/add', { parentId, categoryName }, 'POST')

// 更新分类
export const reqUpdateCategory = ({ categoryId, categoryName }) =>
 ajax(BASE + '/manage/category/update', { categoryId, categoryName }, 'POST')


