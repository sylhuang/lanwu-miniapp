import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import { Provider } from 'react-redux'

import './app.less'
import store from './store';

class App extends Component {

  componentDidMount() {
    console.log(this.props)
    if (process.env.TARO_ENV === 'weapp') {
      Taro.cloud.init()
    }
    Taro.loadFontFace({
      global: true,
      family: 'Alibaba Puhui',
      source: 'url(https://puhuiti.oss-cn-hangzhou.aliyuncs.com/AlibabaPuHuiTi/Alibaba-PuHuiTi-Regular/Alibaba-PuHuiTi-Regular.otf)'
    })
  }

  componentDidShow() { }

  componentDidHide() { }
  // this.props.children 是将要会渲染的页面

  //TODO: 新增dva，嵌套Provider时报错React.Children.only expected to receive a single React element child. 待排查
  render() {
    return this.props.children
  }
}

export default App
