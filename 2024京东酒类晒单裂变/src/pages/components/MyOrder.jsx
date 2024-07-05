import React, { useEffect, useState, useContext } from 'react';
import { getRpx, jumpOther, jumpComment, debounce, reportWithoutJump } from '@/utils';
import { MockDataContext } from '../Home';
import { UserContext } from '../../context/context';
import { comments } from '@/server/dataManager';

const MyOrderItem = ({ isOrdered, itemData }) => {
  const changeOrder = () => {
    // 跳转评论中心
    // jumpComment('http://wqs.jd.com/wxsq_project/comment/commentList/index.html', '去晒单');
    // setOrdered(!isOrdered);
    reportWithoutJump('qushaidan')
    window.location.href = ` openApp.jdMobile://virtual?params={"category":"jump","des":"commentCenter","jumpType":"1"}`;
  };
  const payloadProps = useContext(MockDataContext);
  return (
    <div
      style={{
        position: 'relative',
        height: getRpx(496),
        width: getRpx(297),
        flex: `0 0 ${getRpx(297)}px`,
        marginRight: getRpx(26.9),
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <img
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
        }}
        src={payloadProps.orderImg}
        alt="酒背景图"
      />
      <img
        style={{
          position: 'absolute',
          height: getRpx(267),
          width: getRpx(267),
          top: getRpx(80),
          borderRadius: getRpx(21),
          objectFit: 'contain',
        }}
        src={`http://m.360buyimg.com/babel/${itemData.skuImage}`}
        alt=""
      />
      <div
        style={{
          position: 'absolute',
          width: getRpx(260),
          top: getRpx(370),
          color: 'rgba(64, 68, 71, 1)',
          fontSize: getRpx(28.4),
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textAlign: 'center',
        }}
      >
        {itemData.skuName}
      </div>
      {
        // 0未评价 ，1 已评价
        itemData.status == 1 ? (
          <img
            style={{
              position: 'absolute',
              width: getRpx(195.5),
              height: getRpx(61.7),
              bottom: getRpx(20),
            }}
            src={payloadProps.alOrderImg}
            alt="已晒单"
          />
        ) : (
          <img
            style={{
              position: 'absolute',
              width: getRpx(195.5),
              height: getRpx(61.7),
              bottom: getRpx(20),
            }}
            onClick={changeOrder}
            src={payloadProps.goOrderImg}
            alt="去晒单"
          />
        )
      }
    </div>
  );
};

const MyOrder = () => {
  const [notOrder, setNotOrder] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const payloadProps = useContext(MockDataContext);
  const {
    userData: { current: userData },
  } = useContext(UserContext);

  const [commentList, setCommentList] = useState([]);

  const clickDebounce = debounce(() => {
    getAllCommentList();
  }, 300)

  const getAllCommentList = async () => {
    setIsLoading(true);
    const params = {
      pageSize: '15',
      page: '1',
      status: '1', //状态筛选(1 待评价 ，5 已评价)
      isvPin: userData.pin,
      open_id_isv: userData.open_id,
      xid_isv: userData.xid,
      update_history: userData.is_first_login == 'true' ? 'true' : 'false',
      filter: {
        firstCategory: 12259,
      },
    };
    console.log("userData.pin, params",userData.pin, params)
    try {
      let [hasComment, notComment] = await Promise.all([
        comments('new', userData.pin, {
          ...params,
          status: '5',
        }),
        comments('new', userData.pin, params),
      ]);
      console.log('MyOrder getAllCommentList hasComment', hasComment);
      console.log('MyOrder getAllCommentList notComment', notComment);
      hasComment = hasComment?.data ?? [];
      notComment = notComment?.data ?? [];
      // 去重
      hasComment = hasComment.filter((item) => {
        return notComment.findIndex((item2) => item2.orderCompletionTime === item.orderCompletionTime) === -1;
      })
      // const allCommentList = hasComment;
      const allCommentList = notComment.concat(hasComment);
      console.log('MyOrder getAllCommentList allCommentList', allCommentList);
      if (allCommentList.length > 0) {
        setNotOrder(false);
        setCommentList(allCommentList);
      } else {
        setNotOrder(true);
      }
      setIsLoading(false);
    } catch {
      console.log('MyOrder comments getAllCommentList error');
      setIsLoading(true);
    }
  };
  useEffect(() => {
    // prizeTwo 获取完数据之后再获取评论列表 防止数据不一致
    getAllCommentList();
  }, []);
  return (
    <div
      style={{
        width: '100%',
        height: getRpx(708),
      }}
    >
      {isLoading ? (
        <div
          style={{
            width: '100%',
            height: '100%',
          }}
          onClick={clickDebounce}
        >
          <img
            style={{
              width: '100%',
            }}
            src={payloadProps.qpsImg}
            alt="订单空状态"
          />
        </div>
      ) : notOrder ? (
        <div
          style={{
            width: '100%',
            height: getRpx(708),
          }}
        >
          <img
            style={{
              width: '100%',
            }}
            src={payloadProps.orderBlackImg}
            alt="订单空状态"
          />
        </div>
      ) : (
        <div
          style={{
            width: '100%',
            height: '100%',
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
              src={payloadProps.orderBgImg}
              alt="我的订单"
            />
            <div
              style={{
                position: 'absolute',
                width: getRpx(1040),
                height: getRpx(498),
                left: getRpx(40),
                top: getRpx(105),
                overflow: 'hidden',
                overflowX: 'auto',
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'nowrap',
              }}
              onScroll={(e) => {
                // 阻止事件冒泡 防止滚动穿透 否者会触发主页面滚动到底部事件
                e.stopPropagation();
              }}
            >
              {commentList.map((item, index) => {
                return <MyOrderItem itemData={item} key={index} />;
              })}
              <div
                style={{
                  height: '100%',
                  width: getRpx(297),
                  flex: `0 0 ${getRpx(297)}px`,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <img
                  style={{
                    width: getRpx(203),
                    height: getRpx(234),
                  }}
                  src={payloadProps.orderBottomImg}
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrder;
