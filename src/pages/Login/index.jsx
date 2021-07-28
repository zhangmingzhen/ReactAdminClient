import React, { Component } from 'react'
import { Form, Input, Button } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
//引入样式
import './login.less'
//引入logo
import logo from './images/logo.png'

const Item = Form.Item //不能写在import之前

// 登录的路由组件
export default class Login extends Component {

 //对所有表单字段进行验证(验证通过时)，(点击提交按钮后的回调)
 handleFinish = (values) => {
  console.log('提交登录的ajax请求', values)
 }
 //对所有表单字段进行验证(验证不通过时)，(点击提交按钮后的回调)
 handleFinishFailed = ({ values, errorFields, outOfDate }) => {
  console.log('失败', 'v', values, 'e', errorFields, 'o', outOfDate)
 }
 //自定义密码校验，暂时没法完成提示错误的功能
 // validatePwd = (rule, value) =>{
 //  console.log(rule,value)
 //  // return Promise.resolve()
 //  Promise.reject(new Error('Should accept agreement'))
 //  // return new Promise();
 // }
 render() {
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
      onFinishFailed={this.handleFinishFailed}
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
      >
       <Input
        prefix={<LockOutlined className="site-form-item-icon rgba0-0-0-5" />}
        type="password"
        placeholder="密码"
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