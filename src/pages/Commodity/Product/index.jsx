import React, { Component } from 'react'
import { Switch,Route,Redirect } from 'react-router-dom'
import ProductAddUpdate from './ProductAddUpdate'
import ProductHome from './ProductHome'
import ProductDetail from './ProductDetail'

//商品路由（由于几个页面比较大，所以分为子路由组件）
export default class Product extends Component {
 render() {
  return (
   // <div>Product</div>
  <Switch>
   {/* 精准匹配 */}
   {/* 请注意这里path='/commodity/product',而不是'product' */}
   <Route path='/commodity/product/detail' component={ProductDetail}></Route>
   <Route path='/commodity/product/addupdate' component={ProductAddUpdate}></Route>
   <Route path='/commodity/product' component={ProductHome}></Route>
   {/* 要实现精准匹配有以下方法：1.将路径短的组件放在最后2.在路径短的组件加上exact */}
   <Redirect to='/commodity/product'></Redirect>
  </Switch>

  )
 }
}
