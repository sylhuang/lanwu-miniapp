import { Component, PropsWithChildren } from 'react'
import Taro, { Config } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import './index.less'
import profileImage from '../../images/profileImage.png';

// import Login from '../../components/login/index.weapp'

const data = {
  name: 'meeple000001',
  id: '000001',
  balance: 0,
  totalCheckIn: 10,
}

export default class MyPage extends Component {

  render() {
    return (
      <View className='main'>
        <Image className='profileImage' mode='scaleToFill' src={profileImage} />
        <View className='profileInfo'>
          <View className='name'>{data.name}</View>
          <View className='id'>UID: {data.id}</View>
        </View>
        <View className='wallet'>
          <View className='walletInfo'>余额：{data.balance} ￥</View>
          <View className='walletInfo'>总出勤次数： {data.totalCheckIn} 次</View>
        </View>
        <View className='functions'>
          <View className='function'>
            约局（暂待开发）
          </View>
          <View className='function'>
            出勤历史（暂待开发）
          </View>
          <View className='function'>
            其他
          </View>
        </View>
      </View>
    )
  }
}
