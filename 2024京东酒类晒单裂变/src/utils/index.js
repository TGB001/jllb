import * as tunnel from '../share/tunnel';
import { getBabelEnv } from '../share/env';

let bridge = null;
let isInit = false;

export const initUtils = (init) => {
  bridge = init.bridge;
  isInit = true;
};

const ratioDeps = document.body.clientWidth / 1125;
const ratioDeps1x = document.body.clientWidth / 375;
export const getRpx = (value) => {
  const nv = Number(value);
  return ratioDeps * nv;
};

export const loadCart = () => {
  if (!window.AddcartToolObj) {
    const script = document.createElement('script');
    script.src = 'https://jstatic.3.cn/common/cart/h5_deal_addcart.v1.3.js?t=20230724';
    document.body.appendChild(script);
  }
};

export const imgUri = (str) => {
  return str.indexOf('http') === 0 ? str : `https:${str}`;
};

export const getRpx1x = (value) => {
  const nv = Number(value);
  return Math.floor(ratioDeps1x * nv);
};

export const isJDApp = () => {
  return /^jdapp/i.test(navigator.userAgent);
};

export const isIOS = () => {
  return !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
};

export const isAndroid = () => {
  return !navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
};

export const isWeixin = () => {
  return navigator.userAgent.toLowerCase().indexOf('micromessenger') >= 0;
};

export const addCart = (skuList) => {
  if (!bridge) return;
  const commArr = skuList.map((skuId) => {
    return { skuId, num: 1, itype: 1 };
  });
  return new Promise((resolve, reject) => {
    bridge.then((babelBridge) =>
      babelBridge.loadCartJs().then(
        () => {
          window.AddcartToolObj &&
            window.AddcartToolObj.addCart({
              commArr,
              source: 'm',
              loginType: 2,
              sucFun: (res) => {
                if (res.errId === '13') {
                  babelBridge.goLogin();
                } else if (res.errId === '0' && res.cartJson) {
                  resolve(res);
                }
              },
              failFun: (err) => {
                reject(err);
              },
            });
        },
        () => {},
      ),
    );
  });
};

const reportPoint = (eventId, event_params, json_params = { des: 'm' }) => {
  return tunnel.tracking(eventId, JSON.stringify(event_params), JSON.stringify(json_params));
};

export const reportWithoutJump = (eventId, env = getBabelEnv()) => {
  reportPoint(`Babel_dev_other_${eventId}`, {
    pageID: window.babelShareData.pageId,
    mid: env.moduleId,
    aid: env.activityId,
    fno: document.querySelector(`.module_${env.moduleId}`).getAttribute('data-floornum'),
  });
};

export const reportSkuWithoutJump = (eventId, { skuId, skuGroupId }, env = getBabelEnv()) => {
  reportPoint(`Babel_dev_sku_${eventId}`, {
    mid: env.moduleId,
    aid: env.activityId,
    sku: skuId,
    sgid: skuGroupId,
    pageID: window.babelShareData.pageId,
    fno: document.querySelector(`.module_${env.moduleId}`).getAttribute('data-floornum'),
  });
};

export const jumpSku = (url, eventId, { skuId, skuGroupId }, env = getBabelEnv()) => {
  url = url.indexOf('https://') ? `https:${url}` : url;
  reportPoint(`Babel_dev_sku_${eventId}`, {
    mid: env.moduleId,
    aid: env.activityId,
    sku: skuId,
    sgid: skuGroupId,
    pageID: window.babelShareData.pageId,
    fno: document.querySelector(`.module_${env.moduleId}`).getAttribute('data-floornum'),
  }).then(
    () => {
      if (isJDApp()) {
        const params = `{"category":"jump","des":"m","url":"${url}"}`;
        window.location.href = `openapp.jdmobile://virtual?params=${encodeURIComponent(params)}`;
      } else {
        window.location.href = url;
      }
    },
    () => {},
  );
};

