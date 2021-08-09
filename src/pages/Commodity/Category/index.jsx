import React, { Component } from 'react'
import { Card, Button, Table, message, Modal } from 'antd'
import { PlusOutlined, ArrowRightOutlined } from '@ant-design/icons';
import LinkButton from '../../../components/LinkButton'
import AddForm from './AddFrom'
import UpdateForm from './UpdateFrom'
import { reqGetCategory, reqAddCategory, reqUpdateCategory } from '../../../api';
import './index.less'

export default class Category extends Component {

 state = {
  loading: false,//是否正在获取数据中
  categorys: [],//一级分类列表
  subCategorys: [],//二级分类列表
  parentId: '0',//当前请求的列表是几级列表，默认为0，表示请求一级列表
  parentName: '',
  showStatus: 0,//表示添加分类的选框和修改分类的选框的显示状态//0：都不显示，1：添加，2：修改 
 }

 //初始化table的列数组
 initColumns = () => {
  this.columns = [
   {
    title: '类别',
    dataIndex: 'name',//显示数据对应的属性名
    // _id: 'name',
   },
   {
    title: '操作',
    width: 300,
    dataIndex: 'action',
    // _id: 'action',
    render: (_, category) => {//返回需要显示的界面标签
     // render: (text, category, index)=>
     return (<span>
      <LinkButton onClick={() => this.showUpdate(category)}>修改分类</LinkButton>
      {/* 向事件回调函数传参数 ()=>{处理函数(参数)}*/}
      {this.state.parentId === '0' ?
       <LinkButton onClick={() => this.showSubCategorys(category)}>查看子分类</LinkButton> : ''}
     </span>)
    }
   }
  ];
 }


 //异步获取（一级/二级）列表显示
 // 参数paretnId若无指定按照状态中的parentId
 getCategorys = async (parentId = this.state.parentId) => {
  //请求前，显示loading
  this.setState({ loading: true })

  //获取parentId
  // const { parentId } = this.state
  const result = await reqGetCategory(parentId);
  // console.log('result', result);
  if (result.status === 0) {
   //从数据库取出分类数组，可能为一级，可能为二级
   const categorys = result.data
   if (parentId === '0') {//更新一级分类列表
    this.setState({ categorys })
   } else {//更新二级分类列表
    this.setState({ subCategorys: categorys })
   }
  } else {
   message.error('请求一级列表出错')
  }
  //请求完成后，关闭loading
  this.setState({ loading: false })
 }

 //显示指定对象的一级分类列表
 showFirstCategorys = () => {
  this.setState({
   parentId: '0',
   parentName: '',
   subCategorys: []
  })
 }

 //显示指定对象的二级分类列表
 showSubCategorys = (category) => {
  //更新状态
  this.setState({
   parentId: category._id,
   parentName: category.name
   //state的更新是异步的，所以在执行setState以后不能立即获取最新状态
  }, () => {//在状态更新且render以后再调用
   // console.log(this.state.parentId);
   // this.setState({})
   //获取二级分类列表
   this.getCategorys()
  })

 }

 //点击添加按钮事件的回调，显示添加选框
 showAdd = () => {
  this.setState({ showStatus: 1 })
 }

 //点击修改按钮事件的回调，显示修改选框
 showUpdate = (category) => {
  // console.log(category)
  //保存分类对象
  this.category = category
  // console.log('showUpdate',this.category)
  // this.form.setFieldValue([{name:'categoryName',value:''}])

  //更新状态
  this.setState({ showStatus: 2 })
 }

 //点击取消，隐藏选框 
 handleCancel = () => {
  this.setState({ showStatus: 0 })
 }

