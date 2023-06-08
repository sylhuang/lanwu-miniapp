import { FC, ReactNode, useEffect } from 'react'
import Taro from '@tarojs/taro'
import { Provider } from 'react-redux'

import './app.less'
import store from './store';

const App: FC = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    if (process.env.TARO_ENV === 'weapp') {
      Taro.cloud.init()
    }
    Taro.loadFontFace({
      global: true,
      family: 'Alibaba Puhui',
      source: 'url(https://puhuiti.oss-cn-hangzhou.aliyuncs.com/AlibabaPuHuiTi/Alibaba-PuHuiTi-Regular/Alibaba-PuHuiTi-Regular.otf)'
    })
  }, [])

  //TODO: User信息放入全局model
  return (
    <Provider store={store}>
      <>{children}</>
    </Provider>
  );
}

export default App