export const jumpOther = (url, eventId, env = getBabelEnv()) => {
  url = url.indexOf('https://') ? `https:${url}` : url;
  reportPoint(`Babel_dev_other_${eventId}`, {
    mid: env.moduleId,
    aid: env.activityId,
    pageID: window.babelShareData.pageId,
    fno: document.querySelector(`.module_${env.moduleId}`).getAttribute('data-floornum'),
  }).then(
    () => {
      if (isJDApp()) {
        const params = `{"category":"jump","des":"m","url":"${url}"}`;
        window.location.href = `openapp.jdmobile://virtual?params=${encodeURIComponent(params)}`;
      } else {
        window.location.href = url;
      }
    },
    () => {},
  );
};

export const jumpComment = (url, eventId, env = getBabelEnv()) => {
  url = url.indexOf('https://') ? `https:${url}` : url;
  reportPoint(`Babel_dev_other_${eventId}`, {
    mid: env.moduleId,
    aid: env.activityId,
    pageID: window.babelShareData.pageId,
    fno: document.querySelector(`.module_${env.moduleId}`).getAttribute('data-floornum'),
  }).then(
    () => {
      if (isJDApp()) {
        const params = `{"category":"jump","des":"commentCenter","jumpType":"2"}`;
        window.location.href = `openapp.jdmobile://virtual?params=${encodeURIComponent(params)}`;
      } else {
        window.location.href = url;
      }
    },
    () => {},
  );
};

export const jumpAdv = (url, eventId, { adId, adGroupId }, env = getBabelEnv()) => {
  url = url.indexOf('https://') ? `https:${url}` : url;
  reportPoint(`Babel_dev_adv_${eventId}`, {
    mid: env.moduleId,
    aid: env.activityId,
    adid: adId,
    sgid: adGroupId,
    pageID: window.babelShareData.pageId,
    fno: document.querySelector(`.module_${env.moduleId}`).getAttribute('data-floornum'),
  }).then(
    () => {
      if (isJDApp()) {
        const params = `{"category":"jump","des":"m","url":"${url}"}`;
        window.location.href = `openapp.jdmobile://virtual?params=${encodeURIComponent(params)}`;
      } else {
        window.location.href = url;
      }
    },
    () => {},
  );
};

Date.prototype.format = function () {
  var s = '';
  var mouth = this.getMonth() + 1 >= 10 ? this.getMonth() + 1 : '0' + (this.getMonth() + 1);
  var day = this.getDate() >= 10 ? this.getDate() : '0' + this.getDate();
  s += this.getFullYear() + '/'; // 获取年份。
  s += mouth + '/'; // 获取月份。
  s += day; // 获取日。
  return s; // 返回日期。
};

export const getAllDate = (begin, end) => {
  const dateList = [];
  const result = {};
  var ab = begin.split('/');
  var ae = end.split('/');
  var db = new Date();
  db.setUTCFullYear(ab[0], ab[1] - 1, ab[2]);
  var de = new Date();
  de.setUTCFullYear(ae[0], ae[1] - 1, ae[2]);
  var unixDb = db.getTime();
  var unixDe = de.getTime();
  for (var k = unixDb; k <= unixDe; ) {
    dateList.push(new Date(parseInt(k)).format());
    k = k + 24 * 60 * 60 * 1000;
  }

  dateList.forEach((date, index) => {
    const [year, month, day] = date.split('/');
    if (result[year]) {
      if (result[year][month]) {
        result[year][month].push(day);
      } else {
        result[year][month] = [day];
      }
    } else {
      result[year] = {};
      result[year][month] = [day];
    }
  });
};

export function debounce(func, delay) {
  let timeout;
  return function () {
    const _this = this;
    const args = [...arguments];
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      func.apply(_this, args);
    }, delay);
  };
}

export function getDisplayName(text) {
  let f = text[0];
  let l = text[text.length - 1];
  return f + '**' + l;
}
