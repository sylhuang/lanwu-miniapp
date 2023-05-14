import { Component, PropsWithChildren } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Button, Input, Textarea } from '@tarojs/components'

export default class Index extends Component<PropsWithChildren> {
  state = {
    apiName: "",
    apiParam: "",
    context: {}
  }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  test = () => {
    Taro.cloud
      .callFunction({
        name: this.state.apiName,
        data: JSON.parse(this.state.apiParam)
      })
      .then(res => {
        this.setState({
          context: res.result
        })
      })
  }

  login = () => {
    Taro.cloud
      .callFunction({
        name: "login",
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
          action: "getCheckInStatus",
          data: {
            id: "000000"
          }
        }
      })
      .then(res => {
        this.setState({
          context: res.result
        })
      })
  }

  checkin = () => {
    Taro.cloud
      .callFunction({
        name: "checkin",
        data: {
          action: "checkin",
          data: {
            id: "000000",
            cardId: "1684040707854",
          }
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
        <Input type='text' placeholder='接口名, 如：checkin' value={this.state.apiName} onInput={e => this.setState({ apiName: e.detail.value })}></Input>
        <Textarea placeholder='接口参数, 如：{ "action": "getCheckInStatus", "data": { "id": "000000" } }' value={this.state.apiParam} onInput={e => this.setState({ apiParam: e.detail.value })}></Textarea >
        <Button onClick={this.test}>测试接口</Button>
        <Text>context：{JSON.stringify(this.state.context)}</Text>
        <Button onClick={this.login}>一键登录</Button>
        <Button onClick={this.getCheckInStatus}>获取签到状态</Button>
        <Button onClick={this.checkin}>打卡</Button>
      </View>
    )
  }
}
