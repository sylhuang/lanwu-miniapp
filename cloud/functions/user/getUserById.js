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
    id
  } = event.data;

  const { total } = await db.collection('Visits')
  .where({
    user_id: id,
  })
  .count();

  return await db.collection('Users')
    .doc(id)
    .get()
    .then(res => ({
      id: res.data._id,
      name: res.data.name,
      avatar: res.data.avatar,
      alias: res.data.alias,
      roles: res.data.roles,
      balance: res.data.balance,
      visits: total,
      wallet: res.data.wallet.map(card => ({
        id: card.card_id,
        type: card.card_type,
        activation: card.activation_date,
        expiration: card.expiration_date,
        balance: card.balance,
      })),
    }));
}