// 云函数入口文件
const cloud = require('wx-server-sdk');
const getHolidaysByYear = require('./getHolidaysByYear');
const updateHolidaysByYear = require('./updateHolidaysByYear');

// 初始化 cloud
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
});

// 云函数入口函数
exports.main = async (event, context) => {
  const { action } = event;

  switch (action) {
    case 'getHolidaysByYear':
      return await getHolidaysByYear.main(event, context);
    default:
      return updateHolidaysByYear.main(event, context);
  }
}