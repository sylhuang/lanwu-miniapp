const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  const { year } = event.data;

  return await db.collection('Holidays').where({ year }).field({ days: true }).get().then(res => {
    if (!res.data.length) {
      return ({
        holidays: [],
        workdays: [],
      });
    }

    const { days } = res.data[0];
    const holidays = days.filter(d => d.isOffDay).map(d => new Date(d.date));
    const workdays = days.filter(d => !d.isOffDay).map(d => new Date(d.date));

    return ({
      holidays,
      workdays,
    });
  });
}