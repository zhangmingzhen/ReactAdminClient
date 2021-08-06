import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'
import { Card, Form, Input, Cascader, Upload, Button, message } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import LinkButton from '../../../../components/LinkButton'
import PicturesWall from './PicturesWall'
import RichTextEditor from './RichTextEditor'
import { reqGetCategory, reqAddOrUpdateProduct } from '../../../../api/index'



const { Item } = Form
const { TextArea } = Input

const options = [
 {
  value: 'zhejiang',
  label: 'Zhejiang',
  isLeaf: false,
 },
 {
  value: 'jiangsu',
  label: 'Jiangsu',
  isLeaf: false,
 },
];
//Product的默认子路由组件
export default class ProductAddUpdate extends Component {

 state = {
  options,
 }

 //设置ref
 setRef = c => {//表单
  this.formRef = c
 }
 pwRef = React.createRef()//照片墙
 editorRef = React.createRef()//商品详情

 //提交表单
 submit = () => {
  //进行表单验证
  this.formRef.validateFields().then( async values => {
   //1. 收集数据,封装成product对象
   const { name, desc, price, categoryIds } = values
   let categoryId, pCategoryId
   if (categoryIds.length === 1) {
    pCategoryId = '0'
    categoryId = categoryIds[0]
   } else {
    pCategoryId = categoryIds[0]
    categoryId = categoryIds[1]
   }
   const imgs = this.pwRef.current.getImgs()
   const detail = this.editorRef.current.getDetail()
   // 封装成product对象
   const product = {name,desc,price,imgs,detail,categoryId,pCategoryId}
   //判断是更新还是添加
   if (this.isUpdate) {
    product._id = this.product._id
   }
   console.log('发送回调请求', product)
   // console.log('images', imgs);
   // console.log('detail', detail);
   //2. 调用接口请求函数，发送请求
   const result = await reqAddOrUpdateProduct(product)
   if (result.status === 0) {
    console.log('成功；啊');
    message.success('商品信息'+(this.isUpdate?'更新':'添加')+'成功')
   }
   //3. 根据结果提示
  }).catch(err => {
   console.log('失败啦');
   message.error('表单验证不通过')
  })
 }

 //接收categorys生成options,并修改状态
 initOptions = async categorys => {
  const options = categorys.map(category => ({
   label: category.name,
   value: category._id,
   isLeaf: false
  }))

  //如果是二级分类商品更新
  const { isUpdate, product } = this
  const { pCategoryId, categoryId } = product
  if (isUpdate && pCategoryId !== '0') {
   //获取对应的二级分类列表
   const subCategorys = await this.getCategorys(pCategoryId)
   //生成二级下拉列表的options
   const childOptions = subCategorys.map(category => ({
    label: category.name,
    value: category._id,
    isLeaf: true
   }))
   //获取targetOption,
   const targetOption = options.find(option => option.value === pCategoryId)
   // 关联起来
   targetOption.children = childOptions
  }
  this.setState({ options })
 }

 //异步获取一级/二级分类列表并显示
 //async函数的返回值是一个新的promise对象，这个promise的结果和值有async的结果决定
 getCategorys = async parentId => {
  const result = await reqGetCategory(parentId)//发请求
  if (result.status === 0) {
   const categorys = result.data
   if (parentId === '0') {//只有是一级分类时才更新options
    this.initOptions(categorys)
   } else {//当请求二级列表时，返回二级列表
    return categorys
   }
  } else {
   message.error('网络出错，请求发送失败')
  }
 }

 onChange = (value, selectedOptions) => {
  console.log(value, selectedOptions);
 };

