import React, { useEffect, useState, useRef, useContext, useCallback } from 'react';
import { getRpx, jumpOther } from '@/utils';
import { MockDataContext, getCouponStatus, getCoupon } from '../Home';
import { ToastContext, UserContext } from '../../context/context';
import styles from '../Home.module.css';
import { comments } from '@/server/dataManager';

const PrizeTwo = ({ isStartAnimation, setShaiDan }) => {
  const [hasGot, setHasGot] = useState(false);
  const [hasChance, setHasChance] = useState(false);
  const payloadProps = useContext(MockDataContext);
  const [hasGotToday, setHasGotToday] = useState(false);
  const { showToast } = useContext(ToastContext);
  const {
    userData: { current: userData },
    userShareData,
  } = useContext(UserContext);

  const shaiAdID = payloadProps.shaiAdID;
  const shaiCouponData = useRef({});

  const getShaiDanInfo = async () => {
    // if (userData.is_first_login === 'true') {
    //   return;
    // }
    console.log('MyOrder comments userData', userData);
    const params = {
      pageSize: '15',
      page: '1',
      status: '1', //状态筛选(1 待评价 ，5 已评价)
      isvPin: userData.pin,
      open_id_isv: userData.open_id,
      xid_isv: userData.xid,
      update_history: 'false',
      filter: {
        firstCategory: 12259,
      },
    };
    try {
      console.log('userData.pin, params', userData.pin, params);
      //获取历史评价和最新评价
      // 必须先调用history接口，再调用new接口，因为调用new接口会更新history接口的数据

      let [historyNotComment, historyHadComment, newNotComment, newHadComment] = await Promise.all([
        comments('history', userData.pin, params),
        comments('history', userData.pin, {
          ...params,
          status: '5',
        }),
        comments('new', userData.pin, params),
        comments('new', userData.pin, {
          ...params,
          status: '5',
        }),
      ]);
      console.log('MyOrder comments shaiCouponData historyNotComment', historyNotComment);
      console.log('MyOrder comments shaiCouponData historyHadComment', historyHadComment);
      console.log('MyOrder comments shaiCouponData newNotComment', newNotComment);
      console.log('MyOrder comments shaiCouponData newHadComment', newHadComment);
      historyNotComment = historyNotComment.data?.[0] ? historyNotComment.data : [];
      historyHadComment = historyHadComment.data?.[0] ? historyHadComment.data : [];
      newNotComment = newNotComment.data?.[0] ? newNotComment.data : [];
      newHadComment = newHadComment.data?.[0] ? newHadComment.data : [];

      const historyList = historyNotComment.concat(historyHadComment);
      const newList = newNotComment.concat(newHadComment);
      console.log('MyOrder comments shaiCouponData historyList', historyList);
      console.log('MyOrder comments shaiCouponData newList', newList);

      const historyTimeNoCommentStatusMap = new Set();
      const historyAllStatusMap = new Set();

      historyList.forEach((item) => {
        const orderCompletionTime = item.orderCompletionTime.replaceAll(' ', '');
        let key = orderCompletionTime;

        if (item.skuId) {
          key = orderCompletionTime + '|' + item.skuId;
        }
        historyAllStatusMap.add(key);
        if (item.status == 0) {
          //历史未评价数据放入Map
          historyTimeNoCommentStatusMap.add(key);
        }
      });
      console.log('historyTimeStatusMap historyStatus = 0', historyTimeNoCommentStatusMap);
      console.log('historyAllStatusMap', historyAllStatusMap);
      for (let item of newList) {
        //判断历史数据里的订单评价状态是否变为 1 即已评价
        const newOrderCompletionTime = item.orderCompletionTime.replaceAll(' ', '');
        let key = newOrderCompletionTime;
        if (item.skuId) {
          key = newOrderCompletionTime + '|' + item.skuId;
        }
        // 订单在历史未评价里
        console.log(key, 'new item newOrderCompletionTime');
        if (
          historyTimeNoCommentStatusMap.has(key) ||
          historyTimeNoCommentStatusMap.has(newOrderCompletionTime)
        ) {
          console.log(item, '订单在历史未评价里');
          // 订单在历史未评价里且为已评价
          if (item.status == 1) {
            console.log('setHasChance(true);');
            setHasChance(true);
            break;
          } else {
            console.log('setHasChance(false);');
            setHasChance(false);
          }
        } else {
          // 订单不在历史未评价里但是在历史记录里说明不是新增订单
          if (historyAllStatusMap.has(key) || historyAllStatusMap.has(newOrderCompletionTime)) {
            setHasChance(false);
          } else {
            // 订单不在历史记录里说明是新增订单
            if (item.status == 1) {
              console.log('订单不在历史记录里说明是新增订单 setHasChance(true);');
              setHasChance(true);
              break;
            } else {
              console.log('订单不在历史记录里说明是新增订单 setHasChance(false);');
              setHasChance(false);
            }
          }
        }
      }
    } catch (error) {
      console.log('MyOrder comments shaiCouponData newData error', error);
      setHasChance(false);
    }
  };
  const getCouponInfo = () => {
    window.babel.babelAdvertInfoNew({ body: shaiAdID }).then(
      async (res) => {
        if (res.code === '0') {
          const { list = [] } = res.data[`payload_${shaiAdID}`];
          const shareCoupon = list[0];
          shaiCouponData.current = shareCoupon?.extension || {};
          console.log('shaiCouponData', shareCoupon);
          console.log('shaiCouponData userShareData', userShareData.current);

          if (shareCoupon?.extension) {
            // 最终都会更具优惠券状态判断是否领取成功，在更新显示状态
            const couponStatus = getCouponStatus(shareCoupon.extension.cpnResultCode);
            if (couponStatus == 'hasGot') {
              console.log('晒单券1');
              setHasGot(true);
              setHasGotToday(true);
              setShaiDan(false)
            } else if (couponStatus == 'noMore') {
              console.log('晒单券2');
              setHasGot(true);
              setShaiDan(false)
            } else {
              console.log('晒单券3');
              setHasGot(false);
              getShaiDanInfo();
              hasChance && setShaiDan(true)
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

  const handleGetCouponBtnClick = useCallback(async () => {
    const params = {
      pageSize: '15',
      page: '1',
      status: '1', //状态筛选(1 待评价 ，5 已评价)
      isvPin: userData.pin,
      open_id_isv: userData.open_id,
      xid_isv: userData.xid,
      update_history: 'true',
      filter: {
        firstCategory: 12259,
      },
    };

    try {
      await Promise.all([
        comments('new', userData.pin, {
          ...params,
          status: '5',
        }),
        comments('new', userData.pin, {
          ...params,
        }),
      ]);
      const res = await getCoupon(shaiCouponData.current);
      if (res === 'success') {
        getCouponInfo();
        showToast('领取成功正在前往使用...', 2000);
        setTimeout(() => {
          jumpOther(`https://so.m.jd.com/list/couponSearch.action?couponbatch=${shaiCouponData.current.batchId}`, 'youhuijuan')
        }, 2000);
        
      } else if (res === 'soldout') {
        showToast('优惠券已领完');
      } else {
        showToast(res);
      }
    } catch (error) {
      showToast('系统繁忙，请稍后再试');
    }
  }, []);

  return (
    <div
      className={isStartAnimation && styles.animeFlip2}
      style={{
        position: 'absolute',
        left: getRpx(570),
        top: getRpx(120),
        transform: `translateX(200px)`,
      }}
    >
      <div
        style={{
          position: 'relative',
          width: getRpx(492),
          height: getRpx(276),
        }}
      >
        <img
          style={{
            position: 'absolute',
            width: '100%',
          }}
          onClick={getShaiDanInfo}
          src={hasGotToday ? payloadProps.shaiDanHasGotToday : payloadProps.shaiPriceImg}
          alt="shaiPriceImg"
        />
        <div
          style={{
            position: 'absolute',
            width: getRpx(229),
            height: getRpx(73.5),
            left: getRpx(219),
            top: getRpx(234),
          }}
        >
          <img
            style={{
              width: '100%',
            }}
            onClick={async (e) => {
              e.stopPropagation();
              if (hasChance && !hasGot) {
                handleGetCouponBtnClick();
              }
            }}
            src={
              hasGot
                ? payloadProps.shipImg1 //已领取
                : hasChance
                ? payloadProps.clickPutImg1 // 点击领取
                : payloadProps.shipImg1 //暂无资格
            }
            alt="暂无资格"
          />
        </div>
        
        {
          hasChance && !hasGot && (
          <div
            style={{
              width: getRpx(180),
              height: getRpx(33),
              position: 'absolute',
              top: getRpx(228),
              left: getRpx(285),
            }}
          >
            <img
              style={{
                width: '100%',
              }}
              src="https://img10.360buyimg.com/zx/jfs/t1/47707/30/24726/3065/66987c27Ffefef2de/e227ff1e114cc878.png"
              alt="气泡"
            />
          </div>
        )
       }
      </div>
    </div>
  );
};

export default PrizeTwo;
