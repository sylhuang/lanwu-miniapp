import Taro, { Config } from '@tarojs/taro'

export default {
  namespace: 'index',
  state: {
  },
  reducers: {
    update(state, { payload }) {
      return { ...state, ...payload };
    },
  },
  effects: {
    * login({ payload }, { call, put, select }) {
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
    },
  },
};
