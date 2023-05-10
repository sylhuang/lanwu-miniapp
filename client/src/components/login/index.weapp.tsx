import { Component, PropsWithChildren } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'

export default class Index extends Component<PropsWithChildren> {
  state = {
    context: {}
  }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  getLogin = () => {
    Taro.cloud
      .callFunction({
        name: "login",
        data: {}
      })
      .then(res => {
        this.setState({
          context: res.result
        })
      })
  }

  getOrCreateUser = () => {
    Taro.cloud
      .callFunction({
        name: "users",
        data: {
          action: "getOrCreateCurrentUser"
        }
      })
      .then(res => {
        this.setState({
          context: res.result
        })
      })
  }

  getCheckInStatus = () => {
    Taro.cloud
      .callFunction({
        name: "checkin",
        data: {
          action: "getCheckInStatus"
        }
      })
      .then(res => {
        this.setState({
          context: res.result
        })
      })
  }

  render() {
    return (
      <View className='index'>
        <Button onClick={this.getLogin}>获取登录云函数</Button>
        <Text>context：{JSON.stringify(this.state.context)}</Text>
        <Button onClick={this.getOrCreateUser}>一键登录</Button>
        <Button onClick={this.getCheckInStatus}>获取签到状态</Button>
      </View>
    )
  }
}
