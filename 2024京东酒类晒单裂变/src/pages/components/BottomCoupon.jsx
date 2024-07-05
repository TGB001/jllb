import React, { useEffect, useState, useContext } from 'react';
import { getRpx, jumpOther } from '@/utils';
import { MockDataContext, getCouponStatus, getCoupon } from '../Home';
import { ToastContext } from '../../context/context';

const BottomCoupon = ({ setIsShowBottomCoupon }) => {
  const payloadProps = useContext(MockDataContext);
  const { showToast } = useContext(ToastContext);

  const [couponStatus, setCouponStatus] = useState('notGot');
  const [showCoupon, setShowCoupon] = useState(false);

  const newUserAdID = payloadProps.newUserAdID;
  const [newUserData, setNewUserData] = useState({});

  const getCouponInfo = () => {
    window.babel.babelAdvertInfoNew({ body: newUserAdID }).then(
      async (res) => {
        console.log('BottomCoupon res', res);

        if (res.code === '0') {
          const { list = [] } = res.data[`payload_${newUserAdID}`];
          if (list.length === 0) {
            setShowCoupon(false);
            return;
          }
          setShowCoupon(true);
          const couponInfo = list[0];
          setNewUserData(couponInfo.extension);

          const couponStatus = getCouponStatus(couponInfo.extension.cpnResultCode);
          setCouponStatus(couponStatus);
        }
      },
      () => {},
    );
  };
  useEffect(() => {
    getCouponInfo();
  }, []);

  return (
    showCoupon && (
      <div
        style={{
          position: 'absolute',
          bottom: getRpx(0),
          left: getRpx(0),
          width: '100vw',
          height: getRpx(247 + 95 + 100),
          background: 'linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.7))',
        }}
      >
        <div
          style={{
            marginLeft: getRpx(50),
            marginTop: getRpx(100),
          }}
        >
          {couponStatus == 'hasGot' ? (
            <img
              style={{
                width: getRpx(1017),
                height: getRpx(247),
              }}
              src={payloadProps.usedNewUserCoupon}
              alt="coupon"
            />
          ) : couponStatus == 'noMore' ? (
            <></>
          ) : (
            <img
              style={{
                width: getRpx(1017),
                height: getRpx(247),
              }}
              onClick={async () => {
                const res = await getCoupon(newUserData);
                if (res === 'success') {
                  getCouponInfo();
                  showToast('领取成功正在前往使用...', 2000);
                  setTimeout(() => {
                    jumpOther(`https://so.m.jd.com/list/couponSearch.action?couponbatch=${newUserData.batchId}`, 'youhuijuan')
                  }, 2000);
                } else if (res === 'soldout') {
                  showToast('优惠券已领完');
                } else {
                  showToast(res);
                }
              }}
              src={payloadProps.newUserCoupon}
              alt="coupon"
            />
          )}
        </div>

        <img
          style={{
            top: getRpx(10),
            right: getRpx(40),
            width: getRpx(75),
            height: getRpx(75),
            position: 'absolute',
          }}
          onClick={() => {
            setIsShowBottomCoupon(false);
          }}
          src={payloadProps.newUserCloseImg}
          alt="closeIcon"
        />
      </div>
    )
  );
};

export default BottomCoupon;
