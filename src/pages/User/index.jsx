import React, { Component } from 'react'
import { Table, Modal, Button, Card } from 'antd'
import LinkButton from '../../components/LinkButton'
import { PAGE_SIZE } from '../../utils/constant'


export default class User extends Component {

 state = {
  users: [
   {
    "_id": "5cb05b4db6ed8c44f42c9af2",
    "username": "test",
    "password": "202cb962ac59075b964b07152d234b70",
    "phone": "123412342134",
    "email": "sd",
    "role_id": "5ca9eab0b49ef916541160d4",
    "create_time": 1555061581734,
    "__v": 0
   },
   {
    "_id": "5cb05b69b6ed8c44f42c9af3",
    "username": "ss22",
    "password": "123",
    "phone": "23343",
    "email": "df",
    "role_id": "5caf5444c61376319cef80a8",
    "create_time": 1555061609666,
    "__v": 0
   }
  ],
  "roles": [
   {
    "menus": [
     "/home",
     "/role",
     "/category",
     "/products",
     "/product",
     "/charts/bar"
    ],
    "_id": "5ca9eaa1b49ef916541160d3",
    "name": "测试",
    "create_time": 1554639521749,
    "__v": 0,
    "auth_time": 1555145863489,
    "auth_name": "admin"
   }
  ],//用户列表
 }

 getUser=()=>{
  
 }
 
 initColumns = () => {
  this.columns = [
   {
    title: '用户名',
    dataIndex: 'username',
   },
   {
    title: '邮箱',
    dataIndex: 'email',
   },
   {
    title: '电话',
    dataIndex: 'phone',
   },
   {
    title: '注册时间',
    dataIndex: 'create_time',
   },
   {
    title: '所属角色',
    dataIndex: 'role_id',
   },
   {
    title: '操作',
    dataIndex: 'action',
    render: (_, category) => {//返回需要显示的界面标签
     return (<span>
      <LinkButton onClick={() => this.showUpdate(category)}>修改</LinkButton>
       <LinkButton onClick={() => this.showSubCategorys(category)}>删除</LinkButton>
     </span>)
    }
   },
  ]
 }

 UNSAFE_componentWillMount(){
  this.initColumns()//准备数据
 }

 componentDidMount(){
  this.getUser()//获取用户数据
 }

 render() {
  const { users } = this.state

  const title = <Button type='primary'>创建用户</Button>
  return (
   <Card title={title}>
    <Table rowKey='_id'
     columns={this.columns}
     dataSource={users}
     bordered
     pagination={{
      defaultPageSize: PAGE_SIZE,
      showQuickJumper: true
     }}
    >
    </Table>
    <Modal title="创建用户"
    // visible={isShowAdd}
    // onOk={this.addRole}
    // onCancel={() => this.setState({ isShowAdd: false })}
    >
     {/* <AddForm ref={this.addRef}></AddForm> */}
    </Modal>
   </Card>
  )
 }
}
