import ReactDOM from 'react-dom'
import App from './App'

import memoryUtils from './utils/memoryUtils'
import storageUtils from './utils/storageUtils'

//读取local中保存的登录信息，保存到内存中
const user = storageUtils.getUser()
memoryUtils.user = user


ReactDOM.render(<App/>, document.getElementById('root'));