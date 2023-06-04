// 云函数入口文件
const cloud = require('wx-server-sdk');
const activateCardById = require('./activateCardById');
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
    cardId,
    date,
    revoke,
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

  if (!card) {
    return null;
  }

  if (!card.activation_date) {
    await activateCardById.main(event, context);
  }

  const chargeDate = date ? new Date(date) : new Date();

  if (card.expiration_date && card.expiration_date < chargeDate) {
    return null;
  }

  const { result: { isOffDay } } = await cloud.callFunction({
    name: 'holiday',
    data: {
      action: 'checkHolidayByDate',
      data: {
        date: chargeDate,
      }
    }
  });

  const _ = db.command;

  switch(card.card_type) {
    case CardTypes.Annual:
    case CardTypes.Seasonal:
      break;
    case CardTypes.Times:
      if (card.balance <= 0 && !revoke) {
        return;
      }

      const cardBalanceAdjustment = (revoke ? -1 : 1) * (isOffDay ? -1 : -0.5);
      await db.collection('Users').doc(id)
        .update({
          data: {
            [`wallet.${cardIndex}.balance`]: _.inc(cardBalanceAdjustment),
          },
        });
      break;
    case CardTypes.Guest:
      const userBalanceAdjustment = (revoke ? -1 : 1) * (isOffDay ? -38 : -19);
      await db.collection('Users').doc(id)
        .update({
          data: {
            balance: _.inc(userBalanceAdjustment),
          },
        });
      break;
    default:
      return null;
  }

  return await db.collection('Users').doc(id).field({
    wallet: true
  }).get().then(res => {
    const chargedCard = res.data.wallet.find(c => c.card_id === cardId);

    return ({
      id: chargedCard.card_id,
      type: chargedCard.card_type,
      activation: chargedCard.activation_date,
      expiration: chargedCard.expiration_date,
      balance: chargedCard.balance,
    });
  });
}