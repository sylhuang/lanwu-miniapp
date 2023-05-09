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
    filter = {}
  } = event;

  return await db.collection('Users')
    .where(filter)
    .get()
    .then(res => res.data.map(user => ({
      id: user._id,
      name: user.name,
      roles: user.roles,
      balance: user.balance,
      wallet: user.wallet.map(card => ({
        id: card.card_id,
        type: card.card_type,
        activation: card.activation_date,
        expiration: card.expiration_date,
        balance: card.balance,
      })),
    })));
}