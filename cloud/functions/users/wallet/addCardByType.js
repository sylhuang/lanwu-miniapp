// 云函数入口文件
const cloud = require('wx-server-sdk');
const { CardTypes } = require('./cardTypes');

// 初始化 cloud
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

exports.main = async (event, context) => {
  const {
    id,
    type,
  } = event.data;

  if (!id || !type) {
    return null;
  }

  const newCard = {
    card_id: Date.now(),
    card_type: type,
  };
  const year = new Date().getFullYear();

  switch (type) {
    case CardTypes.Annual:
      newCard.activation_date = new Date(year, 4, 20).toISOString();
      newCard.expiration_date = new Date(year + 1, 4, 19).toISOString();
      newCard.balance = null;
      break;
    case CardTypes.Seasonal:
      newCard.activation_date = null;
      newCard.expiration_date = null;
      newCard.balance = null;
      break;
    case CardTypes.Times:
      newCard.activation_date = new Date(year, 4, 20).toISOString();
      newCard.expiration_date = new Date(year + 1, 4, 19).toISOString();
      newCard.balance = 10;
      break;
    default:
      return null;
  }

  const { stats } = await db.collection('Users').doc(id)
    .update({
      data: {
        wallet: db.command.push(newCard),
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