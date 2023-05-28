import { Component, PropsWithChildren } from 'react'
import Taro, { Config } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.less'
import { Swiper, SwiperItem } from '@tarojs/components'

const data = {
  wallet: [
    {
      type: '年卡',
      activation: '2023-05-28T15:57:55.453Z',
      expiration: null,
      balance: null,
      color: '#e8e8e8'
    },
    {
      type: '月卡',
      activation: null,
      expiration: null,
      balance: null,
      color: '#CCF783'
    }
  ]
}

export default class Index extends Component {

  render() {
    return (
      <View className='main'>
        <Swiper
          className='swipers'
          indicatorColor='#DDD'
          indicatorActiveColor='#333'
          circular
          indicatorDots>
          {data.wallet.map((item) => {
            return (
              <View>
                <SwiperItem>
                  <View className='swiper' style={{ background: item.color }}>
                    <View className='cardType'>
                      {item.type}
                    </View>
                    <View className='cardInfo'>
                      <View>状态：{item.activation != null ? '已激活' : '未激活'}</View>
                      <View>有效期至：{item.activation != null ? item.activation : '未激活'}</View>
                      <View>有效次数：{item.balance != null ? item.balance : '#' } 次</View>
                    </View>
                  </View>
                </SwiperItem>
              </View>
            )
          })}
        </Swiper>

        <View className='checkIn'>
          打卡
        </View>
      </View>
    )
  }
}
