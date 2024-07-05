import React, {
  useState,
  Fragment,
  useRef,
  useEffect
} from 'react';
import {
  getRpx,
} from '@/utils';
import { CloseIcon } from '../Home';
import styles from '../Home.module.css'

const VideoPlayComponent = ({ imgInfo }) => {
  const [isPlaying, setIsPlaying] = useState(imgInfo.isPlay);
  const videoRef = useRef(null);

  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (imgInfo.type !== 'image') {
      return
    }
    console.log('imgInfo', imgInfo)
    if (!imgInfo.imgUrl) {
      return;
    }
    setShowPopup(true);
  }, [imgInfo]);

  return (
    <Fragment>
      {showPopup ? (
        <div className={styles.popup}
          onClick={() => {
            setShowPopup(false);
          }}
        >
          <div
            style={{
              position: 'relative',
              width: getRpx(990),
            }}
          >
            <img
              style={{
                width: '100%',
              }}
              src={imgInfo.imgUrl}
              onClick={e => {
                e.stopPropagation()
              }}
            />
            <div
              style={{
                marginTop: getRpx(50),
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <CloseIcon
                onClick={() => {
                  setShowPopup(false);
                }}
              />
            </div>
          </div>
        </div>
      ) : null}
    </Fragment>
  );
};

export default VideoPlayComponent;
