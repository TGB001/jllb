import React, {
  useState,
  useContext,
  Fragment,
} from 'react';
import {
  getRpx,
} from '@/utils';
import { MockDataContext, CloseIcon } from '../Home';
import styles from '../Home.module.css'
import InfiniteScroll from './InfiniteScroll';


const RulePopup = () => {
  const [showPopup, setShowPopup] = useState(false);
  const payloadProps = useContext(MockDataContext);
  return (
    <Fragment>
      <div
        style={{
          width: '100%',
          height: getRpx(177),
          position: 'relative',
        }}
      >
        <InfiniteScroll />
        {/* <TopCarousel /> */}
        <div
          className="rule_btn"
          style={{
            position: 'absolute',
            width: getRpx(227),
            height: getRpx(177),
            top: getRpx(0),
            right: getRpx(0),
            zIndex: 10,
          }}
          onClick={() => {
            setShowPopup(true);
          }}
        >
          <img
            style={{
              width: '100%',
              height: '100%',
            }}
            src={payloadProps.ruleImg}
            alt="规则按钮"
          />
        </div>
      </div>
      {showPopup ? (
        <div className={styles.popup}>
          <div
            style={{
              position: 'relative',
              width: getRpx(990),
              height: getRpx(1326),
            }}
          >
            <img
              style={{
                width: '100%',
                height: '100%',
                position: 'absolute',
              }}
              src={payloadProps.rulePop}
            />
            <div
              style={{
                top: getRpx(240),
                left: getRpx(135),
                width: getRpx(720),
                height: getRpx(966),
                position: 'absolute',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  overflowY: 'auto',
                }}
                onScroll={(e) => {
                  e.stopPropagation();
                }}
              >
                <img
                  style={{
                    width: '100%',
                  }}
                  src={payloadProps.ruleWord}
                  alt="规则文案"
                />
              </div>
            </div>
          </div>

          <CloseIcon
            onClick={() => {
              setShowPopup(false);
            }}
          />
        </div>
      ) : null}
    </Fragment>
  );
};

export default RulePopup;
