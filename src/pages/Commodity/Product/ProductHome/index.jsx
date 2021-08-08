import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'
import { Card, Button, Table, message, Modal, Select, Input } from 'antd'
import { PlusOutlined, ArrowRightOutlined } from '@ant-design/icons';
import LinkButton from '../../../../components/LinkButton'
import { reqGetProduct, reqSearchProducts, reqUpdateStatus } from '../../../../api/index'
import { PAGE_SIZE } from '../../../../utils/constant'

const Option = Select.Option

//Product的修改和添加商品子路由组件
export default class ProductHome extends Component {

 state = {
  total: 0,//总商品数
  products: [],//商品数组
  loading: false,//是否正在加载中
  searchName: '',//搜索关键字
  searchType: 'productName',//搜索类型，默认为按名称搜索
 }


 //初始化列
 initColumns = () => {
  this.columns = [
   {
    title: '商品名称',
    dataIndex: 'name',
    // '_id':'name',
   },
   {
    title: '商品描述',
    dataIndex: 'desc',
    // '_id':'desc',
   },
   {
    title: '价格',
    dataIndex: 'price',
    render: price => '￥' + price, //当前指定了对应的属性
    // '_id':'price',
   },
   {
    width: 100,
    title: '状态',
    // dataIndex: 'status',//不能从数据中知道status,因为改不了
    // '_id':'status',
    render: (_, product) => {
     const { status, _id } = product
     return (
      <span>
       <Button
        type='primary'
        onClick={() => { this.updateStatus(_id, status === 1 ? 2 : 1) }}>
        {status === 1 ? '下架' : '上架'}
       </Button>
       <span>{status === 1 ? '在售' : '已下架'}</span>
      </span>
     )
    }
   },
   {
    width: 100,
    title: '操作',
    dataIndex: 'action',
    // '_id':'action',
    render: (_, product) => {
     return (
      <span>
       <LinkButton onClick={() =>
        this.props.history.push('/commodity/product/detail', { product })} >
        详情
       </LinkButton>
       <LinkButton onClick={() =>
        this.props.history.push('/commodity/product/addupdate',product)} >
        修改
       </LinkButton>
      </span>
     )
    }
   },
  ];
 }

 //更新指定商品状态
 updateStatus = async (productId, status) => {
  const result = await reqUpdateStatus(productId, status)
  if (result.status === 0) {
   message.success('更新商品状态成功')
   //更新列表显示
   this.getProducts(this.pageNum)
  } else {
   message.error('更新商品状态出错')
  }
 }
 //发送商品请求列表
 getProducts = async (pageNum) => {
  this.pageNum = pageNum//保存当前页码
  this.setState({ loading: true })

  let result = {}
  const { searchName, searchType } = this.state
  if (searchName !== '') {//当搜索框内不为空时,则显示发送搜索请求
   result = await reqSearchProducts({ pageNum, pageSize: PAGE_SIZE, searchName, searchType })
  } else {//当搜索框为空时则发送展示商品列表请求
   result = await reqGetProduct(pageNum, PAGE_SIZE)
  }
  this.setState({ loading: false })
  if (result.status === 0) {
   //取出分页数据，更新状态，显示列表
   const { total, list } = result.data
   this.setState({ total, products: list })
  } else {
   message.error('网络出错，获取商品列表失败！')
  }
 }

 UNSAFE_componentWillMount() {
  this.initColumns()
 }

 componentDidMount() {
  this.getProducts(1)
 }



 render() {
  const { products, total, loading, searchName, searchType } = this.state


  const title = (
   <span>
    <Select
     // defaultValue='1' 
     value={searchType}
     onChange={
      value => this.setState({ searchType: value })}>
     <Option value='productName'>按名称搜索</Option>
     <Option value='productDesc'>按描述搜索</Option>
    </Select>
    <Input placeholder='请输入关键字'
     style={{ width: '150px', margin: '0 15px' }}
     value={searchName}
     onChange={event => { this.setState({ searchName: event.target.value }) }}
    ></Input>
    <Button type='primary' onClick={() => this.getProducts(1)}>搜索</Button>
   </span>
  )
  const extra = (
   <Button type='primary'
    onClick={() => this.props.history.push('/commodity/product/addupdate')}
    icon={<PlusOutlined />}>
    添加商品
   </Button>
  )

  return (
   <Card title={title} extra={extra}>
    <Table rowKey='_id'
     dataSource={products}
     columns={this.columns}
     bordered
     loading={loading}
     pagination={{
      current:this.pageNum,
      defaultPageSize: PAGE_SIZE,
      showQuickJumper: true,
      total,
      // onChange: pageNum => this.getProducts(pageNum),//旧写法
      onChange: this.getProducts,//简化写法
     }}
    />;

   </Card>
  )
 }
}
