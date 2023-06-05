// import { newsListService, loginService } from '@/services';

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
    * getNewsList({ payload }, { call, put, select }) {
        console.log(1);
      // const res = yield call(newsListService.getList, {data: payload});
      // if (res){
      //   return res;
      // }
      // return false;
    },
  },
};
