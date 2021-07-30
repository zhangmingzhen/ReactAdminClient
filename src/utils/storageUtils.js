//进行local数据存储管理的工具模块

import store from 'store'

const USER_KEY = 'user_key'
export default {
 //保存user
 saveUser(user) {
  //原生方式（兼容性较差)
  // localStorage.setItem(USER_KEY, JOSN.stringfy(user))

  //使用store库
  store.set(USER_KEY, user)
 },

 //读取user
 getUser() {
  //原生方式（兼容性较差)
  // return JSON.parse(localStorage.getItem(USER_KEY) || '{}')

  //使用store库
  return store.get(USER_KEY) ||{}
 },

 //删除user
 removeUser() {
  //原生方式（兼容性较差)
  localStorage.removeItem(USER_KEY)

  //使用store库
  store.remove(USER_KEY)
 }
}