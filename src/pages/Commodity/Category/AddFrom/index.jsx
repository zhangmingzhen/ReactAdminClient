import React, { Component } from 'react'
import { Form, Select, Input, } from 'antd'
import PropType from 'prop-types'

const Item = Form.Item
const Option = Select.Option
//添加分类的组件
export default class AddForm extends Component {

 setRef = formAdd => {
  this.formRefAdd = formAdd
 }

 static propTypes = {
  categorys: PropType.array.isRequired,//一级分类列表
  parentId: PropType.string.isRequired,//父分类的id
  setFormAdd: PropType.func.isRequired
 }

 componentDidMount() {
  this.props.setFormAdd(this.formRefAdd)//往父组件Category中传递form
 }

 componentDidUpdate() {
  this.formRefAdd.setFieldsValue({ parentId: this.props.parentId })
 }

 render() {
  const { categorys, parentId } = this.props
  return (
   <Form ref={this.setRef}>
    {/* <Item style={{ width: '100%' }} > */}
    <Item name='parentId' initialValue={parentId}>
     {/* defaultValue="0" */}
     <Select >
      <Option value='0'>一级分类</Option>
      {categorys.map(category =>
       <Option value={category._id} key={category._id}>{category.name} </Option>)}
     </Select>
    </Item>
    {/* ！！！注意，在form内的组件必须加上name属性才会被from所控制，才会显示rules */}
    <Item name='categoryName'
     rules={[{ required: true, message: '请输入分类名称' }]} >
     <Input placeholder='请输入分类名称'></Input>
    </Item>
   </Form>
  )
 }
}
