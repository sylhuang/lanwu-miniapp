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
    const { total } = await db.collection('Users').count();
    const id = total.toString().padStart(6, '0');
    await db.collection('Users').add({
      data: {
        _id: id,
        _openid: OPENID,
        name: `meeple${id}`,
        alias: null,
        roles: ['user'],
        balance: 0,
        wallet: [{
          card_id: Date.now(),
          card_type: 'guest',
          activation_date: new Date(),
          expiration_date: null,
          balance: null,
        }]
      }
    });

    user = await db.collection('Users').doc(id)
      .get()
      .then(res => res.data);
  }

  return user ? ({
    id: user._id,
    name: user.name,
    alias: user.alias,
    roles: user.roles,
    balance: user.balance,
    wallet: user.wallet.map(card => ({
      id: card.card_id,
      type: card.card_type,
      activation: card.activation_date,
      expiration: card.expiration_date,
      balance: card.balance,
    }))
  }) : null;
}