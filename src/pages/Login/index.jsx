import React, { Component } from 'react'
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Redirect } from 'react-router-dom';

/////////////有个bug，就是表单验证时，输入不合规范的信息时，.catch里面不执行，所以无法显示格式错误的message


// 引入ajax请求函数模块
import { reqLogin } from '../../api/index';
//引入工具模块
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils';
//引入logo
import logo from '../../asset/image/logo.png'
//引入样式
import './login.less'

const Item = Form.Item //不能写在import之前

// 登录的路由组件
export default class Login extends Component {

 //设置ref,从而获取form
 setRef = c => {
  this.formRef = c
 }

 handleFinish = () => {
  //对表单进行验证
  this.formRef.validateFields().then(async values => {
   console.log('提交登录的ajax请求', values)
   //解构赋值
   const { username, password } = values
   //请求登录
   //优化写法1
   // try {
   //  const response = await reqLogin(username, password)
   //  console.log('用户', username, '请求成功了', response.data);
   // } catch (error) {
   //  // console.log('用户', username, '请求失败了', error);
   //  alert ('请求出错了', error.message)
   // }
   //优化写法2
   const result = await reqLogin(username, password)
   // const result = response.data//{status: 0, data:user} || {status:1, msg:'xxx'}
   if (result.status === 0) {//登陆成功
    console.log('登陆成功');
    message.success('登陆成功')
    //保存user
    const user = result.data
    //保存在内存中（保证可以成功跳转）
    memoryUtils.user = user
    // 长期保存（保证刷新后不丢失登录信息）
    storageUtils.saveUser(user)

    //跳转到管理界面(用replace,因为不需要再回退到登陆界面)
    this.props.history.replace('/')
   } else {//登录失败
    console.log('登陆失败');
    message.error(result.msg)//用户名或密码不正确
   }
   //一般写法
   //  reqLogin(username, password).then(response => {
   //   console.log('用户', username, '请求成功了', response.data);
   //  }).catch(error => {
   //   console.log('用户', username, '请求失败了', error);
   //  })
  }).catch(err => {
   //这好像执行不到，为什么？
   console.log(err);
   message.error('用户名或密码格式错误！')
  })
 }
 //-这是一开始没理解怎样子表单验证的写法------------------------------------------------------
 //对所有表单字段进行验证(验证通过时)，(点击提交按钮后的回调)
 /* handleFinish = async (values) => {
   // console.log('提交登录的ajax请求', values)
   //解构赋值
   const { username, password } = values
   //请求登录
   //优化写法1
   // try {
   //  const response = await reqLogin(username, password)
   //  console.log('用户', username, '请求成功了', response.data);
   // } catch (error) {
   //  // console.log('用户', username, '请求失败了', error);
   //  alert ('请求出错了', error.message)
   // }
   //优化写法2
   const result = await reqLogin(username, password)
   // const result = response.data//{status: 0, data:user} || {status:1, msg:'xxx'}
   if (result.status === 0) {//登陆成功
    console.log('登陆成功');
    message.success('登陆成功')
    //保存user
    const user = result.data
    //保存在内存中（保证可以成功跳转）
    memoryUtils.user = user
    // 长期保存（保证刷新后不丢失登录信息）
    storageUtils.saveUser(user)
 
    //跳转到管理界面(用replace,因为不需要再回退到登陆界面)
    this.props.history.replace('/')
   } else {//登录失败
    console.log('登陆失败');
    message.error(result.msg)
   }
   //一般写法
   //  reqLogin(username, password).then(response => {
   //   console.log('用户', username, '请求成功了', response.data);
   //  }).catch(error => {
   //   console.log('用户', username, '请求失败了', error);
   //  })
  }
  //对所有表单字段进行验证(验证不通过时)，(点击提交按钮后的回调)
  handleFinishFailed = ({ values, errorFields, outOfDate }) => {
   console.log('失败', 'v', values, 'e', errorFields, 'o', outOfDate)
  }*/
 //----------------------------------------------------------


 //自定义密码校验，暂时没法完成提示错误的功能
 // validatePwd = (rule, value) =>{
 //  console.log(rule,value)
 //  // return Promise.resolve()
 //  Promise.reject(new Error('Should accept agreement'))
 //  // return new Promise();
 // }
 render() {
  //判断用户是否登录，若以登录则直接跳转到admin界面
  const user = memoryUtils.user
  if (user && user._id) {
   return <Redirect to='/' />
  }

  return (
   <div className='login'>
    <header className='login-header'>
     <img src={logo} alt="logo" />
     <h1>React项目：后台管理系统</h1>
    </header>
    <section className='login-content'>
     <h2>用户登录</h2>
     <Form
      name="normal_login"
      className="login-form"
      onFinish={this.handleFinish}
      ref={this.setRef}
     // onFinishFailed={this.handleFinishFailed}
     // onSubmit={this.handleSubmit}
     >
      <Item name="username"
       // 声明式验证：使用别人定义好的规则进行验证
       rules={[
        { required: true, white: true, message: '请输入用户名' },
        { min: 4, message: '用户名应不少于4位' },
        { max: 12, message: '用户名应不多于12位' },
        { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名必须是英文、数字或下划线组成' }
       ]}
      >
       <Input prefix={<UserOutlined className="site-form-item-icon rgba0-0-0-5" />}
        placeholder="用户名" />
      </Item>
      <Item name="password"
       rules={[
        { required: true, white: true, message: '请输入密码' },
        { min: 4, message: '密码应不少于4位' },
        { max: 12, message: '密码应不多于12位' },
        { pattern: /^[a-zA-Z0-9_]+$/, message: '密码必须是英文、数字或下划线组成' }
        //  {validator:this.validatePwd}//自定义校验
       ]}
       // initialValue=''
      >
       <Input
        prefix={<LockOutlined className="site-form-item-icon rgba0-0-0-5" />}
        type="password"
        placeholder="密码"
       // defaultValue=''
       />
      </Item>
      <Item>
       <Button type="primary" htmlType="submit" className="login-form-button width100">
        登录
       </Button>
      </Item>
     </Form>
    </section>
   </div>
  )
 }
}

/*
1.前台表单验证
2.收集表单输入数据
*/