import React, { useEffect, useState, useRef, useCallback, useContext, createContext } from 'react';
import { userLogin, getUserInfo } from '@/server/userManager';
import { getShareInfo, updateShareInfo, getShareOrder } from '@/server/dataManager';
import {
  getRpx,
  imgUri,
  debounce,
  reportWithoutJump,
  jumpSku,
  isJDApp,
  isAndroid,
  jumpOther,
} from '@/utils';
import ShoppingCart from './components/ShoppingCart';
import ToastProvider, { ToastContext } from '../context/Toast';
import UserProvider, { UserContext } from '../context/User';
import StatusProvider, { StatusContext } from '../context/Status';
import Service from '@jdcop/jdcop-service';
import PrizeThree from './components/PrizeThree';
import PrizeUserInfo from './components/PrizeUserInfo';
import PrizeOne from './components/PrizeOne';
import PrizeTwo from './components/PrizeTwo';
import HomePopup from './components/HomePopup';
import RulePopup from './components/RulePopup';
import BottomCoupon from './components/BottomCoupon';
import GuideLayer from './components/GuideLayer';
import VideoPlayComponent from './components/VideoPlayComponent';
import MyOrder from './components/MyOrder';
import ShowImgComponent from './components/ShowImgComponent';


import Lottie from 'lottie-react';
import benefit from './benefit.json';

const { toLogin, isJDAppLogin, requestIsvToken, isApp } = window.jmfe;

// 开发环境登陆失效时，使用mock数据

const mock_user = {
  user_id: 'user-9de0dfead034998d529df5b570f77992307b88945a4b16d828e44905801f4b82',
  user_name: 'PENGGUANG洋',
  user_avatar:
    'http://storage.360buyimg.com/i.imageUpload/6a645f3732633836373662353033643531363834323334373437373533_mid.jpg',
  gendar: 0,
  open_id: 'ntOqOzYlop4iynVng3FpXoVY2tj2o6xE6xx5Dv9B4xk',
  pin: 'jd_72c8676b503d5',
  xid: 'o*AARMaJ4lAX7rI6A16zVrmixhYjIxNPX0giyxT3o0ZjWjG4MFMdi-fWLF01zHtE4yfiUHZV6u',
  is_first_login: 'false',
  first_click: 'user-1fb295686b3e524394ad0b23cf9f2809109456e6d9332ab7dede36dade4b36de',
};


export const HOUR_24_MS = 24 * 60 * 60 * 1000;

const api = new Service({
  activityId: window.babelShareData.activityId,
  activityCode: window.babelShareData.encodeActivityId,
});

let UserType = {};
// 获取客态链接的用户数据 master_user_id, isWineNewUser
export const getUserType = () => {
  console.log('getUserType UserType', UserType);

  if (UserType.userType) {
    return UserType;
  }
  const url = new URL(window.location.href);
  const params = new URLSearchParams(url.search);
  const result = {
    userType: 'master',
    master_user_id: '',
    isWineNewUser: false,
  };
  let user_id = params.get('user_id');
  let ttt1Sign = params.get('babelChannel');

  if (ttt1Sign && ttt1Sign.includes('ttt1')) {
    result.isWineNewUser = true;
  } else {
    result.isWineNewUser = false;
  }

  if (!user_id) {
    // 是主态
    console.log('判断地址为主态');
    result.userType = 'master';
  } else {
    console.log('判断地址为客态');
    result.userType = 'guest';
    result.master_user_id = params.get('user_id');
  }
  UserType = { ...result };
  console.log('getUserType UserType', result);
  return UserType;
};

// 点击领取优惠券的函数
export const getCoupon = async (coupon, index) => {
  const { key, roleId } = coupon;
  console.log('getCoupon key, roleId', key, roleId);
  try {
    const response = await api.newBabelAwardCollection(key, roleId, 1);
    console.log('getCoupon newBabelAwardCollection response', response);

    if (response.code === '3') {
      const url = 'https://plogin.m.jd.com/user/login.action?appid=100';
      window.location.href = `${url}&returnurl=${encodeURIComponent(window.location.href)}`;
    } else if (response.code === '0') {
      if (response.subCode === 'A1' || response.subCode === 'A12' || response.subCode === 'A13') {
        return 'success';
      } else if (response.subCode === 'A14' || response.subCode === 'A15') {
        return 'soldout';
      }
      return response.msg ?? response.subCodeMsg;
    } else {
      return response.errmsg;
    }
  } catch {
    return 'error';
  }
};

