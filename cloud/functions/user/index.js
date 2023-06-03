const getUserById = require('./getUserById');
const updateUserInfo = require('./updateUserInfo');
const grantAdminById = require('./grantAdminById');

// 云函数入口函数
exports.main = async (event, context) => {
  const { action } = event;

  switch (action) {
    case 'getUserById':
      return await getUserById.main(event, context);
    case 'updateUserInfo':
      return await updateUserInfo.main(event, context);
    case 'grantAdminById':
      return await grantAdminById.main(event, context);
    default:
      return null;
  }
}