import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { Menu } from 'antd';
import memoryUtils from '../../utils/memoryUtils'
//引入menuConfig
import menuList from '../../config/menuConfig'
import logo from '../../asset/image/logo.png'
import './index.less'

const { SubMenu } = Menu;


// 左侧导航栏组件
class LeftNav extends Component {

 //判断当前登录用户对item是否有权限
 hasAuth = item => {
  const { key, isPublic } = item
  const menus = memoryUtils.user.role.menus
  const username = memoryUtils.user.username
  // console.log('key,menus,username',key,menus,username);
  // 1.如果当前用户是admin则直接返回true
  //2.当前用户有此item的权限
  //3.如果当前item是公开的
  if (username === 'admin' || isPublic || menus.indexOf(key)!== -1){
   return true
  }else  if(item.children){
   //4.当前用户有此item的某个子item的权限，则应该显示
   return !!item.children.find(child=>menus.indexOf(child.key)!==-1)
  }
   return false
 }

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
   //如果当前用户有对应显示的权限，则显示对应的item
   // console.log('this.hasAuth(item)',this.hasAuth(item));
   if (this.hasAuth(item)) {
    if (!item.children) {
     pre.push(
      <Menu.Item key={item.key} icon={item.icon} >
       <Link to={item.key}>{item.title} </Link>
      </Menu.Item>
     )
    } else {

     //查找一个当前请求路径匹配的的子item
     const cItem = item.children.find((cItem => {
      // return cItem.key === path//旧写法，只有完全匹配才会选中
      return path.indexOf(cItem.key) === 0//新写法，只要开头匹配即可
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
   }

   return pre
  }, [])
 }

 //在第一次render之前执行一次
 //为第一次render渲染做准备（同步的准备）
 UNSAFE_componentWillMount() {
  this.menuNodes = this.getMenuNodes_reduce(menuList)
 }


 render() {
  //得到当前求的路由路径
  let path = this.props.location.pathname
  // console.log('LeftNavRender', path);
  if (path.indexOf('/commodity/product') === 0) {//若与'/product'匹配的下标为0，则说明这是商品相关页面
   path = '/commodity/product'
  }

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
