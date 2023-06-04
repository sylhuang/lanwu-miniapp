const getCheckInStatus = require('./getCheckInStatus');
const checkin = require('./checkin');
const revokeCheckIn = require('./revokeCheckIn');

// 云函数入口函数
exports.main = async (event, context) => {
  const { action } = event;

  switch (action) {
    case 'getCheckInStatus':
      return await getCheckInStatus.main(event, context);
    case 'checkin':
      return await checkin.main(event, context);
    case 'revokeCheckIn':
      return await revokeCheckIn.main(event, context);
    default:
      return null;
  }
}