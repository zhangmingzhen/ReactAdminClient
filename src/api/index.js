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
export const reqAddUser = user => ajax(BASE + 'manage/user/add', user, 'POST')

//获取所有用户列表
export const reqGetUser = () => ajax(BASE + '/manage/user/list')

//修改用户
export const reqUpdateUser = user => ajax(BASE + '/manage/user/update', user, 'POST')

//删除用户
export const reqRemoveUser = userId => ajax(BASE + '/manage/user/delete', { userId }, 'POST')

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
export const reqAddCategory = (parentId, categoryName) =>
 ajax(BASE + '/manage/category/add', { parentId, categoryName }, 'POST')

// 更新分类
export const reqUpdateCategory = ({ categoryId, categoryName }) =>
 ajax(BASE + '/manage/category/update', { categoryId, categoryName }, 'POST')

//获取一个分类
export const reqGetOneCategory = (categoryId) =>
 ajax(BASE + '/manage/category/info', { categoryId }, 'GET')

//获取商品列表
export const reqGetProduct = (pageNum, pageSize) =>
 ajax(BASE + '/manage/product/list', { pageNum, pageSize }, 'GET')

// 搜索商品分页列表
//searchType:productName/productDesc
export const reqSearchProducts = ({ pageNum, pageSize, searchName, searchType }) =>
 ajax(BASE + '/manage/product/search', {
  pageNum,
  pageSize,
  [searchType]: searchName,//根据搜索类型发送不同的请求
 }, 'GET')

//更新商品状态，实行上架/下架操作
export const reqUpdateStatus = (productId, status) =>
 ajax(BASE + '/manage/product/updateStatus', { productId, status }, 'POST')

//删除后台图片
export const reqDeleteImg = name => ajax(BASE + '/manage/img/delete', { name }, 'POST')

//添加商品或修改商品
export const reqAddOrUpdateProduct = product =>
 ajax(BASE + '/manage/product/' + (product._id ? 'update' : 'add'), product, 'POST')


//获取所有角色的列表
export const reqGetRole = () => ajax(BASE + '/manage/role/list')

//添加角色
export const reqAddRole = roleName => ajax(BASE + '/manage/role/add', { roleName }, 'POST')

//更新角色权限
export const reqUpdateRole = role =>
 ajax(BASE + '/manage/role/update', role, 'POST')


