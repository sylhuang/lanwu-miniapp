// 云函数入口文件
const cloud = require('wx-server-sdk');

// 初始化 cloud
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

exports.main = async (event, context) => {
  const {
    id,
  } = event.data;

  if (!id) {
    return null;
  }

  const userInfoKeys = Object.freeze(["balance", "name"]);
  const userInfo = {};

  userInfoKeys.forEach(key => {
    if (key in event.data) {
      userInfo[key] = event.data[key];
    }
  })

  const { stats } = await db.collection('Users').doc(id)
    .update({
      data: userInfo,
    });

  if (stats.updated) {
    return await db.collection('Users').doc(id).field({
      name: true,
      balance: true,
    }).get().then(res => ({
      id,
      name: res.data.name,
      balance: res.data.balance,
    }));
  }

  return null;
}