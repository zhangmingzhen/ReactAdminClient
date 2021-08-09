import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Divider, Form, Input, Tree } from 'antd'
import menuConfig from '../../../config/menuConfig'//以此生成权限树

const Item = Form.Item


//添加角色的组件
export default class AuthForm extends PureComponent {
 //用PureComponent进行优化

 static propTypes = {
  role: PropTypes.object,
 }

 state = {
  checkedKeys: [],//被选中的权限
 }

 onCheck = (checkedKeys) => {
  // console.log('onCheck', checkedKeys);
  this.setState({ checkedKeys });
 };

 // onSelect = (SelectedKeys, event) => {
 //  console.log('onSelect', SelectedKeys);
 //  console.log('event', event);
 //  this.setState({ checkedKeys: [...this.state.checkedKeys, SelectedKeys] });
 // };

 //帮父组件获取menus
 getMenus = () => {
  // console.log('this.state.checkedKeys', this.state.checkedKeys);
  return this.state.checkedKeys
 }

 // constructor(props) {
 //  super(props)
 //  // console.log('constructor', this.props.role);
 //  // this.setState({checkedKeys:this.props.role.menus})//①
 //  this.state.checkedKeys = this.props.role.menus//初始化被选中的权限//②
 //  //①②都可以，因为是在改变状态的途中，所以可以直接设置
 // }

 componentDidMount() {
  this.setState({ checkedKeys: this.props.role.menus })//①
 }

 UNSAFE_componentWillReceiveProps(nextProps) {
  // console.log('WillReceiveProps', nextProps.role.menus);
  const menus = nextProps.role.menus
  this.setState({ checkedKeys: menus })//每一次新props传入前都先更新checkedKeys
 }


 componentWillMount() {
  this.treeData = [//初始化treeData 
   {
    title: '平台权限',
    key: 'all',
    children: menuConfig
   }
  ];
 }

 render() {
  const { role } = this.props
  const { checkedKeys } = this.state
  // console.log('render----checkedKeys', checkedKeys);
  // console.log('AuthForm----role.roleName',role.name);
  return (
   <div>
    <Item label='角色名称：'>
     <Input value={role.name} disabled></Input>
    </Item>
    <Tree
     treeData={this.treeData}
     checkable
     defaultExpandAll//展开所有节点
     onCheck={this.onCheck}
     checkedKeys={checkedKeys}
    />
   </div>
  )
 }
}
