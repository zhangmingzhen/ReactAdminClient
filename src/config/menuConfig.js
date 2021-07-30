import {
 HomeOutlined,
 AppstoreOutlined,
 UnorderedListOutlined,
 ToolOutlined,
 SafetyOutlined,
 UserOutlined,
 AreaChartOutlined,
 LineChartOutlined,
 PieChartOutlined,
} from '@ant-design/icons';

const menuList = [
 {
  title: '首页', // 菜单标题名称
  key: '/home', // 对应的path
  // icon: 'home', // 图标名称
  icon: <HomeOutlined />, // 图标名称
  isPublic: true, // 公开的
 },
 {
  title: '商品',
  key: '/commodity',
  // icon: 'appstore',
  icon: <AppstoreOutlined />,
  children: [ // 子菜单列表
   {
    title: '品类管理',
    key: '/commodity/category',
    // icon: 'bars',
    icon: <UnorderedListOutlined />
   },
   {
    title: '商品管理',
    key: '/commodity/product',
    // icon: 'tool',
    icon: <ToolOutlined />
   },
  ]
 },

 {
  title: '用户管理',
  key: '/user',
  // icon: 'user',
  icon: <UserOutlined />
 },
 {
  title: '角色管理',
  key: '/role',
  // icon: 'safety',
  icon: <SafetyOutlined />,
 },

 {
  title: '图形图表',
  key: '/charts',
  icon: <AreaChartOutlined />,
  // icon: 'area-chart',
  children: [
   {
    title: '柱形图',
    key: '/charts/bar',
    // icon: 'bar-chart',
    icon: <AppstoreOutlined />
   },
   {
    title: '折线图',
    key: '/charts/line',
    // icon: 'line-chart',
    icon: <LineChartOutlined />
   },
   {
    title: '饼图',
    key: '/charts/pie',
    // icon: 'pie-chart',
    icon: <PieChartOutlined />
   },
  ]
 },

 // {
 //  title: '订单管理',
 //  key: '/order',
 //  // icon: 'windows',
 //  icon: 'windows',
 // },
]

export default menuList