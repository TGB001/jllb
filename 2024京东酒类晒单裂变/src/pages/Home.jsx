import React, { useEffect, useState, useRef, useCallback, useContext, createContext } from 'react';
import { userLogin, getUserInfo } from '@/server/userManager';
import { getShareInfo, updateShareInfo, doInteraction, getInteractive } from '@/server/dataManager';
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
const MyPrize = ({ isStartAnimation }) => {
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
      () => {},
    );
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
        <PrizeUserInfo />
        {/* 分享领券 */}
        <PrizeOne isStartAnimation={isStartAnimation} />
        {/* 晒单领券 */}
        <PrizeTwo isStartAnimation={isStartAnimation} />
        {/* 分享活动领券 */}
        <PrizeThree isStartAnimation={isStartAnimation} />
        {/* 茅台活动 */}
        {maoTaiData?.pictureUrl && (
          <div
            style={{
              position: 'absolute',
              left: getRpx(120),
              top: getRpx(630),
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
      () => {},
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
  } = useContext(UserContext);

  const handleHomePopupClose = useCallback(() => {
    setIsShowHomePopup(false);
    if (userData.is_first_login == 'true') {
      setIsShowGuide(true);
      return;
    }
    setIsStartAnimation(true);
  });

  const handleGuideClose = useCallback(() => {
    setIsShowGuide(false);
    setIsStartAnimation(true);
  });

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
        {/* 规则弹窗 */}
        <RulePopup />
        {/* 我的奖品 */}
        <MyPrize isStartAnimation={isStartAnimation} />
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
      </MockDataContext.Provider>
    </div>
  );
};

export const HomeWrapper = (props) => {
  const [isLogin, setIsLogin] = useState(false);
  const [isOutApp, setIsOutApp] = useState(false);
  const { setUserData, setUserShareData, setAllCompletionCnt, userShareData } =
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

        doInteraction(userData.pin).then(
          (res) => {
            console.log('doInteraction', res.data);
          },
          () => {},
        );

        // 主态 客态 都需要做
        getInteractive(userData.pin).then(
          async (res) => {
            console.log('getInteractive', res.data);
            const { assignmentList = [] } = res.data;

            // 找到 新人助力任务
            const laXingCouponAssignment = assignmentList.find(
              (item) => item.encryptAssignmentId === payloadProps.LaXingCouponEncryptAssignmentId,
            );
            console.log('laXingCouponAssignment', laXingCouponAssignment);
            if (laXingCouponAssignment) {
              let laXingOrder = laXingCouponAssignment.ext.order;
              const groupId = laXingOrder?.groupId?.split(',')?.[0];
              const orderUrl = laXingOrder?.orderUrl;
              // 客态判断
              if (
                getUserType().userType === 'guest' &&
                getUserType().master_user_id != userData.user_id
              ) {
                // 判断是否是新人
                if (groupId && !getUserType().isWineNewUser) {
                  try {
                    const res = await window.babel.babelProductInfoNew({ body: groupId });
                    if (res.code === '0') {
                      const { list = [] } = res.data[`payload_${groupId}`];
                      console.log('判断是否是新人 groupId list', list, res);
                      if (list.length != 0) {
                        // 跳转到带ttt1是新人的活动链接
                        window.location.href = `${orderUrl}&user_id=${
                          getUserType().master_user_id
                        }`;
                      }
                    }
                  } catch (e) {
                    // console.log(e)
                  }
                }
                // 获取客态的主态分享信息
                getShareInfo(getUserType().master_user_id).then(
                  (master_data_res) => {
                    console.log('判断是否是新人 getUserInfo master_data_res', master_data_res);
                    const master_data = master_data_res.data;
                    const first_click = userData.first_click;
                    console.log(
                      '判断是否是新人 getUserInfo master_data, userData, first_click',
                      master_data,
                      userData,
                      first_click,
                    );
                    if (
                      first_click &&
                      first_click != userData.user_id &&
                      first_click === getUserType().master_user_id
                    ) {
                      // 客态进入主态分享的页面且是第一次点击带分享的链接 更新主态分享信息
                      console.log(
                        '客态进入主态分享页面 updateMasterShareInfo',
                        userData,
                        getUserType().master_user_id,
                      );

                      const master_guest_users = master_data?.guest_users;
                      if (master_guest_users?.length > 0) {
                        const find_guest_user = master_guest_users.find((item) => {
                          return item.guest_user_id === userData.user_id;
                        });
                        if (find_guest_user) {
                          // 主态有之前的客态记录 直接返回 不更新 避免重复更新
                          console.log(
                            '客态进入主态分享页面 主态有之前的客态记录 find_guest_user',
                            find_guest_user,
                          );
                          return;
                        }
                      }
                      // 客态进入主态分享页面且是第一次点击带分享的链接 更新主态分享信息
                      updateShareInfo(userData.user_id, {
                        master_user_id: getUserType().master_user_id,
                        guest_users: [
                          {
                            guest_user_id: userData.user_id,
                            pin: userData.pin,
                            new_coupon_status: getUserType().isWineNewUser ? 'to_get' : 'no',
                          },
                        ],
                        share_count: master_data.share_count + 1,
                      }).then(
                        (res) => {
                          console.log('客态进入主态分享页面 updateMasterShareInfo', res.data);
                        },
                        () => {},
                      );
                    }
                  },
                  () => {},
                );
              }

              // // 最后分享时间不在当天清空拉新状态
              const last_share_time = userShareData.current.last_share_time;
              if (last_share_time) {
                const addDate = new Date(Number(last_share_time));
                const addYear = addDate.getFullYear();
                const addMonth = addDate.getMonth() + 1;
                const addDay = addDate.getDate();
                const nowDate = new Date();
                const year = nowDate.getFullYear();
                const month = nowDate.getMonth() + 1;
                const day = nowDate.getDate();
                if (addYear != year || addMonth != month || addDay != day) {
                  updateShareInfo(userData.user_id, {
                    master_user_id: userData.user_id,
                    new_coupon_sum_count: 0,
                    use_coupon_count: 0,
                  }).then(
                    (res) => {
                      setUserShareData(res.data);
                      setAllCompletionCnt(0);
                      console.log(
                        '最后分享时间不在当天清空拉新状态 updateShareInfo response, userShareData',
                        res,
                        userShareData.current,
                      );
                    },
                    () => {},
                  );
                }
              }

              // 获取当前用户的拉新人数
              const guest_users = userShareData.current.guest_users;
              const getInterActivePromiseList = [];
              const gotInterActiveUser_ids = [];
              for (let i = 0; i < guest_users.length; i++) {
                // 客态新人助力状态为to_get
                if (guest_users[i].new_coupon_status == 'to_get') {
                  // // 客态的分享时间不在当天 跳过 不计入主态
                  const user_share_time = guest_users[i].share_time;
                  const addDate = new Date(Number(user_share_time));
                  const addYear = addDate.getFullYear();
                  const addMonth = addDate.getMonth() + 1;
                  const addDay = addDate.getDate();
                  const nowDate = new Date();
                  const year = nowDate.getFullYear();
                  const month = nowDate.getMonth() + 1;
                  const day = nowDate.getDate();
                  if (addYear == year || addMonth == month || addDay == day) {
                    console.log(
                      '获取当前用户的拉新人数 addToPromiseList getInteractive',
                      guest_users[i],
                    );
                    getInterActivePromiseList.push(getInteractive(guest_users[i].pin));
                    gotInterActiveUser_ids.push(guest_users[i].guest_user_id);
                  }
                }
              }

              Promise.all(getInterActivePromiseList).then(
                (guest_interactive_res) => {
                  // 计算拉新人数
                  let allCompletionCnt = 0;
                  guest_interactive_res.forEach((item) => {
                    const { assignmentList = [] } = item.data;

                    //找到 新人助力任务
                    const laXingCouponAssignment = assignmentList.find((item) => {
                      console.log(
                        'item.encryptAssignmentId LaXingCouponEncryptAssignmentId',
                        item.encryptAssignmentId,
                        payloadProps.LaXingCouponEncryptAssignmentId,
                      );
                      return (
                        item.encryptAssignmentId === payloadProps.LaXingCouponEncryptAssignmentId
                      );
                    });
                    console.log('laXingCouponAssignment', laXingCouponAssignment);
                    // 助力完成数大于0 算助力一次
                    if (
                      laXingCouponAssignment?.completionCnt &&
                      laXingCouponAssignment?.completionCnt > 0
                    ) {
                      allCompletionCnt += 1;
                    }
                  });

                  // 更新主态或自己的分享信息
                  console.log(
                    '更新主态或自己的分享信息 updateShareInfo userShareData, allCompletionCnt',
                    userShareData.current,
                    allCompletionCnt,
                  );
                  updateShareInfo(userData.user_id, {
                    master_user_id: userData.user_id,
                    new_coupon_sum_count:
                      userShareData.current.new_coupon_sum_count + allCompletionCnt,
                    guest_users: guest_users.map((guest_user) => {
                      if (gotInterActiveUser_ids.includes(guest_user.guest_user_id)) {
                        // 已助力过的客态 状态改为 success
                        return {
                          ...guest_user,
                          new_coupon_status: 'success',
                        };
                      }
                      return guest_user;
                    }),
                  }).then(
                    (res) => {
                      console.log(
                        '更新主态或自己的分享信息 updateShareInfo response, userShareData, allCompletionCnt',
                        res,
                        userShareData.current,
                        allCompletionCnt,
                      );
                      setUserShareData(res.data);
                      setAllCompletionCnt(allCompletionCnt);
                    },
                    () => {},
                  );
                  // 更新拉新人数
                },
                () => {},
              );
            }
          },
          () => {},
        );
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
                    },
                    (res) => {
                      console.log('userLogin error setIsRisk', res);
                      setIsRisk(true);
                    },
                  );
                }
              },
              () => {},
            );
          } else if (data === '0') {
            // 登录失败则跳转京东登录页面
            toLogin();
          }
        },
        () => {},
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
