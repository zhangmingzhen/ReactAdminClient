import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'
import { Card, List, message } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import LinkButton from '../../../../components/LinkButton'
import { BASE_IMG_URL } from '../../../../utils/constant'
import { reqGetOneCategory,reqUpdateStatus } from '../../../../api'

import './index.less'

const Item = List.Item
//Product的默认子路由组件
export default class ProductDetail extends Component {

 state = {
  cName1: '',//一级分类名陈
  cName2: '',//二级分类名称
 }

 async componentDidMount() {
  const { pCategoryId, categoryId } = this.props.location.state.product
  if (pCategoryId === 0) {
   const result = await reqGetOneCategory(pCategoryId)
   if (result.status === 0) {
    this.setState({ cName1: result.data.name })
   } else {
    message.error('请求分类名称失败')
   }
  } else {
   //通过多个await发送多个请求，后面一个请求时前面一个请求成功返回后才发送
   // const result1 = await reqGetOneCategory(pCategoryId)
   // const result2 = await reqGetOneCategory(categoryId)
   // const cName1 = result1.data.name
   // const cName2 = result2.data.name
   //效率更高
   const results = await Promise.all([reqGetOneCategory(pCategoryId), reqGetOneCategory(categoryId)])
   if (results[0].status === 0 && results[1].status === 0) {
    const cName1 = results[0].data.name
    const cName2 = results[1].data.name
    this.setState({ cName1, cName2 })
   } else {
    message.error('请求分类名称失败')
   }
  }


 }

 render() {
  const { name, desc, price, imgs, detail } = this.props.location.state.product
  const { cName1, cName2 } = this.state
  const title = (
   <span>
    <LinkButton onClick={() => this.props.history.goBack()}><ArrowLeftOutlined style={{ marginRight: 15 }} /></LinkButton>
    <span>商品详情</span>
   </span>
  )
  return (
   <Card title={title} className='product-detail'>
    <List>
     <Item className='item'>
      <span className='left'>商品名称：</span>
      <span className='right'>{name}</span>
     </Item>
     <Item className='item'>
      <span className='left'>商品描述：</span>
      <span>{desc}</span>
     </Item>
     <Item className='item'>
      <span className='left'>商品价格：</span>
      <span>￥{price}</span>
     </Item>
     <Item className='item'>
      <span className='left'>所属分类：</span>
      <span>{cName1}{cName2 ? '-->' + cName2 : ''}</span>
     </Item>
     <Item className='item'>
      <span className='left'>商品图片：</span>
      <span>
       {imgs.map(img => (
        <img src={BASE_IMG_URL + img} key={img} alt="img" className='product-img' />
       ))}
      </span>
     </Item>
     <Item className='item'>
      <span className='left'>商品详情：</span>
      <span dangerouslySetInnerHTML={{ __html: detail }}>
      </span>
     </Item>
    </List>
   </Card>
  )
 }
}