 //用于加载下一级的列表
 loadData = async selectedOptions => {
  //得到选择的option对象，因为被选中的就是一个，所以，就是0
  // const targetOption = selectedOptions[selectedOptions.length - 1];
  const targetOption = selectedOptions[0];
  targetOption.loading = true;
  //根据选中的分类获取二级分类列表
  const subCategorys = await this.getCategorys(targetOption.value)
  targetOption.loading = false;//隐藏加载动画
  if (subCategorys && subCategorys.length > 0) {
   //当前分类有二级分类
   const childOptions = subCategorys.map(category => ({
    label: category.name,
    value: category._id,
    isLeaf: true
   }))
   //将子分类关联到当前分类
   targetOption.children = childOptions
  } else {
   targetOption.isLeaf = true//有点疑惑，为什么这里改了就修改了state中的options？因为是引用值
   //所以其实就是简介修改了state中options中的值
  }
  //更新状态
  this.setState({
   options: [...this.state.options],//在这里将options展开再赋值
  })
 }



 UNSAFE_componentWillMount() {
  // 取出props路由跳转过来携带的数据
  const product = this.props.location.state
  //如果是添加新商品，则product为undefined

  //保存一个是否是更新的标识,布尔值
  this.isUpdate = !!product
  //保存商品，如果不存在则为空对象，避免报错
  this.product = product || {}
 }

 componentDidMount() {
  // console.log(this.formRef);
  this.getCategorys('0')
 }

 render() {
  const { isUpdate, product } = this
  const { pCategoryId, categoryId, imgs, detail } = product
  //用于接受级联分类id的数组
  const categoryIds = []
  if (isUpdate) {
   //商品是一级分类商品
   if (pCategoryId === '0') {
    categoryIds.push(pCategoryId)
   } else {
    //商品是二级分类商品
    categoryIds.push(pCategoryId)
    categoryIds.push(categoryId)
   }
  }

  const title = (
   <span>
    <LinkButton onClick={() => this.props.history.goBack()}>
     <ArrowLeftOutlined />
    </LinkButton>
    <span>{isUpdate ? '修改商品' : '添加商品'}</span>
   </span>
  )

  return (
   <Card title={title} >
    <Form ref={this.setRef}
     labelCol={{ span: 4 }}//指定左侧label的宽度
     wrapperCol={{ span: 10 }}//指定右侧包裹的宽度
    >
     <Item label='商品名称' name='name'
      initialValue={product.name}
      rules={[{ required: true, message: '商品名称不能为空' }]}>
      <Input placeholder='请输入商品名称'></Input>
     </Item>
     <Item label='商品描述' name='desc'
      initialValue={product.desc}
      rules={[{ required: true, message: '商品描述不能为空' }]}>
      <TextArea placeholder='请输入商品名称'
       autoSize={{ minRows: 2, maxRows: 6 }} allowClear={true}></TextArea>
     </Item>
     <Item label='商品价格' name='price'
      initialValue={product.price}
      rules={[{ required: true, message: '商品价格不能为空' },
      {
       validator: (_, value) => value * 1 > 0 ?
        Promise.resolve() : Promise.reject(new Error('商品价格必须大于零'))
      },]}>
      <Input type='number' placeholder='请输入商品价格' suffix='元'></Input>
     </Item>
     <Item label='商品分类' name='categoryIds'
      initialValue={categoryIds}
      rules={[{ required: true, message: '商品分类不能为空' },]}
      imgs={imgs}>
      <Cascader options={this.state.options}//需要显示的列表项
       loadData={this.loadData}//当选择某个列表项，加载下一级列表的监听回调
       onChange={this.onChange}
       changeOnSelect />
     </Item>
     <Item label='商品图片' >
      <PicturesWall ref={this.pwRef}></PicturesWall>
     </Item>
     <Item label='商品详情'
      labelCol={{ span: 4 }}//指定左侧label的宽度
      wrapperCol={{ span: 16 }}//指定右侧包裹的宽度
     >
      <RichTextEditor detail={detail}
       ref={this.editorRef} />
     </Item>
     <Item >
      <Button type='primary' onClick={this.submit}>提交</Button>
     </Item>
    </Form>
   </Card>
  )
 }
}




