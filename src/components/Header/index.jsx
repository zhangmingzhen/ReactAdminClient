import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { reqWeather } from '../../api'
import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

//引入formateDate
import formateDate from '../../utils/dateUtils'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import menuList from '../../config/menuConfig'
//引入LinkButton
import LinkButton from '../LinkButton'
import sunny from './images/sunny.jpg'
import './index.less'

const { confirm } = Modal;

class Header extends Component {

 state = {
  currentTime: formateDate(Date.now()),//当前时间
  weather: '',//天气
  temperature: '',//温度
  // title: ''//当前栏目
 }

 //每隔一秒获取一次当前时间
 getTime = () => {
  this.intervalId = setInterval(() => {
   const currentTime = formateDate(Date.now())
   this.setState({ currentTime })
  }, 1000);
 }
 //获取天气及气温
 getWeather = async () => {
  //调用接口请求函数获取天气及气温
  const { weather, temperature } = await reqWeather(110101)
  // console.log('getWeather', weather, temperature, '°C');
  this.setState({ weather, temperature })
 }
 //得到当前请求路径
 getTitle = () => {
  const path = this.props.location.pathname
  let title = ''
  menuList.forEach(item => {
   if (item.key === path) {//若当前item对象的key与path同
    title = item.title
   } else if (item.children !== undefined) {//若不同，则查找此item的children中是否有key与path相同的对象
    // console.log(item.children);
    // const cItem = item.children.find(cItem => cItem.key === path)
    const cItem = item.children.find(cItem => path.indexOf(cItem.key) === 0)
    if (cItem) {//若有，则返回title
     title = cItem.title
    }
   }
  })
  // console.log('title', title);
  // this.setState({ title })
  return title
 }
 //退出登录
 logout = () => {
  confirm({
   title: '你确定要退出吗？',
   icon: <ExclamationCircleOutlined />,
   onOk: () => {
    console.log('OK', this);
    //删除保存的用户数据
    storageUtils.removeUser()
    memoryUtils.user = {}
    //返回登陆页面
    this.props.history.replace('/login')
   }
  });
 }

 componentDidMount() {
  this.getTime()//开启定时器
  this.getWeather()
 }

 componentWillUnmount() {
  //清除定时器
  clearInterval(this.intervalId)
 }

 render() {
  const { currentTime, weather, temperature } = this.state
  const { username } = memoryUtils.user
  const title = this.getTitle()
  return (
   <div className='header'>
    <div className='header-top'>
     <span>欢迎，{username}</span>
     <LinkButton onClick={this.logout}>退出</LinkButton>
    </div>
    <div className='header-bottom'>
     <div className='header-bottom-left'>{title}</div>
     <div className='header-bottom-right'>
      <span>{currentTime}</span>
      <img src={sunny} alt="weather" />
      <span>{weather} {temperature}°C</span>
     </div>
    </div>
   </div>
  )
 }
}
export default withRouter(Header)