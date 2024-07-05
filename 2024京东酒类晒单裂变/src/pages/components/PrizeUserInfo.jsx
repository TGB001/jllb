import React, {
  useContext,
} from 'react';
import {
  getRpx,
} from '@/utils';
import { UserContext } from '../../context/context';

const PrizeUserInfo = () => {
  let {
    userData: { current: userData },
  } = useContext(UserContext);

  return (
    // {/* 用户信息 */}
    <div
      style={{
        position: 'absolute',
        left: getRpx(45),
        top: getRpx(20),
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: getRpx(480),
      }}
    >
      <div
        style={{
          width: getRpx(78),
          height: getRpx(78),
          borderRadius: '50%',
        }}
      >
        {userData.user_avatar && (
          <img
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
            }}
            src={userData.user_avatar}
            alt="用户头像"
          />
        )}
      </div>
      <div
        style={{
          marginLeft: getRpx(18),
          color: 'rgba(247, 207, 178, 1)',
          fontWeight: 500,
          fontSize: getRpx(42),
          flex: 1,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {userData.user_name}
      </div>
    </div>
  );
};

export default PrizeUserInfo;
