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
    OPENID
  } = cloud.getWXContext();

  // Get the user if exists
  let [user] = await db.collection('Users').where({
    _openid: OPENID
  })
    .get()
    .then(res => res.data);

  if (!user) {
    return null;
  }

  const today = new Date().setHours(0, 0, 0);
  const visit = await db.collection('Visits').where({
    user_id: user._id,
    date: db.command.gte(today)
  }).get().then(res => res.data.length ? res.data[0] : null);

  return ({
    isCheckedIn: !!visit,
    cardId: visit ? visit.card_id : null,
  });
}