// mock.js props context
export const MockDataContext = createContext({});

// 通用关闭按钮组件
export const CloseIcon = (props) => {
  const payloadProps = useContext(MockDataContext);

  return (
    <div
      style={{
        width: getRpx(102),
        height: getRpx(102),
      }}
      {...props}
    >
      <img
        style={{
          width: '100%',
          height: '100%',
        }}
        src={payloadProps.crossImg}
        alt="close"
      />
    </div>
  );
};

// 我的奖品 三张优惠券
const MyPrize = ({ isStartAnimation, setIsRuleFlag, setShareZhuTan, setShareKeTan, setShaiDan }) => {
  const payloadProps = useContext(MockDataContext);
  const maoTaiAdId = payloadProps.maoTaiAdId;
  const [maoTaiData, setMaoTaiData] = useState({});
  const [maoTaiDataTextGif, setMaoTaiDataTextGif] = useState({});
  useEffect(() => {
    window.babel.babelAdvertInfoNew({ body: maoTaiAdId }).then(
      async (res) => {
        if (res.code === '0') {
          const { list = [] } = res.data[`payload_${maoTaiAdId}`];
          console.log('maoTaiAdId ', list);
          setMaoTaiData(list[0]);
          setMaoTaiDataTextGif(list[1]);
        }
      },
      () => { },
    );
  }, []);
  const lottieRef1 = useRef(null);
  useEffect(() => {
    if (!lottieRef1.current) return;
    lottieRef1.current.play();
  }, []);
  return (
    <div
      style={{
        width: '100%',
        height: getRpx(payloadProps.priceBgImgHeight),
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
        }}
      >
        <img
          style={{
            position: 'absolute',
            width: '100%',
          }}
          src={payloadProps.priceBgImg}
          alt="我的奖品"
        />

        {/* lottie */}
        <Lottie
          lottieRef={lottieRef1}
          animationData={benefit}
          style={{
            width: getRpx(520),
            height: getRpx(82),
            position: 'absolute',
            top: getRpx(12),
            left: getRpx(506),
          }}
        />

        <PrizeUserInfo />
        {/* 分享领券 */}
        <PrizeOne isStartAnimation={isStartAnimation} setShareZhuTan={setShareZhuTan} setShareKeTan={setShareKeTan} />
        {/* 晒单领券 */}
        <PrizeTwo isStartAnimation={isStartAnimation} setShaiDan={setShaiDan} />
        {/* 分享活动领券 */}
        {/* <PrizeThree isStartAnimation={isStartAnimation} /> */}
        {/* 茅台活动 */}
        {maoTaiData?.pictureUrl && (
          <div
            style={{
              position: 'absolute',
              left: getRpx(177),
              top: getRpx(514),
              width: getRpx(maoTaiData?.picWidth),
              height: getRpx(maoTaiData?.picHeight),
            }}
            onClick={() => {
              if (!maoTaiData?.desc) {
                return;
              }
              jumpOther(maoTaiData?.desc, '茅台活动');
            }}
          >
            <img
              style={{ width: '100%', height: '100%' }}
              src={maoTaiData?.pictureUrl}
              alt="茅台活动"
            />
            {maoTaiDataTextGif?.pictureUrl && (
              <div
                style={{
                  position: 'absolute',
                  left: getRpx(0),
                  top: getRpx(90),
                  width: getRpx(maoTaiDataTextGif?.picWidth),
                  height: getRpx(maoTaiDataTextGif?.picHeight),
                }}
              >
                <img
                  style={{ width: '100%', height: '100%' }}
                  src={maoTaiDataTextGif?.pictureUrl}
                  alt="茅台活动文字Gif"
                />
              </div>
            )}
          </div>
        )}

        <div
          style={{
            width: getRpx(165),
            height: getRpx(54),
            position: 'absolute',
            top: getRpx(624),
            left: getRpx(912),
            zIndex: 4
          }}
          onClick={() => {
            setIsRuleFlag(true)
          }}
        ></div>
      </div>
    </div>
  );
};

