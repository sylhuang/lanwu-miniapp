import { Component, PropsWithChildren } from 'react'
import Taro, { Config, useDidShow } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import './index.less'
import profileImage from '../../images/profileImage.png';
import { useState, useEffect } from 'react';

function MyPage({ dispatch }) {
  const [name, setName] = useState("");
  const [id, setId] = useState(0);
  const [balance, setBalance] = useState(0);
  const [visits, setVisits] = useState(0);

  useDidShow(() => {
    Taro.getStorage({
      key: 'id',
      fail: function () {
        login();
      },
      success: function (res) {
        setId(res.data);
        getUserInfo(res.data);
      },
    })
  })

  const login = () => {
    Taro.cloud
      .callFunction({
        name: "login",
      })
      .then(res => {
        console.log(res);
        if (res.result !== null) {
          const { id, name, balance, visits } = res.result;
          Taro.setStorage({
            key: "id",
            data: res.result.id
          });
          Taro.setStorage({
            key: "name",
            data: res.result.name
          });
          setId(id);
          setName(name);
          setBalance(balance);
          setVisits(visits);
        }
      })
  }

  const getUserInfo = (id) => {
    Taro.cloud
      .callFunction({
        name: "user",
        data: {
          action: "getUserById",
          data: {
            id: id
          }
        }
      })
      .then(res => {
        if (res.result !== null) {
          const { id, name, balance, visits } = res.result;
          setId(id);
          setName(name);
          setBalance(balance);
          setVisits(visits);
        }
      })
  }

  return (
    <View className='main'>
      <Image className='profileImage' mode='scaleToFill' src={profileImage} />
      <View className='profileInfo'>
        <View className='name'>{name}</View>
        <View className='id'>UID: {id}</View>
      </View>
      <View className='wallet'>
        <View className='walletInfo'>余额：{balance} ￥</View>
        <View className='walletInfo'>总出勤次数： {visits} 次</View>
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

MyPage.config = {
  navigationBarTitleText: '我的',
  usingComponent: {}
}

export default MyPage
