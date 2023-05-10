// 云函数入口文件
const cloud = require('wx-server-sdk');

// 初始化 cloud
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

exports.main = async (event, context) => {
  const {
    id,
  } = event.data;

  if (!id) {
    return null;
  }

  const _ = db.command;
  const { list } = await db.collection('Users')
    .aggregate()
    .match({
      _id: id
    })
    .unwind('$wallet')
    .replaceRoot({
      newRoot: '$wallet'
    })
    .match({
      expiration_date: _.eq(null).or(_.gt(new Date()))
    })
    .end();

    return list;
}