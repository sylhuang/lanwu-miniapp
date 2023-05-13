const addCardByType = require('./addCardByType');
const removeCardById = require('./removeCardById');
const activateCardById = require('./activateCardById');
const getValidCards = require('./getValidCards');

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
    default:
      return null;
  }
}