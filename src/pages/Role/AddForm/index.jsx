import React, { Component } from 'react'
import { Form, Select, Input, } from 'antd'

const Item = Form.Item
const Option = Select.Option
//添加角色的组件
export default class AddForm extends Component {

 addForm = React.createRef()

 render() {
  return (
   <Form ref={this.addForm}>
    <Item name='roleName'
     label='角色名称：'
     rules={[{ required: true, message: '请输入角色名称' }]} >
     <Input placeholder='请输入角色名称'></Input>
    </Item>
   </Form>
  )
 }
}
