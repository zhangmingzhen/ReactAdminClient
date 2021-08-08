import React, { Component } from 'react'
import { Form, Input, } from 'antd'
import PropTypes from 'prop-types'

const Item = Form.Item

//添加分类的组件
export default class UpdateForm extends Component {

 formRef = null
 //设置ref
 setRef = c => {
  this.formRef = c
 }

 static propType = {
  categoryName: PropTypes.string.isRequired,
  setForm: PropTypes.func.isRequired,
 }
 // // componentWillMount
 // UNSAFE_componentWillMount() {
 //  // Form.useForm()
 //  // this.props.setForm(this.porps.form)
 //  /*  没有form,因为antd4的useForm是由hook实现的，
 //    所以只有函数组件才能使用useForm来创建form，
 //    而类式组件则通过ref来使用*/

 // }
 componentDidMount() {
  // this.props.setForm(this.formRef)
  // console.log('willmount', this.formRef);
  // // const form = this.formRef;
  // console.log('willmount',this.formRef.current.getFieldValue('categoryName123'))
  // console.log('UpdateForm----componentDidMount',this.formRef);

  // const formRef = this.formRef
  // console.log('componentDidMount',formRef);
  // // console.log('render',formRefCurrent.getFieldValue('categoryName123'))
  // if (formRef) {
  //  console.log('formRef存在', formRef.getFieldValue('categoryName'))
  // } else {
  //  console.log('formRef不存在')
  // }
  // this.props.setForm(formRef)//传递给Category组件
  this.props.setForm(this.formRef)//传递给Category组件
 }

 componentDidUpdate() {
  const { categoryName } = this.props
  // console.log('update-categoryName',categoryName);
  // console.log(this.formRef)
  //修改显示在输入框的值
  this.formRef.setFieldsValue({ categoryName })
  //因为当你为 Form.Item 设置 name 属性后，子组件会转为受控模式。
  // 因而 defaultValue 不会生效。你需要在 Form 上通过 initialValues 设置默认值。
  //同样的，要修改input的value，无法通过设置value的值，而是使用setFieldsValue
  // console.log('UpdateForm---DidUpdate', '@');

 }
 /**
  * 如果 ref 回调函数是以内联函数的方式定义的，在更新过程中它会被执行两次，
  * 第一次传入参数 null，然后第二次会传入参数 DOM 元素。
  * 这是因为在每次渲染时会创建一个新的函数实例，所以 React 清空旧的 ref 并且设置新的。
  * 通过将 ref 的回调函数定义成 class 的绑定函数的方式可以避免上述问题，但是大多数情况下它是无关紧要的。
  */
 render() {
  // console.log('UpdateForm---render', '@');
  // const { categoryName } = this.props
  // console.log('render-categoryName',categoryName);
  return (
   <Form ref={this.setRef}>
    <Item name='categoryName' //请注意！！！getFieldValue的参数name是Item的属性
     rules={[{ required: true, message: '请输入分类名称' },]}
     initialValue={this.props.categoryName}
    >
     <Input
     // value={categoryName}
     // // placeholder='请输入分类名称' 
     // defaultValue={categoryName}
     />
    </Item>
   </Form>
  )
 }
}
