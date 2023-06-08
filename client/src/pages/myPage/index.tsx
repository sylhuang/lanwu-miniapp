import Taro, { useDidShow } from '@tarojs/taro'
import { View, Image, Button, Input, CommonEventFunction, RootPortal, Form } from '@tarojs/components'
import './index.less'
import { useState } from 'react';
import profileImage from '../../images/profileImage.png';

function MyPage({ dispatch }) {
  const [name, setName] = useState<string>("");
  const [id, setId] = useState<string>("");
  const [avatar, setAvatar] = useState<string>("");
  const [balance, setBalance] = useState<number>(0);
  const [visits, setVisits] = useState<number>(0);
  const [roles, setRoles] = useState<Array<string>>([]);
  const [showNamePopup, setShowNamePopup] = useState<boolean>(false);

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
  });

  const login = () => {
    Taro.cloud
      .callFunction({
        name: "login",
      })
      .then(res => {
        const result = res.result as CloudApi.LoginResult;
        if (result !== null) {
          Taro.setStorage({
            key: "id",
            data: result.id
          });
        }
      });
  };

  const getUserInfo = (userId) => {
    Taro.cloud
      .callFunction({
        name: "user",
        data: {
          action: "getUserById",
          data: {
            id: userId
          }
        }
      })
      .then(res => {
        const result = res.result as CloudApi.GetUserByIdResult;
        if (result !== null) {
          setId(result.id);
          setName(result.name);
          setBalance(result.balance);
          setVisits(result.visits);
          setAvatar(result.avatar);
          setRoles(result.roles);
        }
      });
  };

  const handleChooseAvatar: CommonEventFunction = (e) => {
    const { avatarUrl } = e.detail;
    setAvatar(avatarUrl);
    uploadImage(avatarUrl);
  };

  const uploadImage = (filePath: string) => {
    Taro.cloud.uploadFile({
      cloudPath: `${id}-avatar.jpg`,
      filePath,
      success: (res) => {
        updateUserInfo(id, { avatar: res.fileID });
      },
      fail: (res) => {
        console.log(res.errMsg);
      }
    })
  };

  const updateUserInfo = (userId, payload) => {
    Taro.cloud
      .callFunction({
        name: "user",
        data: {
          action: "updateUserInfo",
          data: {
            id: userId,
            ...payload,
          }
        }
      })
      .then(res => {
        const result = res.result as CloudApi.UpdateUserInfoResult;
        if (result !== null) {
          setName(result.name);
          setAvatar(result.avatar);
        }
      })
  };

  const handleSubmit: CommonEventFunction = (e) => {
    updateUserInfo(id, e.detail.value);
    setShowNamePopup(false);
  }

  const getNamePopup = () => {
    return (
      <RootPortal>
        <View className='popup'>
          <View className='form-container'>
            <Form onSubmit={handleSubmit}>
              <Input className="form-input" name="name" placeholder="请输入新昵称" maxlength={12} />
              <View className="form-btns">
                <Button formType='submit' type="primary" size="mini">保存</Button>
                <Button size="mini" onClick={() => setShowNamePopup(false)}>取消</Button>
              </View>
            </Form>
          </View>
        </View>
      </RootPortal>
    );
  }

  return (
    <View className='main'>
      <Button className="avatar-wrapper" open-type="chooseAvatar" onChooseAvatar={handleChooseAvatar}>
        <Image className='avatar' src={avatar || profileImage}></Image>
      </Button>
      <View className='profileInfo'>
        <View className='name' onClick={() => setShowNamePopup(true)}>{name}</View>
        {
          showNamePopup && getNamePopup()
        }
        <View className='id'>UID: {id}</View>
      </View>
      <View className='wallet'>
        <View className='walletInfo'>余额：{balance} ￥</View>
        <View className='walletInfo'>总出勤次数：{visits} 次</View>
      </View>
      <View className='functions'>
        <View className='function'>
          约局（暂待开发）
        </View>
        <View className='function'>
          出勤历史（暂待开发）
        </View>
        {
          (roles.includes('admin') || roles.includes('superuser')) && (
            <View className='function admin'>
              管理员入口
            </View>
          )
        }
      </View>
    </View>
  )
}

MyPage.config = {
  navigationBarTitleText: '我的',
  usingComponent: {}
}

export default MyPage
