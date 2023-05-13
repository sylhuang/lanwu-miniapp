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

  const validCards = await cloud.callFunction({
    name: 'card',
    data: {
      action: 'getValidCards',
      data: {
        id,
      }
    }
  });

  if (!id || !cardId || !status || status.isCheckedIn) {
    return null;
  }

  const card = await db.collection('Users')
    .aggregate()
    .match({
      _id: id
    })
    .unwind('$wallet')
    .replaceRoot({
      newRoot: '$wallet'
    })
    .match({
      card_id: cardId
    })
    .end();

  const { _id } = await db.collection('Visits').add({
    data: {
      user_id: id,
      card_id: cardId,
      date: new Date(),
    }
  });

  return await db.collection('Visits').doc(_id).get().then(res => res.data);
}