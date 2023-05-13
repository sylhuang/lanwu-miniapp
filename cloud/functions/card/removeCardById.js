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
  } = event.data;

  if (!id || !cardId) {
    return null;
  }

  const _ = db.command;
  const { stats } = await db.collection('Users').doc(id)
    .update({
      data: {
        wallet: _.pull({
          card_id: cardId,
        }),
      },
    });

  if (stats.updated) {
    return await db.collection('Users').doc(id).field({
      wallet: true,
    }).get().then(res => ({
      id,
      wallet: res.data.wallet.map(card => ({
        id: card.card_id,
        type: card.card_type,
        activation: card.activation_date,
        expiration: card.expiration_date,
        balance: card.balance,
      })),
    }));
  }

  return null;
}