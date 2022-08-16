import React from 'react';
// import videos from '../assets/data/video-data.json';
import videojs from 'video.js';

// function VideoPlayer() {
//     return (
//         <video id="video" className="video-player" playsInline={true} data-matomo-title="Pfizer">
//             <source src={`./assets/videos/${videos[0].video}`} type="video/mp4" />
//             <source src={`./assets/videos/${videos[0].video}`} type="video/ogg" />
//             <track src={`./assets/data/${videos[0].subtitles}`} kind="subtitles" srcLang="en" label="English" />
//         </video>
//     )
// }

class VideoPlayer extends React.Component {
    componentDidMount() {
      this.player = videojs(this.videoNode, this.props, function onPlayerReady() {
        //console.log('onPlayerReady', this)
      });
    }
  
    componentWillUnmount() {
      if (this.player) {
        this.player.dispose()
      }
    }
  
    render() {
      return (
        <div className="responsive-video">
          <div data-vjs-player>
            <video ref={node => this.videoNode = node} className="video-js vjs-default-skin vjs-big-play-centered"  playsInline={true}></video>
          </div>
        </div>
      )
    }
  }

export default VideoPlayer;