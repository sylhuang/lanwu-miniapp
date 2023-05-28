export default {
  pages: [
    'pages/index/index',
    'pages/myPage/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    color: '#666',
    selectedColor: '#1684FC',
    backgroundColor: '#fff',
    list: [
      {
        pagePath: 'pages/index/index',
        text: '卡包'
      },
      {
        pagePath: 'pages/myPage/index',
        text: '我的'
      }
    ]
  },
  cloud: true,
}
