import React, { useEffect, useState, useRef, useContext, useCallback } from 'react';
import { getRpx, reportWithoutJump, jumpOther } from '@/utils';
import { MockDataContext, getCouponStatus, HOUR_24_MS, getCoupon, getUserType } from '../Home';
import { ToastContext, UserContext } from '../../context/context';
import styles from '../Home.module.css';
import { updateShareInfo } from '@/server/dataManager';

const PrizeOne = ({ isStartAnimation }) => {
  const [hasGot, setHasGot] = useState(true);
  const payloadProps = useContext(MockDataContext);
  const { showToast } = useContext(ToastContext);
  const [hasGotToday, setHasGotToday] = useState(false);
  const {
    userData: { current: userData },
    userShareData,
    setUserShareData,
  } = useContext(UserContext);

  const shareAdID = payloadProps.shareAdID;
  const shareCouponData = useRef({});
  const getCouponInfo = async () => {
    const last_share_time = userShareData.current.last_share_time;

    if (last_share_time) {
      console.log(' shareCoupon last_share_time', last_share_time);
      // // 最后分享时间不在当天清空拉新状态
      const addDate = new Date(Number(last_share_time));
      const addYear = addDate.getFullYear();
      const addMonth = addDate.getMonth() + 1;
      const addDay = addDate.getDate();
      const nowDate = new Date();
      const year = nowDate.getFullYear();
      const month = nowDate.getMonth() + 1;
      const day = nowDate.getDate();
      if (addYear != year || addMonth != month || addDay != day) {
        console.log(' shareCoupon last_share_time clear', last_share_time);

        try {
          const res = await updateShareInfo(userData.user_id, {
            master_user_id: userData.user_id,
            share_count: 0,
          });
          console.log('parizeOne 不在当天 updateShareInfo', res.data);
          setUserShareData(res.data);
        }catch(e){
          console.log('parizeOne 不在当天 updateShareInfo error', e);
        }
      }
    }

    window.babel.babelAdvertInfoNew({ body: shareAdID }).then(
      async (res) => {
        if (res.code === '0') {
          const { list = [] } = res.data[`payload_${shareAdID}`];
          console.log('shareCoupon res.data', res.data);
          const shareCoupon = list[0];
          shareCouponData.current = shareCoupon?.extension || {};
          console.log('shareCoupon', shareCoupon);
          console.log('shareCoupon userShareData', userShareData.current);

          // 首次点击的主态切主态id为当前主态id，或分享次数大于0
          if (
            userShareData.current.share_count > 0 ||
            (getUserType().userType === 'guest' &&
              userData.first_click &&
              userData.is_first_login === 'true' &&
              userData.first_click === getUserType().master_user_id)
          ) {
            if (!shareCoupon?.extension) {
              setHasGot(true);
              return;
            }

            // 最终都会更具优惠券状态判断是否领取成功，在更新显示状态
            const couponStatus = getCouponStatus(shareCoupon.extension.cpnResultCode);
            console.log('shareCoupon couponStatus', couponStatus);
            if (couponStatus == 'hasGot') {
              setHasGot(true);
              setHasGotToday(true);
            } else if (couponStatus == 'noMore') {
              setHasGot(true);
            } else {
              setHasGot(false);
            }
          } else {
            setHasGot(true);
          }
        }
      },
      () => {},
    );
  };
  useEffect(() => {
    getCouponInfo();
  }, []);

  const handleShareBtnClick = useCallback(() => {
    reportWithoutJump('qufenxiang');
    const alertUrl =
      'https://pro.m.jd.com/mall/active/puMw46gRgkDKJdKNTtdGvnFAXUx/index.html?babelChannel=ttt3';
    // const alertUrl = 'https://pro.m.jd.com/mall/active/3XC476rzxWSkDaHdR4ru1YxeXgZE/index.html';
    const shareUrl = `${alertUrl}&user_id=${userData.user_id}`;
    console.log('点击分享按钮 shareUrl', shareUrl);

    window.jmfe.callSharePane({
      title: '分享晒单赢1499飞天茅台抢购资格，复制打开京东参与',
      content: '分享晒单赢1499飞天茅台抢购资格，复制打开京东参与',
      url: shareUrl,
      img: payloadProps.shareImg,
      channel: 'Wxfriends,Wxmoments,QRCode,CopyURL',
      qrparam: {
        //   "top_pic": "", //频道名图片的地址
        //   "mid_pic": "", //中间大图的地址
        //   "slogan": "", //频道/活动口号
        //   "qr_title": "", //标题文字
        //   "qr_content": "", //运营语文字
        //   "qr_type": "", //模式
        //   "mid_pic_x": "", //京海报模式背景图片的地址
        qr_direct:
          'http://m.360buyimg.com/babel/jfs/t1/239780/6/7362/157194/6650dd15F9efcfef6/c1a96e0cc6e039a8.png', //自定义二维码图片
      },
      keyparam: {
        url: shareUrl,
        keyEndTime: new Date().getTime() + Number(86400000),
        keyChannel: 'Wxfriends,QQfriends,Wxmoments,QQzone,Sinaweibo',
        sourceCode: 'babel',
        keyImg:
          'https://m.360buyimg.com/n1/s120x120_jfs/t2566/341/1119128176/23675/6356333b/568e3d86Naa36a750.jpg',
        keyId: '11', //活动标识传参规则,详情查看京口令使用规范&调用方式
        keyTitle: '分享晒单赢1499飞天茅台抢购资格，复制打开京东参与',
        keyContent: '分享晒单赢1499飞天茅台抢购资格，复制打开京东参与',
      },
    });

    const addReminderKey = 'addReminderKey';
    if (localStorage.getItem(addReminderKey)) {
      let time = localStorage.getItem(addReminderKey);
      const addDate = new Date(Number(time));
      const addYear = addDate.getFullYear();
      const addMonth = addDate.getMonth() + 1;
      const addDay = addDate.getDate();
      const nowDate = new Date();
      const year = nowDate.getFullYear();
      const month = nowDate.getMonth() + 1;
      const day = nowDate.getDate();
      if (addYear === year && addMonth === month && addDay === day) {
        return;
      }
    }
    localStorage.setItem(addReminderKey, new Date().getTime());

    // tag 不能大于4个字
    window.jmfe
      .addReminder({
        id: window.babelShareData.activityId,
        tag: '晒单好礼',
        nTime: 0,
        permissionStr: '2',
        title: 'Hello~您分享给好友的晒单赢好礼活动快去看看进度吧，点击下方链接速达！',
        // "time": new Date().getTime() + 1 * 24 * 60 * 60 * 1000,// 第二天早上10点
        time: new Date(new Date().getTime() + 1 * 24 * 60 * 60 * 1000).setHours(10, 0, 0, 0), // 第二天早上10点
        type: 'HUDONG',
        url: 'https://pro.m.jd.com/mall/active/puMw46gRgkDKJdKNTtdGvnFAXUx/index.html?babelChannel=ttt2',
      })
      .then(
        ({ appointed, ...rest }) => {
          console.log('addReminder', appointed, rest);
          if (appointed) {
            showToast('预约成功');
          } else {
            showToast('预约失败');
          }
        },
        () => {},
      );
  });

  const handleGetCouponBtnClick = useCallback(async () => {
    console.log('PrizeOne handleGetCouponBtnClick', shareCouponData.current);
    const res = await getCoupon(shareCouponData.current);
    if (res === 'success') {
      getCouponInfo();
      showToast('领取成功正在前往使用...', 2000);
      setTimeout(() => {
        jumpOther(`https://so.m.jd.com/list/couponSearch.action?couponbatch=${shareCouponData.current.batchId}`, 'youhuijuan')
      }, 2000);
      
    } else if (res === 'soldout') {
      showToast('优惠券已领完');
    } else {
      showToast(res);
    }
  }, []);

  return (
    <div
      className={isStartAnimation && styles.animeFlip1}
      style={{
        position: 'absolute',
        left: getRpx(57),
        top: getRpx(120),
        transform: 'rotateY(180deg)',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: getRpx(315),
          height: getRpx(510),
        }}
      >
        <img
          style={{
            position: 'absolute',
            width: '100%',
          }}
          src={hasGotToday ? payloadProps.shareHasGotToday : payloadProps.sharPriceImg}
          alt="sharPriceImg"
        />
        <div
          style={{
            position: 'absolute',
            width: getRpx(229),
            height: getRpx(73.5),
            left: getRpx(40),
            top: getRpx(360),
          }}
        >
          {hasGot ? (
            <img
              style={{
                width: '100%',
              }}
              src={payloadProps.BdNoImg}
              alt="去分享"
              onClick={handleShareBtnClick}
            />
          ) : (
            <img
              style={{
                width: '100%',
              }}
              src={payloadProps.BdGoImg}
              alt="去领取"
              onClick={handleGetCouponBtnClick}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PrizeOne;
