import superagent from 'superagent';
import axios from 'axios';
import { encrypt } from '@/utils/des';
import { host, tokenPrefix } from './host';

// params = {
//   pageSize: '15',
//   page: '1',
//   status: '5',//状态筛选(1 待评价 ，5 已评价)
//   isvPin: userData.pin,
//   open_id_isv: userData.open_id,
//   xid_isv: userData.xid,
//   filter: {
//     // firstCategory: '12259',
//   },
// }
export const comments = (comments_type, isvPin, params) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`${host}/jingdong/comments/query/${comments_type}`, params, {
        headers: {
          AssessKey: encrypt(`${isvPin}.pin`),
        },
      })
      .then(
        (res) => {
          resolve(res.data);
        },
        (err) => {
          reject(err);
        },
      );
  });
};

export const getShareInfo = (master_user_id) => {
  return new Promise((resolve, reject) => {
    axios.get(`${host}/jingdong/interactive/share/${master_user_id}`, {}, {}).then(
      (res) => {
        resolve(res.data);
      },
      (err) => {
        reject(err);
      },
    );
  });
};

// params
// {
//   "master_user_id": "user-1",
//   "guest_user_id": "123456",
//   "share_count": 1,
//   "new_coupon_sum_count": 1,
//   "use_coupon_count": 1
// }
// - 主态分享成功后(客态点了链接) 前端将 share_count +1 后传给后端。
// - 前端根据last_share_time 与当前时间比，如果超过24h，不在领分享券。
// - 抄购物车后(客态点了抄购物车) ，前端将new_coupon_sum_count + 1 传给后端
// - 主态使用券后 前端将use_coupon_count + 1 传给后端
export const updateShareInfo = (guest_user_id, params) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`${host}/jingdong/interactive/share/${guest_user_id}`, params, {
        headers: {
          AssessKey: encrypt(`${guest_user_id}.user`),
        },
      })
      .then(
        (res) => {
          resolve(res.data);
        },
        (err) => {
          reject(err);
        },
      );
  });
};

// 做任务
export const doInteraction = (
  pin,
  sourceCode = 'acejlsd0511',
  appKey = '22F9B25A2BAE142B08EE9F4CFA5E0D17',
  encryptProjectId = '28jzP5wv6PqfbnUNcCyxhW7QGNZM',
  encryptAssignmentId = 'FUj328TKLwFbDf8dP3fAgbNe7dY', // 拉新任务,
  // encryptAssignmentId = '2EupKxwiyTMzmRh6e1C77rxqeW2P'// 分享任务,
) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`${host}/jingdong/interactive/do`, {
        sourceCode,
        appKey,
        encryptProjectId: encrypt(encryptProjectId),
        account: pin,
        encryptAssignmentId,
        actionType: 1,
      })
      .then(
        (res) => {
          resolve(res);
        },
        (err) => {
          reject(err);
        },
      );
  });
};

// 做任务
export const doInteraction1 = (
  pin,
  sourceCode = 'acecslb',
  appKey = 'A27EE373C300A88B977AE5888F220F47',
  encryptProjectId = 'i6XsUBwxV2p6a5n4exn5vPTp3VK',
  encryptAssignmentId = '3aRWkBYzjBv2gQLabnJ3fTAyVefn',
) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`${host}/jingdong/interactive/do`, {
        sourceCode,
        appKey,
        encryptProjectId: encrypt(encryptProjectId),
        account: pin,
        encryptAssignmentId,
        actionType: 1,
      })
      .then(
        (res) => {
          resolve(res);
        },
        (err) => {
          reject(err);
        },
      );
  });
};

export const getInteractive = (
  pin,
  sourceCode = 'acejlsd0511',
  appKey = '22F9B25A2BAE142B08EE9F4CFA5E0D17',
  encryptProjectId = '28jzP5wv6PqfbnUNcCyxhW7QGNZM',
) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`${host}/jingdong/interactive/query`, {
        sourceCode,
        appKey,
        encryptProjectId: encrypt(encryptProjectId),
        account: pin,
      })
      .then(
        (res) => {
          resolve(res.data);
        },
        (err) => {
          reject(err);
        },
      );
  });
};
