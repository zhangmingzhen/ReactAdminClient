import React, { Component } from 'react'
import memoryUtils from '../../utils/memoryUtils'
import { Redirect, Switch, Route } from 'react-router-dom'
import { Layout } from 'antd';
import LeftNav from '../../components/LeftNav';
import Header from '../../components/Header';
import Home from '../Home'
import Product from '../Commodity/Product'
import Category from '../Commodity/Category'
import User from '../User'
import Role from '../Role'
import Bar from '../Charts/Bar'
import Line from '../Charts/Line'
import Pie from '../Charts/Pie'
const { Footer, Sider, Content } = Layout;

// 后台管理的路由组件
export default class Admin extends Component {
 render() {
  const user = memoryUtils.user
  //如果内存中未存储user，表示当前未登录
  if (!user || !user._id) {
   //自动跳转到登陆界面(在render)
   return <Redirect to='/login' />
  }
  return (
    <Layout style={{height: '100%'}}>
     <Sider>
      <LeftNav></LeftNav>
     </Sider>
     <Layout>
      <Header>Header</Header>
      <Content style={{backgroundColor: 'white'}}>
       <Switch>
        <Route path='/home' component={Home}></Route>
        <Route path='/commodity/category' component={Category}></Route>
        <Route path='/commodity/product' component={Product}></Route>
        <Route path='/user' component={User}></Route>
        <Route path='/role' component={Role}></Route>
        <Route path='/charts/bar' component={Bar}></Route>
        <Route path='/charts/line' component={Line}></Route>
        <Route path='/charts/pie' component={Pie}></Route>
        <Redirect to='/home'></Redirect>
       </Switch>
      </Content>
      <Footer style={{textAlign:'center',color:'#ccc'}}>推荐使用谷歌浏览器，可以获得更佳页面操作体验</Footer>
     </Layout>
    </Layout>
  )
 }
}
