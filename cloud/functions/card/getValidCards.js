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
    date,
  } = event.data;

  if (!id) {
    return null;
  }

  const _ = db.command;
  const {
    list
  } = await db.collection('Users')
    .aggregate()
    .match({
      _id: id
    })
    .unwind('$wallet')
    .replaceRoot({
      newRoot: '$wallet'
    })
    .match({
      expiration_date: _.eq(null).or(_.gt(date ? new Date(date) : new Date())),
    })
    .match({
      balance: _.eq(null).or(_.gt(0))
    })
    .end();

  return list.map(card => ({
    id: card.card_id,
    type: card.card_type,
    activation: card.activation_date,
    expiration: card.expiration_date,
    balance: card.balance,
  })).sort((a, b) => {
    const getOrder = (c) => {
      switch (c.card_type) {
        case CardTypes.Annual:
          return 0;
        case CardTypes.Seasonal:
          return 1;
        case CardTypes.Times:
          return 2;
        case CardTypes.Guest:
        default:
          return 3;
      }
    }
    
    return getOrder(a) - getOrder(b);
  });
}