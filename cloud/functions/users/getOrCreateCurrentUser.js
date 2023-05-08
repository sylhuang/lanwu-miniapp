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
  const [user] = await db.collection('Users').where({
    _openid: OPENID
  })
  .get()
  .then(res => res.data);

  if (user) {
    return user;
  }

  // Create the user if not found
  const {
    total
  } = await db.collection('Users').count();
  const newUser = {
    _id: total.toString().padStart(6, '0'),
    _openid: OPENID,
    name: '',
    role: 'user',
    balance: 0,
    wallet: [{
      card_id: Date.now(),
      card_type: 'guest',
      active: true,
      activation_date: Date.now(),
      expiration_date: null,
      balance: null,
    }]
  };

  return await db.collection('Users')
    .add({
      data: newUser
    })
    .then(() => newUser);
}