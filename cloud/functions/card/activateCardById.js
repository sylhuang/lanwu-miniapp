// 云函数入口文件
const cloud = require('wx-server-sdk');
const {
  CardTypes
} = require('./cardTypes');

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

  const [card, cardIndex] = await db.collection('Users').doc(id).field({
    wallet: true
  }).get().then(res => {
    const card = res.data.wallet.find(c => c.card_id === cardId);
    const cardIndex = res.data.wallet.findIndex(c => c.card_id === cardId);

    return [card, cardIndex];
  });

  if (card && !card.activation_date && card.card_type === CardTypes.Seasonal) {
    const year = new Date().getFullYear();
    const month = new Date().getMonth();
    const activation = new Date(year, month, 1);
    const expiration = new Date(year, month + 3, 0, 23, 59, 59);

    const {
      stats
    } = await db.collection('Users').doc(id)
      .update({
        data: {
          [`wallet.${cardIndex}.activation_date`]: activation,
          [`wallet.${cardIndex}.expiration_date`]: expiration,
        },
      });

    if (stats.updated) {
      return await db.collection('Users').doc(id).field({
        wallet: true
      }).get().then(res => {
        const activatedCard = res.data.wallet.find(c => c.card_id === cardId);

        return ({
          id: activatedCard.card_id,
          type: activatedCard.card_type,
          activation: activatedCard.activation_date,
          expiration: activatedCard.expiration_date,
          balance: activatedCard.balance,
        });
      });
    }
  }

  return null;
}