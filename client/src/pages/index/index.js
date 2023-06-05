import Taro, { Config } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.less'
import { Swiper, SwiperItem } from '@tarojs/components'
import { useState, useEffect } from 'react'
import moment from 'moment';

const cardType = {
  guest: '散客',
  seasonal: '季卡',
  annual: '年卡',
  times: '次卡'
}

function Index({ dispatch }) {

  const [wallet, setWallet] = useState([]);
  const [id, setId] = useState(null);
  const [currentCard, setCurrentCard] = useState(0);
  const [checkInStatus, setCheckInStatus] = useState(false);

  useEffect(() => {
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
  }, [])

  useEffect(() => {
    Taro.getStorage({
      key: 'checkInStatus',
      fail: function () {
        getCheckInStatus();
      },
      success: function (res) {
        setCheckInStatus(res.data);
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
          const { id, name, wallet } = res.result;
          Taro.setStorage({
            key: "id",
            data: res.result.id
          });
          Taro.setStorage({
            key: "name",
            data: res.result.name
          });
          setWallet(wallet);
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
          const { wallet } = res.result;
          setWallet(wallet);
        }
      })
  }

  const getCheckInStatus = () => {
    Taro.cloud
      .callFunction({
        name: "checkin",
        data: {
          action: "getCheckInStatus",
          data: {
            id: id
          }
        }
      })
      .then(res => {
        if (res.result !== null) {
          const { isCheckedIn } = res.result;
          Taro.setStorage({
            key: "checkInStatus",
            data: isCheckedIn
          });
        }
      })
  }

  const checkIn = () => {
    Taro.cloud
      .callFunction({
        name: "checkin",
        data: {
          action: "checkin",
          data: {
            id: id,
            cardId: wallet[currentCard].id
          }
        }
      })
      .then(res => {
        console.log(res);
        if (res.result !== null) {
          getUserInfo(id);
          Taro.setStorage({
            key: "checkInStatus",
            data: true,
          });
          setCheckInStatus(true);
          Taro.showToast({
            title: '打卡成功',
            icon: 'success',
            duration: 2000
          })
        }else{
          getUserInfo(id);
          Taro.showToast({
            title: '打卡失败',
            icon: 'error',
            duration: 2000
          })
        }
      })
  }


  const revoke = () => {
    Taro.cloud
      .callFunction({
        name: "checkin",
        data: {
          action: "revokeCheckIn",
          data: {
            id: id
          }
        }
      })
      .then(res => {
        console.log(res);
      })
  }


  return (
    <View className='main'>
      <Swiper
        className='swipers'
        indicatorColor='#DDD'
        indicatorActiveColor='#333'
        circular
        onChange={({ detail: { current } }) => setCurrentCard(current)}
        indicatorDots>
        {wallet.map((item) => {
          return (
            <View>
              <SwiperItem>
                <View className='swiper' style={{ background: '#e8e8e8' }}>
                  <View className='cardType'>
                    {cardType[item.type]}
                  </View>
                  <View className='cardInfo'>
                    <View>状态：{item.activation != null ? '已激活' : '未激活'}</View>
                    <View>有效期至：{item.expiration != null ? moment(item.expiration).format("YYYY-MM-DD") : '-'}</View>
                    <View>有效次数：{item.balance != null ? item.balance : '#'} 次</View>
                  </View>
                </View>
              </SwiperItem>
            </View>
          )
        })}
      </Swiper>

      {
        checkInStatus ? (
          <View className='checkIn checked' disabled>
            已打卡
          </View>
        ) : (
          <View className='checkIn unchecked' onClick={checkIn}>
            打卡
          </View>
        )
      }
    </View>
  )
}

Index.config = {
  navigationBarTitleText: '卡包',
  usingComponent: {}
}

export default Index;
