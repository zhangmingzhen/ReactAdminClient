import React, { Component } from 'react'
import memoryUtils from '../../utils/memoryUtils'
import { Redirect } from 'react-router-dom'

// 后台管理的路由组件
export default class Admin extends Component {
 render() {
  const user = memoryUtils.user
  //如果内存中未存储user，表示当前未登录
  if (!user || !user._id) {
   //自动跳转到登陆界面(在render)
   return <Redirect to='/login'/>
  } 
  return (
   <div>
    Hello,{user.username}
   </div>
  )
 }
}
