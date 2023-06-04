// 云函数入口文件
const cloud = require('wx-server-sdk');

// 初始化 cloud
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();
const SUPERUSER = "superuser";
const ADMIN = "admin";

exports.main = async (event, context) => {
  const {
    OPENID
  } = cloud.getWXContext();

  // Get the user if exists
  let [user] = await db.collection('Users').where({
      _openid: OPENID
    })
    .get()
    .then(res => res.data);

  const {
    id,
    grant = true,
  } = event.data;

  if (!id || !user || !user.roles.includes(SUPERUSER)) {
    return null;
  }

  const _ = db.command;
  const {
    stats
  } = await db.collection('Users').doc(id)
    .update({
      data: {
        roles: grant ? _.addToSet(ADMIN) : _.pull(ADMIN),
      },
    });

  return stats ? ({
    id,
  }) : null;
}