// 统一获取优惠券状态
export const getCouponStatus = (code) => {
  if (code == '14' || code == '15') {
    return 'hasGot'; //已领取
  } else if (code == '16' || code == '17') {
    return 'noMore'; //已领完
  } else {
    return 'notGot'; //未领取
  }
};

// 占位广告组件 通过广告组判断是否显示
const PlaceHolderComponent = () => {
  const payloadProps = useContext(MockDataContext);
  const placeHolderAdId = payloadProps.placeHolderAdId;
  const [placeHolderData, setPlaceHolderData] = useState(null);

  useEffect(() => {
    window.babel.babelAdvertInfoNew({ body: placeHolderAdId }).then(
      async (res) => {
        if (res.code === '0') {
          const { list = [] } = res.data[`payload_${placeHolderAdId}`];
          console.log('placeHolderAdId PlaceHolderComponent', list, res);
          if (list.length > 0) {
            setPlaceHolderData(list[0]);
          }
        }
      },
      () => { },
    );
  }, []);
  return (
    placeHolderData && (
      <div
        style={{
          width: getRpx(placeHolderData.picWidth),
          height: getRpx(placeHolderData.picHeight),
          backgroundColor: payloadProps.mainBackgroundColor,
        }}
        onClick={() => {
          if (!placeHolderData?.desc) {
            return;
          }
          jumpOther(placeHolderData?.desc, 'placeHolderData');
        }}
      >
        <img
          style={{
            width: '100%',
            height: '100%',
          }}
          src={placeHolderData.pictureUrl}
          alt=""
        />
      </div>
    )
  );
};

