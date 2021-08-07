import React, { Component } from 'react'
import { Form, Select, Input, } from 'antd'

const Item = Form.Item
const Option = Select.Option
//添加角色的组件
export default class AddUpdateForm extends Component {

 addForm = React.createRef()

 //根据标志显示修改界面/添加界面
 setValues = () => {
  const { user, isUpdate } = this.props
  if (isUpdate) {
   this.addForm.current.setFieldsValue(user)
  } else {
   this.addForm.current.resetFields()
  }
 }

 componentDidMount() {
  this.setValues()
  // console.log('this.addForm',this.addForm.current);
  // const { username, phone, email, role_id } = user
  // this.addForm.current.setFieldsValue({ username, phone, email, role_id })
 }

 componentDidUpdate() {
  this.setValues()
 }

 render() {
  const { roles } = this.props
  return (
   <Form ref={this.addForm}>
    <Item name='username'
     label='用户名：'
     rules={[{ required: true, message: '请输入用户名' }]} >
     <Input placeholder='请输入用户名'></Input>
    </Item>
    <Item name='password'
     label='密码：'
     rules={[{ required: true, message: '请输入密码' }]} >
     <Input placeholder='请输入用户名' type='password'></Input>
    </Item>
    <Item name='phone'
     label='手机号：'>
     <Input placeholder='请输入手机号'></Input>
    </Item>
    <Item name='email'
     label='邮箱：' >
     <Input placeholder='请输入邮箱'></Input>
    </Item>
    <Item name='role_id'
     label='角色：'
     rules={[{ required: true, message: '请输入角色名称' }]} >
     <Select>
      {roles.map(role => (
       <Option key={role._id}>{role.name}</Option>
      ))}
     </Select>
    </Item>
   </Form>
  )
 }
}
