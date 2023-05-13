const cloud = require('wx-server-sdk');
const fetch = require('node-fetch');

// 初始化 cloud
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  const update = async (year) => {
    const data = await fetch(`https://raw.githubusercontent.com/NateScarlet/holiday-cn/master/${year}.json`)
      .then(res => {
        if (res.status !== 200) {
          return null;
        }
        return res.json();
      })
      .catch(() => null);

    if (data) {
      const dataJson = {
        year: data.year,
        days: data.days,
      };

      const exist = await db.collection('Holidays')
        .where({ year })
        .get()
        .then(res => Boolean(res.data.length));

      if (exist) {
        await db.collection('Holidays').where({ year }).update({
          data: dataJson,
        });
      } else {
        await db.collection('Holidays').add({
          data: dataJson,
        });
      }
    }
  }
  
  const currentYear = new Date().getFullYear();
  await update(currentYear);
  await update(currentYear + 1);
  return currentYear;
}