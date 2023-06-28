import { FC, ReactNode, useEffect } from 'react'
import Taro from '@tarojs/taro'
import './app.less'

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
      <>{children}</>
  );
}

export default App
