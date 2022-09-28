import React, { useRef, useState } from 'react';
import styles from './video.module.less';
let videoProcessInterval;

const VideoCmpt = (props: {
  url: string
}) => {
  const [videoParams, setVideoParams ] = useState<any>({
    showPlayIcon: false,
    playOrPause: false
  })

  const videoRef = useRef<HTMLVideoElement>(null)
  const onPlayVideo = () => {
    try {
      let video = videoRef.current;
        if (!video) return;
        if (videoParams.playOrPause) {
          video.pause();
            setVideoParams((params) => ({...params, showPlayIcon: true}))
            clearInterval(videoProcessInterval)
        } else {
            // wx.ready(() => {
            //     // 在微信的ready中进行播放 不管成功配置与否 都会执行ready
            //     video.play();
            // })
            video.play();
            video.pause();
            setTimeout(() => {
              if(!video) return;
              video.play();
                setVideoParams((params) => ({...params, showPlayIcon: false}))
                videoProcessInterval = setInterval(() => {
                   changeProcess()
                }, 100)
            }, 100)
        }
        setVideoParams((params) => ({...params, playOrPause: !params.playOrPause}))
    } catch (e) {
        alert(e)
    }
  }

  const onPlayLoad = (e) => {
    console.log(e, '---e-------')
  }

  const onPlayEnd = () => {
    // this.isVideoShow = true
    // this.current += this.current
  }

   //记录播放进度
  const changeProcess = () => {
    // let video = document.querySelectorAll('video')[this.current];
    // let currentTime = video.currentTime.toFixed(1);
    // let duration = video.duration.toFixed(1);
    // this.videoProcess = parseInt((currentTime / duration).toFixed(2) * 100)
  }
  if (!props.url) return null;
  console.log()
  return  <React.Fragment>
            <video 
              ref={videoRef}
              className={styles.VideoCmpt} 
              loop 
              webkit-playsinline="true" 
              x5-video-player-type="h5-page"
              x5-video-player-fullscreen="true" 
              playsInline={true}
              preload="auto"
              poster={''}
              autoPlay
              src={props.url}
              // playOrPause={playOrPause}
              onClick={onPlayVideo}
              onEnded={onPlayEnd}
              onLoad={onPlayLoad}
              />

          <img 
            className={styles.playIcon}
            style={{ display: videoParams.showPlayIcon ? 'inline': 'none'}} 
            onClick={onPlayVideo}
            src="http://npjy.oss-cn-beijing.aliyuncs.com/images/file-1575340653940esdHR.png"/>
  </React.Fragment>

}

export default VideoCmpt;