// 云函数入口文件
const cloud = require('wx-server-sdk');
const getCheckInStatus = require('./getCheckInStatus');

// 初始化 cloud
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

exports.main = async (event, context) => {
  const {
    id,
    cardId
  } = event.data;

  if (!id || !cardId) {
    return null;
  }

  const status = await getCheckInStatus.main(event, context);

  if (!status || status.isCheckedIn) {
    return null;
  }

  const { result: validCards } = await cloud.callFunction({
    name: 'card',
    data: {
      action: 'getValidCards',
      data: {
        id,
      }
    }
  });

  if (!validCards.find(validCard => validCard.id === cardId)) {
    return null;
  }

  const { _id } = await db.collection('Visits').add({
    data: {
      user_id: id,
      card_id: cardId,
      date: new Date(),
    }
  });

  await cloud.callFunction({
    name: 'card',
    data: {
      action: 'chargeCardById',
      data: {
        id,
        cardId,
      }
    }
  });

  return await db.collection('Visits').doc(_id).get().then(res => res.data);
}