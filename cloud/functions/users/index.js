const getOrCreateCurrentUser = require('./getOrCreateCurrentUser');
const getUsers = require('./getUsers');

// 云函数入口函数
exports.main = async (event, context) => {
  const { action } = event;

  switch (action) {
    case 'getOrCreateCurrentUser':
      return await getOrCreateCurrentUser.main(event, context);
    case 'getUsers':
      return await getUsers.main(event, context);
    case 'updateUser':
      return null;
    default:
      return null;
  }
}