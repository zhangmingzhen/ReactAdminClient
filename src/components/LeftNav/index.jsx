import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { Menu } from 'antd';
//引入menuConfig
import menuList from '../../config/menuConfig';
import logo from '../../asset/image/logo.png'
import './index.less'

const { SubMenu } = Menu;


// 左侧导航栏组件
class LeftNav extends Component {

 //根据menu的数据数组生成对应的标签数组
 //使用map+递归 
 getMenuNodes_map = (menuList) => {
  return menuList.map(item => {
   /*{
      title: '首页', // 菜单标题名称
      key: '/home', // 对应的path
      icon: 'home', // 图标名称
      isPublic: true, // 公开的
      children：[]//可能有
    }
    <Menu.Item>
    <SubMenu>
      <Menu.Item>
    </SubMenu>*/
   if (!item.children) {
    return (
     <Menu.Item key={item.key} icon={item.icon} >
      <Link to={item.key}>{item.title} </Link>
     </Menu.Item>
    )
   } else {
    return (
     <SubMenu key={item.key} icon={item.icon} title={item.title}>
      {/* 递归调用getMenuNodes来创建二级菜单下的菜单项*/}
      {this.getMenuNodes_map(item.children)}
     </SubMenu>
    )
   }
  })
 }

 //使用reduce+递归 
 getMenuNodes_reduce = (menuList) => {

  //得到当前求的路由路径
  // const path = ''
  const path = this.props.location.pathname

  return menuList.reduce((pre, item) => {
   if (!item.children) {
    pre.push(
     <Menu.Item key={item.key} icon={item.icon} >
      <Link to={item.key}>{item.title} </Link>
     </Menu.Item>
    )
   } else {

    //查找一个当前请求路径匹配的的子item
    const cItem = item.children.find((cItem => {
     return cItem.key === path
    }))
    //如果存在，说明当前item对应的子SubMenu需要展开
    if (cItem) {
     this.openKey = item.key//将需要被打开的子菜单的key赋值给this.openKey
    }

    pre.push(
     <SubMenu key={item.key} icon={item.icon} title={item.title}>
      {/* 递归调用getMenuNodes来创建二级菜单下的菜单项*/}
      {this.getMenuNodes_reduce(item.children)}
     </SubMenu>
    )
   }
   return pre
  }, [])
 }

 //在第一次render之前执行一次
 //为第一次render渲染做准备（同步的准备）
 componentWillMount() {
  this.menuNodes = this.getMenuNodes_reduce(menuList)
 }

 render() {
  //得到当前求的路由路径
  // const path = ''
  const path = this.props.location.pathname
  console.log('LeftNavRender', path);
  const openKey = this.openKey//获取需要被打开的子菜单的key
  return (
   <div className='left-nav'>
    <Link to='/' className='left-nav-header'>
     <img src={logo} alt="logo" />
     <h1>后台管理系统</h1>
    </Link>
    <Menu
     selectedKeys={[path]}//实时变化
     // defaultSelectedKeys={[path]}//控制初始化时选中什么
     defaultOpenKeys={[openKey]}
     mode="inline"
     theme="dark"
    // inlineCollapsed={}
    >
     {/* {this.getMenuNodes_map(menuList)} */}
     {/* {this.getMenuNodes_reduce(menuList)} */}
     {this.menuNodes}
    </Menu>
   </div>



  )
 }
}

//withRouter时高阶组件：
// 包装非路由组件，返回一个新组件
// 新的组件向非路由组件传递三个属性：history,location,match
export default withRouter(LeftNav)
