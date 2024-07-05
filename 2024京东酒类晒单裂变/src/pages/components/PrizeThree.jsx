import React, { useEffect, useState, useRef, useContext, useCallback } from 'react';
import { getRpx } from '@/utils';
import { MockDataContext, getCouponStatus, getCoupon, getUserType } from '../Home';
import { ToastContext, UserContext } from '../../context/context';
import { updateShareInfo } from '@/server/dataManager';
import styles from '../Home.module.css';

const PrizeThree = ({ isStartAnimation }) => {
  const [hasGot, setHasGot] = useState(false);
  const [hasChance, setHasChance] = useState(false);
  const [helpCount, setHelpCount] = useState(0);

  const { showToast } = useContext(ToastContext);
  const payloadProps = useContext(MockDataContext);
  const {
    userData: { current: userData },
    userShareData,
    setUserShareData,
    allCompletionCnt,
  } = useContext(UserContext);

  const inviteAdID = payloadProps.inviteAdID;
  const inviteCouponData = useRef({});
  const getYaoXingInfo = () => {
    if (
      userShareData.current.new_coupon_sum_count > 0 &&
      userShareData.current.new_coupon_sum_count > userShareData.current.use_coupon_count
    ) {
      if (userShareData.current.use_coupon_count <= 2) {
        setHasChance(true);
      } else {
        setHasChance(false);
      }
    } else {
      setHasChance(false);
    }
  };
  const getCouponInfo = () => {
    window.babel.babelAdvertInfoNew({ body: inviteAdID }).then(
      async (res) => {
        setHelpCount(userShareData.current.new_coupon_sum_count);
        if (res.code === '0') {
          const { list = [] } = res.data[`payload_${inviteAdID}`];
          const shareCoupon = list[0];
          inviteCouponData.current = shareCoupon?.extension || {};
          console.log('inviteCouponData', shareCoupon);
          console.log('inviteCouponData userShareData', userShareData.current);

          if (shareCoupon?.extension) {
            // 最终都会更具优惠券状态判断是否领取成功，在更新显示状态
            const couponStatus = getCouponStatus(shareCoupon.extension.cpnResultCode);
            if (couponStatus == 'hasGot') {
              setHasGot(true);
              setHasChance(false);
            } else if (couponStatus == 'noMore') {
              setHasGot(true);
              setHasChance(false);
            } else {
              setHasGot(false);
              setHasChance(true);
              getYaoXingInfo();
            }
          }
        }
      },
      () => {},
    );
  };
  useEffect(() => {
    getCouponInfo();
  }, []);

  useEffect(() => {
    console.log('allCompletionCnt change', allCompletionCnt);
    setHelpCount(allCompletionCnt);
  }, [allCompletionCnt]);

  const handleGetCouponBtnClick = useCallback(async () => {
    const res = await getCoupon(inviteCouponData.current);
    if (res === 'success') {
      updateShareInfo(userData.user_id, {
        master_user_id: userData.user_id,
        use_coupon_count: userShareData.current.use_coupon_count + 1,
      }).then(
        (res) => {
          console.log('prizeThree updateShareInfo', res.data);
          setUserShareData(res.data);
          getCouponInfo();
        },
        () => {},
      );
    } else if (res === 'soldout') {
      showToast('优惠券已领完');
    } else {
      showToast(res);
    }
  }, []);
  return (
    // {/* 分享活动领券 */}
    <div
      className={isStartAnimation && styles.animeFlip3}
      style={{
        position: 'absolute',
        left: getRpx(762),
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
          src={payloadProps.invitePriceImg}
          alt="invitePriceImg"
        />
        <div
          style={{
            position: 'absolute',
            width: getRpx(231),
            height: getRpx(85),
            left: getRpx(40),
            top: getRpx(360),
          }}
        >
          <img
            style={{
              width: '100%',
            }}
            onClick={() => {
              if (hasChance && !hasGot) {
                handleGetCouponBtnClick();
              }
            }}
            src={
              hasChance
                ? payloadProps.clickPutImg // 点击领取
                : payloadProps.shipImg //暂无资格
            }
            alt="暂无资格"
          />
        </div>
        <span
          style={{
            position: 'absolute',
            left: getRpx(200.9),
            top: getRpx(350),
            padding: `${getRpx(5)}px ${getRpx(15)}px`,
            borderRadius: getRpx(20),
            color: 'rgba(255, 255, 255, 1)',
            fontSize: getRpx(21),
            background: 'rgba(255, 65, 68, 1)',
            whiteSpace: 'nowrap',
            zIndex: 100,
          }}
        >
          已邀新{helpCount > 2 ? 2 : helpCount}位
        </span>
      </div>
    </div>
  );
};

export default PrizeThree;
