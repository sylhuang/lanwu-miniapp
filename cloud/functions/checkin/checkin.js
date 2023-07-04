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
    cardId,
    date,
  } = event.data;

  if (!id || !cardId) {
    return null;
  }

  const { _id } = await db.collection('Visits').add({
    data: {
      user_id: id,
      card_id: cardId,
      date: date ? new Date(date) : new Date(),
    }
  });

  await cloud.callFunction({
    name: 'card',
    data: {
      action: 'chargeCardById',
      data: {
        id,
        cardId,
        date,
      }
    }
  });

  return await db.collection('Visits').doc(_id).get().then(res => ({
    id: _id,
    cardId: res.data.card_id,
    userId: res.data.user_id,
    date: res.data.date
  }));
}