 //添加分类
 addCategory = () => {
  //Ⅰ进行表单验证
  this.formAdd.validateFields().then(async values => {
   // console.log('addCategory');
   // console.log('addCategory----formAdd', this.formAdd);
   // const formAdd = this.formAdd//用了新写法以后，这个也不需要了
   //1.隐藏选框
   this.setState({ showStatus: 0 })
   //2.发送添加分类请求
   //①准备数据
   // const { parentId, categoryName } = formAdd.getFieldsValue()//旧写法
   const { parentId, categoryName } = values//新写法
   // console.log('parentId,categoryName',parentId,categoryName)

   // const parentId = formAdd.getFieldValue('parentId')//parentId是select中被选中的那一个
   // const categoryName = formAdd.getFieldValue('categoryName')
   // ②
   //清除输入的数据
   this.formAdd.resetFields()
   // ③发请求
   const result = await reqAddCategory(parentId, categoryName);
   if (result.status === 0) {
    // console.log('add发送成功', result)
    //3.重新渲染界面
    //这里注意，如果在一级列表中如果不是往一级列表中添加分类，就没必要重新渲染页面
    //同时，如果在a二级列表中添加b二级列表项，也没必要渲染页面/
    //就是说只有当当前的页面与要添加的列表行相同时，才重新渲染页面
    if (parentId === this.state.parentId) {
     this.getCategorys()
    } else if (parentId === '0') {
     //但是当在二级列表中往一级列表中添加分类时需要重新获取一级列表但不显示一级列表
     this.getCategorys('0')
    }
   } else {
    // console.log('add发送失败', result)
    message.error('添加分类出错！')
   }
  }).catch(err => {
   message.error('分类名称不能为空')
  })


 }
 ///这里要注意！！！
 /*
 因为antd4使用useForm来创建form（里面包含了一系列的方法）从而对Form组件进行管理，
 然而userForm只能是函数组件使用，官方文档推荐类式组件使用ref来获取form。
 然后在使用ref的时候有三种方式：字符型、回调函数（包括内联式定义函数(ref调用2次,第一次传null,第二次传参数)
 和绑定为class函数（调用一次）关系不大）和createRef（this.myRef.current是ref对应的节点）。
 本来测试的时候我在UpdateForm组件中把console.log(this.formRef)放在render中，这就导致第一次的打印结果始终是null,
 我开始以为是因为ref是用createRef写的，导致第一次传的参数是null，我就换成了绑定函数式的回调函数写法
 发现结果并没有变化，后来反应过来第一次render的时候这个节点还没加载那不就是null吗，
 所以后来就把它放到了DidMount里面验证，果然就正确地获得了form.
 之后就是把它通过this.props.setForm传给它的父组件Category。
 */

 //更新分类
 updateCategory = () => {
  // Ⅰ.进行表单验证
  this.form.validateFields().then(async values => {
   // 1.隐藏更新选框
   this.setState({ showStatus: 0 })
   // 2.发请求更新分类  
   // ①准备数据
   //获取当前请求更改的分类对象
   const categoryId = this.category._id
   //获取新分类名
   // const categoryName = this.form.getFieldValue('categoryName')//旧写法
   // console.log('values', values);//values={categoryName:''}
   const { categoryName } = values//新写法

   // console.log('updateCategory---this.form', this.form);
   // console.log('updateCategory---categoryName', categoryName);
   //②清除输入的数据
   this.form.resetFields()
   // ③发送请求
   const result = await reqUpdateCategory({ categoryId, categoryName })
   if (result.status === 0) {
    // 3.重新显示列表
    // console.log('请求成功 result', result)
    this.getCategorys()
   } else {
    // console.log('请求失败 result', result);
   }
  }).catch(err => {
   // console.log('err',err);
   message.error('分类名称不能为空')
  })

 }
 // 为第一次render准备数据
 UNSAFE_componentWillMount() {
  this.initColumns()
 }

 //发异步ajax请求
 componentDidMount() {
  this.getCategorys();
 }

 render() {
  //读取相关状态值
  const { categorys, loading, parentId, subCategorys, parentName, showStatus } = this.state
  //读取当前正在修改的对象
  const category = this.category || {}
  // card左侧
  const title = parentId === '0' ? '一级分类列表' : (
   <span>
    <LinkButton onClick={this.showFirstCategorys}>一级分类列表</LinkButton>
    <ArrowRightOutlined />
    <span style={{ marginLeft: 5 }}>{parentName}</span>
   </span>
  )
  // card右侧
  const extra = (
   <Button type='primary'
    onClick={this.showAdd}
   >
    <PlusOutlined />
    添加
   </Button>
  )
  return (
   <Card title={title} extra={extra} className='category'>
    <Table dataSource={parentId === '0' ? categorys : subCategorys}
     columns={this.columns}
     rowKey='_id'
     pagination={{
      defaultPageSize: 5,
      showQuickJumper: true
     }}
     loading={loading}
     bordered
    />
    <Modal title="添加分类"
     visible={showStatus === 1}
     onOk={this.addCategory}
     onCancel={this.handleCancel}>
     <AddForm categorys={categorys}
      parentId={parentId}
      setFormAdd={formAdd => this.formAdd = formAdd}></AddForm>
    </Modal>
    <Modal title="修改分类"
     visible={showStatus === 2}
     onOk={this.updateCategory}
     onCancel={this.handleCancel}>
     {/* <UpdateForm categoryName={category ? category.name : ''}></UpdateForm> */}
     <UpdateForm categoryName={category.name}
      setForm={form => this.form = form}
     ></UpdateForm>
    </Modal>
   </Card>

  )
 }
}
