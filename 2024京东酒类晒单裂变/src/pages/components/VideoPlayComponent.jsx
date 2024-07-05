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

const VideoPlayComponent = ({ videoInfo }) => {
  const [isPlaying, setIsPlaying] = useState(videoInfo.isPlay);
  const videoRef = useRef(null);

  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (videoInfo.type !== 'video') {
      return;
    }
    if (!videoInfo.playUrl) {
      return;
    }
    setShowPopup(true);
  }, [videoInfo]);

  return (
    <Fragment>
      {showPopup ? (
        <div className={styles.popup}>
          <div
            style={{
              position: 'relative',
              width: getRpx(990),
            }}
          >
            <video
              style={{
                width: '100%',
              }}
              x5-playsinline="true"
              webkit-playsinline="true"
              playsInline={true}
              autoPlay
              controls
              src={videoInfo.playUrl}
              ref={videoRef}
            ></video>
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
