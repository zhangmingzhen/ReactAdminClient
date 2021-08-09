import React, { Component } from 'react'
import { Card, Button, Table, message, Modal } from 'antd'
import { reqGetRole, reqAddRole, reqUpdateRole } from '../../api/index'
import { PAGE_SIZE } from '../../utils/constant'
import AddForm from './AddForm'
import AuthForm from './AuthForm'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'

import formateDate from '../../utils/dateUtils'

export default class Role extends Component {

 state = {
  roles: [],//所有角色的数组
  role: {},//被选中的角色
  isShowAdd: false,//标志是否显示添加角色选框
  isShowAuth: false,//标志是否显示修改角色选框
 }

 addRef = React.createRef()
 authRef = React.createRef()

 initColumn = () => {
  this.columns = [
   {
    title: '角色名称',
    dataIndex: 'name',
   },
   {
    title: '创建时间',
    dataIndex: 'create_time',
    render: (create_time) => formateDate(create_time)
   },
   {
    title: '授权时间',
    dataIndex: 'auth_time',
    render: formateDate
   },
   {
    title: '授权人',
    dataIndex: 'auth_name',
   },
  ]
 }

 //点击行的回调
 onRow = role => {
  return {
   onClick: event => {// 点击行
    this.setState({ role })
    // console.log('onRow----role.roleName', role);
   },
  };
 }

 //获取所有角色列表
 getRole = async () => {
  const result = await reqGetRole()
  if (result.status === 0) {
   // console.log('getRole成功');
   const roles = result.data
   // console.log(roles);
   this.setState({ roles })
  } else {
   message.error('网络出错，数据获取失败');
  }
 }

 //添加角色
 addRole = () => {
  // console.log(this);
  const addForm = this.addRef.current.addForm.current
  // 1.表单验证
  addForm.validateFields().then(async values => {
   // console.log('表单验证通过', values);
   //2.获取数据
   const { roleName } = values
   //2.1清除数据
   addForm.resetFields()
   //3.发送请求
   const result = await reqAddRole(roleName)
   if (result.status === 0) {
    //3.1将新创建的角色更新到状态
    const role = result.data
    this.setState(state => ({
     roles: [...this.state.roles, role]
    }))
    message.success('添加角色成功')
   } else {
    message.error('网络出错，添加角色失败')
   }
   //4.隐藏选框
   this.setState({ isShowAdd: false })
  }).catch(err => {
   // console.log('表单验证不通过', err.value);
   message.error('表单验证不通过', err.value)
  })
 }

 //设置角色权限
 authRole = async () => {
  //1.获取数据
  // console.log(' authRole', this.authRef.current);
  const authForm = this.authRef.current
  const menus = authForm.getMenus()//获取menus
  const role = this.state.role
  role.menus = menus
  role.auth_time = Date.now()
  role.auth_name = memoryUtils.user.username
  // 2.发送请求
  const result = await reqUpdateRole(role)
  if (result.status === 0) {
   // console.log('请求发送成功 ');
   this.getRole()
   // 如果当前更新的是自己的角色，要强制退出
   if (role._id === memoryUtils.user.role_id) {
    //把数据清除
    memoryUtils.user = {}
    storageUtils.removeUser()
    this.props.history.replace('/login')
    message.success('当前用户角色权限修改了，重新登陆')
   }
   message.success('设置角色权限成功')
   this.setState({ roles: [...this.state.roles] })
  } else {
   console.log('请求发送失败 ', result);
  }
  // 4.隐藏选框
  this.setState({ isShowAuth: false })
 }

 UNSAFE_componentWillMount() {
  this.initColumn()//初始化列的信息
 }

 componentDidMount() {
  this.getRole()

 }


 render() {
  const { roles, role, isShowAdd, isShowAuth } = this.state

  // console.log('Role----role.roleName', role.name);

  const title = (
   <span>
    <Button type='primary'
     style={{ marginRight: 10 }}
     onClick={() => this.setState({ isShowAdd: true })}>
     创建角色
    </Button>
    <Button type='primary'
     disabled={!role._id}
     onClick={() => this.setState({ isShowAuth: true })}>
     设置角色权限</Button>
   </span>
  )
  return (
   <Card title={title}>
    <Table rowKey='_id'
     columns={this.columns}
     dataSource={roles}
     bordered
     pagination={{
      defaultPageSize: 5,
      showQuickJumper: true
     }}
     rowSelection={{
      type: 'radio',
      selectedRowKeys: [role._id],
      onSelect: role => this.setState({ role })
     }}
     onRow={this.onRow}
    >
    </Table>
    <Modal title="添加角色"
     visible={isShowAdd}
     onOk={this.addRole}
     onCancel={() => this.setState({ isShowAdd: false })}>
     <AddForm ref={this.addRef}></AddForm>
    </Modal>
    <Modal title="修改角色权限"
     visible={isShowAuth}
     onOk={this.authRole}
     onCancel={() => this.setState({ isShowAuth: false })}>
     <AuthForm ref={this.authRef} role={role}></AuthForm>
    </Modal>
   </Card>
  )
 }
}
