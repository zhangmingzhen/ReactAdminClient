import React, { Component } from 'react'
import { Table, Modal, Button, Card, message } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons';
import LinkButton from '../../components/LinkButton'
import AddUpdateForm from './AddUpdateForm'
import { reqGetUser, reqAddUser, reqUpdateUser, reqRemoveUser } from '../../api'
import { PAGE_SIZE } from '../../utils/constant'
import formateDate from '../../utils/dateUtils'


const { confirm } = Modal

//在这有个显示密码的功能我认为不太好，因为从后台返回的数据的密码是经过md5加密后的，
//如果直接在修改框里面显示加密后的密码，如果用户不更改密码那么它的密码就会改成密文，
//这回导致很多问题，所以我想将密码这一栏从修改框里删去，但是我又想到这本来就是后台管理系统，
//按理来说应该是要能看到密码才行的，所以我现在就维持不懂吧
//让用户更改的，并且没有找到

export default class User extends Component {

 state = {
  users: [],//用户列表
  roles: [],//角色列表
  user: {},//被选中更新的用户
  isShow: false,//0表示都显示，2表示显示修改添加选框
  isUpdate: false,//是否是更新用户
 }

 form = React.createRef()//标记添加

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
    render: formateDate
   },
   {
    title: '所属角色',
    dataIndex: 'role_id',
    render: role_id =>this.roleNames[role_id]//法2
    //找到与所属角色id对应的角色名
    // (role_id) => { //法1
    //  const role = this.state.roles.find((role) => role_id === role._id)
    //  return role.name || role_id
    // }
   },
   {
    title: '操作',
    dataIndex: 'action',
    render: (_, user) => {//返回需要显示的界面标签
     return (<span>
      <LinkButton onClick={() => this.showUpdate(user)}>修改</LinkButton>
      <LinkButton onClick={() => this.showRemove(user)}>删除</LinkButton>
     </span>)
    }
   },
  ]
 }

 //根据roles生成对应的roleName数组
 initRoleNames = roles => {
  const roleNames = roles.reduce((pre,role)=>{
   pre[role._id] = role.name
   return pre
  },{})
  this.roleNames = roleNames
}

 //获取用户数据
 getUser = async () => {
  const result = await reqGetUser()
  if (result.status === 0) {
   console.log('getUser成功', result.data);
   //更新状态
   const { users, roles } = result.data
   this.initRoleNames(roles )
   this.setState({ users, roles })
  } else {
   // console.log('getUser失败', result);
  }
 }

 //显示更新选框
 showUpdate = user => {//显示选框
  this.setState({
   user,
   isShow: true,
   isUpdate: true
  })//显示选框
  //本来想在显示修改用户的选框的同时，通过setFields来显示数据，但是现在的情况来看实现不了
  //打算将待修改的数据传到子组件，然后进行显示
 }

 //显示添加选框
 showAdd = () => {
  this.setState({ isShow: true, isUpdate: false })
 }

 //显示删除选框
 showRemove = user => {
  this.setState({
   user
  })//更新状态
  // console.log('user.username', user.username);
  confirm({
   title: '你确定要删除' + user.username + '吗？',
   icon: <ExclamationCircleOutlined />,
   content: '删除之后无法恢复',
   onOk: this.removeUser
   // onOk:()=>this.removeUser(user)都可以
  });
 }

 //添加用户
 addUser = () => {
  const addForm = this.form.current.addForm.current
  addForm.validateFields().then(async user => {
   // console.log('addUser', user);
   //发送请求(values就是一个用户)
   // user.password = '123456'//默认密码为123456
   const result = await reqAddUser(user)
   if (result.status === 0) {
    message.success('创建用户成功')
    //更新到users//这样是不行的，因为有一个注册时间没办法显示
    // this.setState(state => ({
    //  users: [...this.state.users, user]
    // }))
    this.getUser()
    //隐藏选框
    this.setState({ isShow: false })
   } else {
    message.error('创建用户失败')
   }
  }).catch(err => {
   console.log('表单验证出错');
  })
 }

 //更新用户
 updateUser = () => {
  // console.log('updateUser', this.form.current);
  const updateForm = this.form.current.addForm.current
  updateForm.validateFields().then(async user => {
   // console.log('updateUser',user);
   user._id = this.state.user._id//设置修改待修改用户的id
   const result = await reqUpdateUser(user)
   if (result.status === 0) {
    this.getUser()
    message.success('修改用户成功')
   } else {
    message.error(result.msg)
   }
   this.setState({ isShow: false })
  }).catch(err => {
   console.log('表单验证出错');
  })
 }

 //删除用户
 removeUser = async () => {
  // console.log('123456', this.state.user);
  const {user} = this.state//从状态中读取user
  const result = await reqRemoveUser(user._id)
  if (result.status === 0) {
   console.log('removeUser成功', result.data);
   message.success("删除用户成功")
   // 重新渲染页面
   // this.getUser()//法1

   const users = this.state.users.filter(u => {//法2
    return user._id !== u._id
   })//这样可行，因为这种方式里users是另一个数组，而不是原数组的引用
   this.setState({ users })
   // this.initRoleNames(roles)//其实这个可以不需要更新，因为用户被删除以后就不可能再点它，所以用不到

   //以下写法不可行
   // const users = this.state.users
   // users.pop()
   // this.setState({users})
  } else {
   console.log('removeUser失败', result);
   message.success("失败")
  }
 }

 UNSAFE_componentWillMount() {
  this.initColumns()//准备数据
 }

 componentDidMount() {
  this.getUser()//获取用户数据
 }

 render() {
  const { users, roles, user, isShow, isUpdate } = this.state

  const title = <Button type='primary' onClick={this.showAdd}
  >创建用户</Button>
  return (
   <Card title={title}>
    <Table rowKey='_id'
     columns={this.columns}
     dataSource={users}
     bordered
     pagination={{
      defaultPageSize: 5,
      showQuickJumper: true
     }}
    >
    </Table>
    <Modal title={isUpdate ? '更新用户' : '创建用户'}
     visible={isShow}
     onOk={isUpdate ? this.updateUser : this.addUser}
     onCancel={() => this.setState({ isShow: false })}
    >
     <AddUpdateForm roles={roles} user={user} isUpdate={isUpdate}
      ref={this.form}></AddUpdateForm>
    </Modal>
    {/* <Modal title="删除用户"
     visible={isShow }
     onOk={this.removeUser}
     onCancel={() => this.setState({ isShow: false })}
    ></Modal> */}
   </Card>
  )
 }
}