const HomeMain = (props) => {
  const {
    payload: { props: payloadProps },
  } = props;

  const [scrollBottom, setScrollBottom] = useState({});
  // 点击购物车评论中的视频使用的播放器
  const [currentVideoInfo, setCurrentVideoInfo] = useState({});
  const [isShowHomePopup, setIsShowHomePopup] = useState(false);
  const [isShowGuide, setIsShowGuide] = useState(false);
  // 设置三张优惠券的动画状态，需要注意开启时机
  const [isStartAnimation, setIsStartAnimation] = useState(false);
  // 是否显示底部新人优惠券
  const [isShowBottomCoupon, setIsShowBottomCoupon] = useState(true);
  // 是否显示茅台规则
  const [isRuleFlag, setIsRuleFlag] = useState(false)

  // 是否显示主态分享成功弹框
  const [shareZhuTan, setShareZhuTan] = useState(false)
  const [shareKeTan, setShareKeTan] = useState(false)
  const [shaiDan, setShaiDan] = useState(false)
  const [alText, setAltext] = useState('')

  useEffect(() => {
    const isShowHomePopupKey = 'isShowHomePopupKey';

    if (localStorage.getItem(isShowHomePopupKey)) {
      let time = localStorage.getItem(isShowHomePopupKey);
      const addDate = new Date(Number(time));
      const addYear = addDate.getFullYear();
      const addMonth = addDate.getMonth() + 1;
      const addDay = addDate.getDate();
      const nowDate = new Date();
      const year = nowDate.getFullYear();
      const month = nowDate.getMonth() + 1;
      const day = nowDate.getDate();
      if (addYear === year && addMonth === month && addDay === day) {
        setIsStartAnimation(true);
        return;
      }
    }
    localStorage.setItem(isShowHomePopupKey, new Date().getTime());
    setIsShowHomePopup(true);
  }, []);

  const wrapperRef = useRef(null);
  const {
    userData: { current: userData },
    shaiDanCount,
    setShaiDanCount,
  } = useContext(UserContext);


  const handleHomePopupClose = useCallback(() => {
    setIsShowHomePopup(false);
    if (userData.is_first_login == 'true') {
      setIsShowGuide(true);
      return;
    }
    setIsStartAnimation(true);
  });

  const showText = (text, time = 800) => {
    setAltext(text)
    setTimeout(() => {
      setAltext('')
    }, time)
  }

  const handleGuideClose = useCallback(() => {
    setIsShowGuide(false);
    setIsStartAnimation(true);
  });

  // 领取分享券
  const handleGetCouponBtnClick = useCallback(async (type) => {
    let shareCoupon = null
    let id = type == 0 ? payloadProps.shareAdID : payloadProps.shareAdID1
    window.babel.babelAdvertInfoNew({ body: id }).then(
      async (res) => {
        console.log('res', res);
        if (res.code === '0') {
          const { list = [] } = res.data[`payload_${id}`];
          console.log('shareCoupon res.data', res.data);
          shareCoupon = list[0]?.extension;
          console.log('shareCoupon', shareCoupon);
          const res1 = await getCoupon(shareCoupon);
          if (res1 === 'success') {
            setShareZhuTan(false)
            setShareKeTan(false)
            showText('领取成功正在前往使用...', 2000);
            setTimeout(() => {
              jumpOther(`https://so.m.jd.com/list/couponSearch.action?couponbatch=${shareCoupon.batchId}`, 'youhuijuan')
            }, 2000);

          } else if (res1 === 'soldout') {
            showText('优惠券已领完');
          } else {
            showText(res1);
          }
        }
      },
      () => { },
    );

  }, []);

  // 领取晒单券
  const handleGetCouponBtnClick1 = useCallback(async () => {
    let shareCoupon = null
    window.babel.babelAdvertInfoNew({ body: payloadProps.shaiAdID }).then(
      async (res) => {
        console.log('res', res);
        if (res.code === '0') {
          const { list = [] } = res.data[`payload_${payloadProps.shaiAdID}`];
          console.log('list', list);
          shareCoupon = shareCoupon = list[0]?.extension;
          console.log('shareCoupon', shareCoupon);
          const res2 = await getCoupon(shareCoupon);
          if (res2 === 'success') {
            setShaiDan(false)
            showText('领取成功正在前往使用...', 2000);
            setTimeout(() => {
              jumpOther(`https://so.m.jd.com/list/couponSearch.action?couponbatch=${shareCoupon.batchId}`, 'youhuijuan')
            }, 2000);

          } else if (res2 === 'soldout') {
            showText('优惠券已领完');
          } else {
            showText(res2);
          }
        }
      },
      () => { },
    );

  }, []);

  // 领取分享晒单成功券
  const handleGetCouponBtnClick2 = useCallback(async () => {
    let shareCoupon = null
    window.babel.babelAdvertInfoNew({ body: payloadProps.shaiDanID }).then(
      async (res) => {
        console.log('res', res);
        if (res.code === '0') {
          const { list = [] } = res.data[`payload_${payloadProps.shaiDanID}`];
          console.log('list', list);
          shareCoupon = shareCoupon = list[0]?.extension;
          console.log('shareCoupon', shareCoupon);
          const res3 = await getCoupon(shareCoupon);
          if (res3 === 'success') {
            setShaiDanCount(false)
            showText('领取成功正在前往使用...', 2000);
            setTimeout(() => {
              jumpOther(`https://so.m.jd.com/list/couponSearch.action?couponbatch=${shareCoupon.batchId}`, 'youhuijuan')
            }, 2000);

          } else if (res3 === 'soldout') {
            showText('优惠券已领完');
          } else {
            showText(res3);
          }
        }
      },
      () => { },
    );

  }, []);


  const onBottom = debounce(() => {
    setScrollBottom({});
    console.log('滑动到底部');
  }, 300);

  return (
    <div
      ref={wrapperRef}
      style={{
        width: '100vw',
        paddingTop: getRpx(260),
        backgroundColor: payloadProps.mainBackgroundColor,
        backgroundImage: `url(${payloadProps.bgImg})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        height: '100vh',
        overflowX: 'hidden',
        overflowY: 'auto',
      }}
      onScroll={(e) => {
        const { scrollTop, scrollHeight, clientHeight } = e.target;
        if (scrollTop + clientHeight >= scrollHeight - getRpx(600)) {
          onBottom();
        }
      }}
    >
      <MockDataContext.Provider value={payloadProps}>
        {/* 开屏弹窗 */}
        {isShowHomePopup && (
          <HomePopup isShowPopup={isShowHomePopup} handleHomePopupClose={handleHomePopupClose} />
        )}
        {/* 茅台规则弹框 */}
        {
          isRuleFlag && <div
            style={{
              width: '100%',
              height: '100%',
              position: 'absolute',
              top: 0,
              left: 0,
              zIndex: 11
            }}
          >
            <img style={{ width: '100%', height: '100%' }} src="http://m.360buyimg.com/babel/jfs/t1/227604/35/24533/145373/66987f01Fde7dd1e0/f74c1befcd3162b0.png" alt="" />

            <div
              style={{
                width: getRpx(450),
                height: getRpx(120),
                position: 'absolute',
                top: getRpx(1461),
                left: getRpx(330),
              }}
              onClick={() => {
                setIsRuleFlag(false)
              }}
            ></div>
          </div>
        }

        {/* 规则弹窗 */}
        <RulePopup />
        {/* 我的奖品 */}
        <MyPrize isStartAnimation={isStartAnimation} setIsRuleFlag={setIsRuleFlag} setShareZhuTan={setShareZhuTan} setShareKeTan={setShareKeTan} setShaiDan={setShaiDan} />
        {/* 我的订单 */}
        <MyOrder />
        {/* 占位广告 */}
        <PlaceHolderComponent />
        {/* 购物车 */}
        <ShoppingCart setCurrentVideoInfo={setCurrentVideoInfo} scrollBottom={scrollBottom} />
        {/* 购物车视频播放器 */}
        <VideoPlayComponent videoInfo={currentVideoInfo} />
        <ShowImgComponent imgInfo={currentVideoInfo} />
        {isShowBottomCoupon && <BottomCoupon setIsShowBottomCoupon={setIsShowBottomCoupon} />}
        {/* 引导层 */}
        <GuideLayer isShowGuide={isShowGuide} handleGuideClose={handleGuideClose} />

        {/* 主态邀请成功弹框 */}
        {
          getUserType().userType === 'master' && shareZhuTan && <div
            // <div
            style={{
              width: '100%',
              height: '100%',
              position: 'fixed',
              top: 0,
              left: 0,
              zIndex: 11
            }}
          >
            <img
              style={{
                position: 'absolute',
                width: '100%',
              }}
              src='http://m.360buyimg.com/babel/jfs/t1/205642/39/30075/112016/66987ff7Fc3182acf/91b4f1acc83a4b00.png'
              alt="sharPriceImg"
            />

            {/* 立即领取 */}
            <div
              style={{
                width: getRpx(468),
                height: getRpx(138),
                position: 'absolute',
                top: getRpx(1311),
                left: getRpx(330),
              }}
              onClick={() => {
                handleGetCouponBtnClick(0)
              }}
            >

            </div>

            {/* 关闭按钮 */}
            <div
              style={{
                width: getRpx(112),
                height: getRpx(112),
                position: 'absolute',
                top: getRpx(1619),
                left: getRpx(504),
              }}
              onClick={() => {
                setShareZhuTan(false)
              }}
            ></div>
          </div>
        }

        {/* 客态邀请成功弹框 */}
        {
          getUserType().userType === 'guest' && shareKeTan && <div
            // <div
            style={{
              width: '100%',
              height: '100%',
              position: 'fixed',
              top: 0,
              left: 0,
              zIndex: 11
            }}
          >
            <img
              style={{
                position: 'absolute',
                width: '100%',
              }}
              src='http://m.360buyimg.com/babel/jfs/t1/244398/9/15454/114613/6698810fF9f67949d/98748a46846115bc.png'
              alt="sharPriceImg"
            />

            {/* 立即领取 */}
            <div
              style={{
                width: getRpx(468),
                height: getRpx(138),
                position: 'absolute',
                top: getRpx(1311),
                left: getRpx(330),
              }}
              onClick={() => {
                handleGetCouponBtnClick(1)
              }}
            >

            </div>

            {/* 关闭按钮 */}
            <div
              style={{
                width: getRpx(112),
                height: getRpx(112),
                position: 'absolute',
                top: getRpx(1619),
                left: getRpx(504),
              }}
              onClick={() => {
                setShareKeTan(false)
              }}
            ></div>
          </div>
        }

        {/* 晒单成功弹框显示 */}
        {
          shaiDan && <div
            // <div
            style={{
              width: '100%',
              height: '100%',
              position: 'fixed',
              top: 0,
              left: 0,
              zIndex: 11
            }}
          >
            <img
              style={{
                position: 'absolute',
                width: '100%',
              }}
              src='http://m.360buyimg.com/babel/jfs/t1/6812/37/31636/113530/6698802cFbb3bc3bf/6027d5df69041431.png'
              alt="shaiDanTanImg"
            />

            {/* 立即领取 */}
            <div
              style={{
                width: getRpx(468),
                height: getRpx(138),
                position: 'absolute',
                top: getRpx(1311),
                left: getRpx(330),
              }}
              onClick={() => {
                handleGetCouponBtnClick1()
              }}
            >

            </div>

            {/* 关闭按钮 */}
            <div
              style={{
                width: getRpx(112),
                height: getRpx(112),
                position: 'absolute',
                top: getRpx(1619),
                left: getRpx(504),
              }}
              onClick={() => {
                setShaiDan(false)
              }}
            ></div>
          </div>
        }

        {/* 分享晒单成功弹框 */}
        {
          shaiDanCount && <div
            // <div
            style={{
              width: '100%',
              height: '100%',
              position: 'fixed',
              top: 0,
              left: 0,
              zIndex: 11
            }}
          >
            <img
              style={{
                position: 'absolute',
                width: '100%',
              }}
              src='http://m.360buyimg.com/babel/jfs/t1/16543/26/22486/109571/669e0dc5F29e334ee/e999f516e81bbe2a.png'
              alt="shaiDanTanImg"
            />

            {/* 立即领取 */}
            <div
              style={{
                width: getRpx(468),
                height: getRpx(138),
                position: 'absolute',
                top: getRpx(1311),
                left: getRpx(330),
              }}
              onClick={() => {
                handleGetCouponBtnClick2()
              }}
            >

            </div>

            {/* 关闭按钮 */}
            <div
              style={{
                width: getRpx(112),
                height: getRpx(112),
                position: 'absolute',
                top: getRpx(1619),
                left: getRpx(504),
              }}
              onClick={() => {
                setShaiDanCount(false)
              }}
            ></div>
          </div>
        }

        {
          alText && <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              zIndex: 99999
            }}>
            <span
              style={{
                background: 'black',
                fontSize: getRpx(71),
                width: getRpx(735),
                height: getRpx(159),
                opacity: .6,
                textAlign: 'center',
                borderRadius: getRpx(30),
                lineHeight: getRpx(6.5),
              }}>{alText}</span>
          </div>
        }

      </MockDataContext.Provider>
    </div>
  );
};

export const HomeWrapper = (props) => {
  const [isLogin, setIsLogin] = useState(false);
  const [isOutApp, setIsOutApp] = useState(false);
  const { setUserData, setUserShareData, setAllCompletionCnt, userShareData, setShaiDanCount } =
    useContext(UserContext);
  const [isRisk, setIsRisk] = useState(false);

  const {
    payload: { props: payloadProps },
  } = props;

  const getUserShareInfo = useCallback((userData) => {
    getShareInfo(userData.user_id).then(
      (res) => {
        console.log('getShareInfo', res.data);

        const userShareInfo = res.data;
        setUserShareData(userShareInfo);
        console.log('setUserShareData', userShareData.current);

        // 客态判断
        console.log('客态身份验证1', getUserType().userType);
        console.log('客态身份验证2', getUserType().master_user_id);
        console.log('客态身份验证2', userData.user_id);
        if (getUserType().userType === 'guest') {
          console.log('是客态没问题');
          // 客态进入主态分享页面且是第一次点击带分享的链接 更新主态分享信息
          updateShareInfo(userData.user_id, {
            master_user_id: getUserType().master_user_id,
            guest_user_id: userData.user_id,
            share_active_status: "get"
          }).then(
            (res) => {
              console.log('客态进入主态分享页面 updateMasterShareInfo', res.data);
            },
            (err) => { console.log('errrrrrr', err); },
          );
        }
        console.log('setIsLogin userShareData', userShareData.current);
        setIsLogin(true);
      },
      (res) => {
        console.log('getShareInfo error', userData, res);
      },
    );
  }, []);

  useEffect(() => {
    // 1.先检查是否登录
    // 2.登录后获取用户信息 例如code
    // isJDAppLogin
    window.isJDApp = isApp('jd');
    if (window.isJDApp) {
      isJDAppLogin().then(
        ({ data }) => {
          setTimeout(() => {
            console.log('hideShareButton clear_js');
            jmfe.configNavigationButton({ clear_js: { type: 'clear_js' } });
          }, 1000);
          if (data === '1') {
            // 京东用户成功登陆
            requestIsvToken(window.location.href).then(
              ({ status, data }) => {
                // console.log('token', data);
                if (status === '0') {
                  // 根据京东用户信息标识，获取该用户存放在我们数据库内的信息
                  // console.log('京东用户 登陆成功requestIsvToken', data);
                  userLogin('01', data, { first_click: getUserType().master_user_id }).then(
                    (res) => {
                      // console.log('userLogin res', res);
                      if (!res) {
                        console.log('userLogin not res');
                        // 有的用户可能没有登陆数据，不能跳转到登陆页面，否则会一直刷新
                        // toLogin();
                        // 活动火爆兜底图
                        setIsRisk(true);
                        return;
                      }
                      setUserData(res);
                      getUserShareInfo(res);
                      // 获取所有商品组信息

                      // 查看是否分享成功
                      getShareOrder(res.user_id).then((res) => {
                        console.log('查询晒单分享券', res);
                        if (res.share_order_coupon.length > 0) {
                          console.log('查询晒单分享券状态1');
                          setShaiDanCount(true)
                        } else {
                          console.log('查询晒单分享券状态2');
                          setShaiDanCount(false)
                        }
                      })
                    },
                    (res) => {
                      console.log('userLogin error setIsRisk', res);
                      setIsRisk(true);
                    },
                  );
                }
              },
              () => { },
            );
          } else if (data === '0') {
            // 登录失败则跳转京东登录页面
            toLogin();
          }
        },
        () => { },
      );
    } else if (process.env.NODE_ENV === 'development') {
      console.log('本地测试或其他端测试 userLogin');
      // setIsOutApp(true);

      // 本地测试或其他端测试
      userLogin('01', undefined, { first_click: getUserType().master_user_id }).then(
        (res) => {
          console.log('本地测试或其他端测试 userLogin', res);
          if (!res) {
            setUserData(mock_user);
            getUserShareInfo(mock_user);
            return;
          }
          setUserData(res);
          getUserShareInfo(res);
          getShareOrder(res.user_id).then((res) => {
            console.log('查询晒单分享券', res);
            if (res.share_order_coupon.length > 0) {
              setShaiDanCount(true)
            } else {
              setShaiDanCount(false)
            }
          })
        },
        () => {
          setIsRisk(true);
          setUserData(mock_user);
          getUserShareInfo(mock_user);
        },
      );
    } else {
      setIsOutApp(true);
    }
  }, []);
  return isOutApp ? (
    <div
      style={{
        width: '100vw',
      }}
    >
      <img style={{ width: '100%' }} src={payloadProps.skipImg} alt="" />
    </div>
  ) : isRisk ? (
    <div
      style={{
        width: '100vw',
      }}
    >
      <img style={{ width: '100%' }} src={payloadProps.riskImg} alt="" />
    </div>
  ) : (
    isLogin && <HomeMain {...props} />
  );
};

export default (props) => {
  // 隐藏分享按钮

  return (
    <UserProvider>
      <ToastProvider>
        <StatusProvider>
          <HomeWrapper {...props} />
        </StatusProvider>
      </ToastProvider>
    </UserProvider>
  );
};
