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
  const [isCheckingIn, setIsCheckingIn] = useState(false);

  useEffect(() => {
    Taro.getStorage({
      key: 'id',
      fail: function () {
        login();
      },
      success: function (res) {
        setId(res.data);
        getValidCards(res.data);
        getCheckInStatus(res.data);
      },
    })
  }, []);

  const login = () => {
    Taro.cloud
      .callFunction({
        name: "login",
      })
      .then(res => {
        if (res.result !== null) {
          const { id } = res.result;
          Taro.setStorage({
            key: "id",
            data: res.result.id
          });
        }
      })
  }

  const getValidCards = (userId) => {
    Taro.cloud
      .callFunction({
        name: "card",
        data: {
          action: "getValidCards",
          data: {
            id: userId
          }
        }
      })
      .then(res => {
        if (res.result !== null) {
          setWallet(res.result);
        }
      })
  }

  const getCheckInStatus = (userId) => {
    Taro.cloud
      .callFunction({
        name: "checkin",
        data: {
          action: "getCheckInStatus",
          data: {
            id: userId
          }
        }
      })
      .then(res => {
        if (res.result !== null) {
          const { isCheckedIn } = res.result;
          setCheckInStatus(isCheckedIn);
        }
      })
  }

  const checkIn = () => {
    if (isCheckingIn) {
      return;
    }
    
    setIsCheckingIn(true);
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
        if (res.result !== null) {
          getValidCards(id);
          setCheckInStatus(true);
          Taro.showToast({
            title: '打卡成功',
            icon: 'success',
            duration: 2000
          })
        } else {
          Taro.showToast({
            title: '打卡失败',
            icon: 'error',
            duration: 2000
          })
        }
        setIsCheckingIn(false);
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
                <View className={`swiper ${item.type}`}>
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
          <View className='checkIn checked'>
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
