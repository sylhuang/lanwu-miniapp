const addCardByType = require('./addCardByType');
const removeCardById = require('./removeCardById');
const activateCardById = require('./activateCardById');
const getValidCards = require('./getValidCards');
const chargeCardById = require('./chargeCardById');

// 云函数入口函数
exports.main = async (event, context) => {
  const { action } = event;

  switch (action) {
    case 'addCardByType':
      return await addCardByType.main(event, context); 
    case 'removeCardById':
      return await removeCardById.main(event, context);
    case 'activateCardById':
      return await activateCardById.main(event, context);
    case 'getValidCards':
      return await getValidCards.main(event, context);
    case 'chargeCardById':
      return await chargeCardById.main(event, context);
    default:
      return null;
  }
}