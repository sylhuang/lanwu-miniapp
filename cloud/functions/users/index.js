const getOrCreateCurrentUser = require('./getOrCreateCurrentUser');
const getUsers = require('./getUsers');
const updateUserInfo = require('./updateUserInfo');
const addCardByType = require('./wallet/addCardByType');

// 云函数入口函数
exports.main = async (event, context) => {
  const { action } = event;

  switch (action) {
    case 'getOrCreateCurrentUser':
      return await getOrCreateCurrentUser.main(event, context);
    case 'getUsers':
      return await getUsers.main(event, context);
    case 'updateUserInfo':
      return await updateUserInfo.main(event, context);
    case 'addCardByType':
      return await addCardByType.main(event, context); 
    default:
      return null;
  }
}