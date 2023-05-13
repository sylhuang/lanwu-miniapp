const cloud = require('wx-server-sdk');
const getHolidaysByYear = require('./getHolidaysByYear');

// 初始化 cloud
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
});

// 云函数入口函数
exports.main = async (event, context) => {
  const {
    date
  } = event.data;

  if (!date) {
    return null;
  }

  const dateObj = new Date(date);
  dateObj.setHours(0, 0, 0);
  const year = dateObj.getFullYear();
  const day = dateObj.getDay();
  const {
    holidays,
    workdays
  } = await getHolidaysByYear.main({
    ...event,
    data: {
      year
    }
  }, context);
  const isWorkDay = Boolean(workdays.find(workday => {
    const caliWorkday = new Date(workday);
    caliWorkday.setHours(0, 0, 0);
    return caliWorkday.toISOString() === dateObj.toISOString();
  }));
  const isHoliday = Boolean(holidays.find(holiday => {
    const caliHoliday = new Date(holiday);
    caliHoliday.setHours(0, 0, 0);
    return caliHoliday.toISOString() === dateObj.toISOString();
  }));

  return ({
    isOffDay: isHoliday || ((day == 0 || day == 6) && !isWorkDay),
  });
}