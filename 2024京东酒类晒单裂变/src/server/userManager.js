import superagent from 'superagent';
import axios from 'axios';
import { encrypt } from '@/utils/des';
import { host, tokenPrefix } from './host';
export const userLogin = (
  source = '01',
  token = 'AAFmngq6ADCNGhBPAcAqafi2q5vCQ3PCNrvsjHD73EXBjOdI1ots2kudt_OCSdfRb0-TaeTlLCo',
  params = {},
) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`${host}/login/${source}`, params, {
        headers: {
          Authorization: token,
        },
      })
      .then(
        (res) => {
          resolve(res.data.data);
        },
        (err) => {
          reject(err);
        },
      );
  });
};

export const getUserInfo = (user_id) => {
  return new Promise((resolve, reject) => {
    superagent
      .get(`${host}/user/${user_id}`)
      .set('token', encrypt(`${tokenPrefix}.user`))
      .send({})
      .then(
        (res) => {
          resolve(res.body);
        },
        (err) => {
          reject(err);
        },
      );
  });
};

export const registerUser = (userInfo) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`${host}/user/register`, userInfo, {
        headers: {
          AssessKey: encrypt(`${userInfo.user_name}.user`),
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
