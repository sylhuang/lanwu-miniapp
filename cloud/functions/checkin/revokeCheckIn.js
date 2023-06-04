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
    date,
  } = event.data;

  if (!id) {
    return null;
  }

  const checkDate = date ? new Date(date) : new Date();
  checkDate.setHours(0, 0, 0);
  const endDate = new Date(checkDate);
  endDate.setDate(endDate.getDate() + 1);

  const _ = db.command;
  const visit = await db.collection('Visits').where({
    user_id: id,
    date: _.and(_.gte(checkDate), _.lt(endDate)),
  }).get().then(res => res.data.length ? res.data[0] : null);

  if (!visit) {
    return null;
  }

  await cloud.callFunction({
    name: 'card',
    data: {
      action: 'chargeCardById',
      data: {
        id,
        cardId: visit.card_id,
        date,
        revoke: true,
      }
    }
  });

  const {
    stats
  } = await db.collection('Visits').doc(visit._id).remove();

  return ({
    revoked: Boolean(stats.removed),
  })
}