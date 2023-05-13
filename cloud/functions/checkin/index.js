const getCheckInStatus = require('./getCheckInStatus');
const checkin = require('./checkin');

// 云函数入口函数
exports.main = async (event, context) => {
  const { action } = event;

  switch (action) {
    case 'getCheckInStatus':
      return await getCheckInStatus.main(event, context);
    case 'checkin':
      return await checkin.main(event, context);
    // case 'updateUserInfo':
    //   return await updateUserInfo.main(event, context);
    // case 'addCardByType':
    //   return await addCardByType.main(event, context); 
    // case 'removeCardById':
    //   return await removeCardById.main(event, context);
    // case 'activateCardById':
    //   return await activateCardById.main(event, context);
    default:
      return null;
  }
}