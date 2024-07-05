import React, {
  useEffect,
  useState,
  Fragment,
  useRef,
  useMemo,
  useCallback,
  useContext,
} from 'react';

import { getRpx, imgUri, getDisplayName } from '@/utils';
import 'swiper/swiper.min.css';
import Product from './Product';
import { MockDataContext } from '../Home';
import { ToastContext } from '../../context/context';

// 小于2个图片时显示没有评论的组件
const NoCommentComponent = ({ videoListLength, imageListLength }) => {
  const vLen = videoListLength ?? 0;
  const iLen = imageListLength ?? 0;
  const payloadProps = useContext(MockDataContext);

  return (
    vLen + iLen < 2 && (
      <div
        style={{
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <img
          style={{
            width: getRpx(663),
            height: getRpx(59),
          }}
          src={payloadProps.wordImg}
          alt=""
        />
      </div>
    )
  );
};

export default ({ scrollBottom, setCurrentVideoInfo }) => {
  const pageSize = 10;
  const [navList, setNavList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [navCommentMap, setNavCommentMap] = useState({});
  const [navProductMap, setNavProductMap] = useState({});
  const [currentPage, setCurrentPage] = useState(0);

  const payloadProps = useContext(MockDataContext);
  const { showToast } = useContext(ToastContext);
  const mainAdID = payloadProps.navListAdId;

  const commentImgWidth = getRpx(270);
  const commentImgHight = getRpx(270);

  // 已获取的广告ID
  const gotAdID = useRef(new Set());
  // 已获取的商品Sku
  const gotSkus = useRef(new Map());

  // 获取导航商品评论信息
  const getNavComments = async (adID, navID) => {
    if (gotAdID.current.has(adID)) {
      return;
    }
    try {
      const res = await window.babel.babelAdvertInfoNew({ body: adID });
      if (res.code === '0') {
        gotAdID.current.add(adID);

        const { list = [] } = res.data[`payload_${adID}`];
        navCommentMap[navID] = list;
        setNavCommentMap({ ...navCommentMap });
      }
    } catch (e) {}
  };

  // 获取导航商品信息
  const getNavProductInfos = async (adID, navID) => {
    if (gotAdID.current.has(adID)) {
      return;
    }
    try {
      const res = await window.babel.babelProductInfoNew({ body: adID });
      if (res.code === '0') {
        gotAdID.current.add(adID);

        const { list = [] } = res.data[`payload_${adID}`];
        navProductMap[navID] = list;
        setNavProductMap({ ...navProductMap });
      }
    } catch (e) {}
  };

  // 获取商品信息
  const getProductData = useCallback(
    (navCommentItem, advertId) => {
      if (!navProductMap[advertId]) return null;
      if (gotSkus.current.has(navCommentItem.extension.skus[0]))
        return gotSkus.current.get(navCommentItem.extension.skus[0]);

      const product = navProductMap[advertId].find((product) => {
        return product.skuId == navCommentItem.extension.skus[0];
      });
      if (!product) return null;
      gotSkus.current.set(navCommentItem.extension.skus[0], product);
      return product;
    },
    [navProductMap],
  );

  const isMounted = useRef(false);
  // 主页滑动到底部加载更多评论
  useEffect(() => {
    if (!isMounted.current) return;
    if (notMore) return;
    setCurrentPage(currentPage + pageSize);
  }, [scrollBottom]);

  useEffect(() => {
    isMounted.current = true;
  }, []);

  const [displayList, setDisplayList] = useState([]);
  const [notMore, setNotMore] = useState(false);

  const getDisplayList = () => {
    if (!navCommentMap?.[currentIndex]) return;
    if (notMore) return;
    let tempDisplayList = [...displayList];
    if (currentPage === 0) {
      tempDisplayList = [];
    }

    // 前端分页加载
    console.log('1111111currentPage', currentPage);
    const currentList = navCommentMap?.[currentIndex].slice(currentPage, currentPage + pageSize);
    console.log('2222222currentList', currentList);
    tempDisplayList = tempDisplayList.concat(currentList);
    console.log('3333333tempDisplayList', tempDisplayList);
    if (currentPage * pageSize + pageSize >= navCommentMap?.[currentIndex].length) {
      setNotMore(true);
    }
    setDisplayList(tempDisplayList);
    // console.log("displayList, navCommentMap, navProductMap", tempDisplayList, navCommentMap, navProductMap)
  };

  useEffect(() => {
    getDisplayList();
  }, [currentPage, currentIndex]);

  useEffect(() => {
    window.babel.babelAdvertInfoNew({ body: mainAdID }).then(
      async (res) => {
        if (res.code === '0') {
          const { list = [] } = res.data[`payload_${mainAdID}`];
          setNavList(list);
          const allNavCommentPromise = [];
          list.forEach((item) => {
            allNavCommentPromise.push(getNavComments(item.comments[0], item.advertId));
            item.comments[1] && getNavProductInfos(item.comments[1], item.advertId);
          });
          Promise.all(allNavCommentPromise).then(
            () => {
              // const activeIndex = list.length - 1;
              const activeIndex = 0;
              setCurrentIndex(list[activeIndex].advertId);
              getDisplayList();
            },
            () => {},
          );
        }
      },
      () => {},
    );
  }, []);

  return (
    <div
      style={{
        paddingTop: getRpx(20),
        width: '100%',
        backgroundColor: payloadProps.mainBackgroundColor,
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
        }}
      >
        <img
          style={{
            width: '100%',
          }}
          src={payloadProps.shopBgImg}
          alt="抄购物车背景图"
        />
        {
          // nav list
          <div
            style={{
              width: '100%',
              display: 'flex',
              paddingLeft: getRpx(60),
              boxSizing: 'border-box',
              overflow: 'hidden',
              overflowX: 'auto',
              flexWrap: 'nowrap',
            }}
            onScroll={(e) => {
              // 阻止事件冒泡 防止滚动穿透 否者会触发主页面滚动到底部事件
              e.stopPropagation();
            }}
          >
            {navList.map((item) => {
              return (
                <div
                  key={item.advertId}
                  style={{
                    flex: `0 0 ${getRpx(192)}px`,
                    width: getRpx(192),
                    height: getRpx(228),
                  }}
                  onClick={() => {
                    // setDisplayList([]);
                    setCurrentPage(0);
                    setNotMore(false);
                    setCurrentIndex(item.advertId);
                  }}
                >
                  <img
                    style={{
                      width: '100%',
                      height: '100%',
                    }}
                    src={
                      currentIndex === item.advertId ? imgUri(item.desc) : imgUri(item.pictureUrl)
                    }
                  />
                </div>
              );
            })}
          </div>
        }
        {
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {displayList.map((item, index) => {
              return (
                <div
                  style={{
                    position: 'relative',
                    width: getRpx(1109),
                    height: getRpx(839),
                  }}
                  key={item.id}
                >
                  <img
                    style={{
                      position: 'absolute',
                      width: '100%',
                      // height: getRpx(759),
                    }}
                    src={payloadProps.commentCartBgImg}
                    alt=""
                  />
                  {/* 头像 */}
                  <div
                    style={{
                      position: 'absolute',
                      width: getRpx(1109 - 150),
                      top: getRpx(50),
                      left: getRpx(45),
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <img
                          style={{
                            borderRadius: '50%',
                            width: getRpx(90),
                            height: getRpx(90),
                            marginRight: getRpx(32.6),
                          }}
                          src={imgUri(item.extension.headImg)}
                          alt=""
                        />
                        <span
                          style={{
                            color: 'rgba(108, 29, 26, 1)',
                            fontWeight: 500,
                            fontSize: getRpx(42),
                          }}
                        >
                          {getDisplayName(item.extension.nickName)}
                        </span>
                      </div>
                      <div
                        style={{
                          color: 'rgba(173, 143, 140, 1)',
                          fontSize: getRpx(37),
                        }}
                      >
                        近期发布
                      </div>
                    </div>
                  </div>
                  {/* 评论内容 */}
                  <div
                    style={{
                      position: 'absolute',
                      width: getRpx(1109 - 90),
                      top: getRpx(150),
                      left: getRpx(45),
                      display: 'flex',
                    }}
                  >
                    <div
                      style={{
                        height: getRpx(102),
                        color: 'rgba(111, 90, 90, 1)',
                        fontSize: getRpx(36),
                        overflow: 'auto',
                        wordBreak: 'break-all',
                        width: getRpx(1109 - 90 - 60),
                      }}
                      onScroll={(e) => {
                        // 阻止事件冒泡 防止滚动穿透 否者会触发主页面滚动到底部事件
                        e.stopPropagation();
                      }}
                    >
                      <p
                        style={{
                          color: 'rgba(111, 90, 90, 1)',
                          fontSize: getRpx(39),
                          lineHeight: getRpx(39 * 1.3) + 'px',
                          // display: '-webkit-box', //对象作为弹性伸缩盒子模型显示
                          // '-webkit-box-orient': 'vertical', //设置或检索伸缩盒对象的子元素的排列方式
                          // '-webkit-line-clamp': '2', //溢出省略的界限
                          // overflow: 'hidden', //设置隐藏溢出元素
                        }}
                      >
                        {item.extension.postContent}
                      </p>
                    </div>
                    <div
                      style={{
                        width: getRpx(54),
                        height: getRpx(102),
                      }}
                    >
                      <img
                        style={{ width: '100%', height: '100%' }}
                        src={payloadProps.moreImg}
                        alt=""
                      />
                    </div>
                  </div>
                  {/* 评论图片 */}
                  <div
                    style={{
                      position: 'absolute',
                      display: 'flex',
                      width: getRpx(1109 - 90),
                      top: getRpx(260),
                      left: getRpx(45),
                      overflow: 'hidden',
                      overflowX: 'auto',
                    }}
                    onScroll={(e) => {
                      // 阻止事件冒泡 防止滚动穿透 否者会触发主页面滚动到底部事件
                      e.stopPropagation();
                    }}
                  >
                    {item?.extension?.mediaInfo?.videoVoList?.map((video) => {
                      return (
                        <div
                          key={video.vid}
                          style={{
                            flex: `0 0 ${commentImgWidth}px`,
                            width: commentImgWidth,
                            height: commentImgHight,
                            borderRadius: getRpx(16.8),
                            marginRight: getRpx(20),
                          }}
                        >
                          <div
                            style={{
                              width: '100%',
                              height: '100%',
                              position: 'relative',
                            }}
                          >
                            <img
                              style={{
                                borderRadius: getRpx(16.8),
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                objectPosition: 'center',
                              }}
                              src={imgUri(video.imageUrl)}
                              alt=""
                            />
                            <img
                              style={{
                                position: 'absolute',
                                borderRadius: getRpx(16.8),
                                width: getRpx(71),
                                height: getRpx(71),
                                transform: 'translate(-50%, -50%)',
                                top: '50%',
                                left: '50%',
                              }}
                              onClick={() => {
                                setCurrentVideoInfo({
                                  ...video,
                                  isPlay: true,
                                  type: 'video',
                                });
                              }}
                              src={payloadProps.videoPlayImg}
                              alt="videPlay"
                            />
                          </div>
                        </div>
                      );
                    })}
                    {item?.extension?.mediaInfo?.imageList?.map((img) => {
                      return (
                        <div
                          key={img}
                          style={{
                            flex: `0 0 ${commentImgWidth}px`,
                            width: commentImgWidth,
                            height: commentImgHight,
                            borderRadius: getRpx(16.8),
                            marginRight: getRpx(20),
                            position: 'relative',
                          }}
                        >
                          <img
                            style={{
                              borderRadius: getRpx(16.8),
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              objectPosition: 'center',
                            }}
                            src={img}
                            alt=""
                            onClick={() => {
                              setCurrentVideoInfo({
                                imgUrl: img,
                                isPlay: true,
                                type: 'image',
                              });
                            }}
                          />
                        </div>
                      );
                    })}
                    {
                      <div
                        style={{
                          height: commentImgHight,
                        }}
                      >
                        <NoCommentComponent
                          videoListLength={item?.extension?.mediaInfo?.videoVoList?.length}
                          imageListLength={item?.extension?.mediaInfo?.imageList?.length}
                        />
                      </div>
                    }
                  </div>
                  {/* 商品信息 */}
                  {getProductData(item, currentIndex) ? (
                    <Product
                      productInfo={getProductData(item, currentIndex)}
                      showToast={showToast}
                    />
                  ) : (
                    <div
                      style={{
                        position: 'absolute',
                        width: getRpx(1065),
                        height: getRpx(273),
                        bottom: getRpx(20),
                        left: getRpx(25),
                        overflow: 'hidden',
                      }}
                    >
                      <img
                        style={{ width: '100%', height: '100%' }}
                        src={payloadProps.noSkuImg}
                        alt=""
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        }
      </div>
    </div>
  );
};
