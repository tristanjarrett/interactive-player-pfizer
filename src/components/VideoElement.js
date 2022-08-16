import React, {useState, useLayoutEffect} from 'react';
import VideoPlayer from './Video';
import VideoPlayerSub from './VideoSub';
import FaqPlayer from './FaqPlayer';
import playIcon from '../assets/images/play_icon.svg';
import pdfIcon from '../assets/images/download_pdf.svg';
import closeIcon from '../assets/images/close_icon.svg';
import RotateGif from '../assets/images/rotate_device.gif';
import playControl from '../assets/images/play.svg';
import pauseControl from '../assets/images/pause.svg';
import playPauseControl from '../assets/images/play-pause.svg';

import videos from '../assets/data/video-data.json';


const VideoElement = () => {

    const [checked, setChecked] = useState(true);
    const [startVisible, setStartVisible] = useState(true);
    const [menuVisible, setMenuVisible] = useState(false);
    const [faqsVisible, setFaqsVisible] = useState(false);
    const [popupVisible, setPopupVisible] = useState(false);
    const [multiPopupsVisible, setMultiPopupsVisible] = useState(false);
    const [infoVisible, setInfoVisible] = useState(false);
    const [infoMultiVisible, setInfoMultiVisible] = useState(false);
    const [faqAnswerVisible, setFaqAnswerVisible] = useState(false);
    const [blurVisible, setBlurVisible] = useState(false);
    const [warningVisible, setWarningVisible] = useState(false);
    const [videoIsPlaying, setVideoIsPlaying] = useState(false);
    // const [faqVideoIsPlaying, setFaqVideoIsPlaying] = useState(false);
    const [currentMenu, setCurrentMenu] = useState(0);
    const [currentFaq, setCurrentFaq] = useState({});
    const [faqs] = useState(videos[0].faqs)
    const [currentChapter, setCurrentChapter] = useState(0);
    const [popupIncrement, setPopupIncrement] = useState(0);
    const [popupData, setPopupData] = useState(0);
    const [faqSubtitles, setFaqSubtitles] = useState(true);
    const [subtitlesEnabled, setSubtitlesEnabled] = useState(true);

    let video;
    let tick;
    let browserDelay;
    let faqVideo;
    let faqVideoIsPlaying = true; // change if autoplay is disabled
    // let currentPopup = 0;

    const jumpToChapter = (time) => {

      video.currentTime = breakdownTime(time);
      playVideo();

    }

    const breakdownTime = (start) => {
      let time = start.split(':');
      let min = time[0];
      let sec = time[1];
      min = min * 60;
      time = parseFloat(min) + parseFloat(sec);
      return time;
    }

    const startVideo = () => {
      setStartVisible(false);
      setMenuVisible(true);
      playVideo();
    }

    const playVideo = () => {
      setVideoIsPlaying(true);
      video.play();
    }

    const pauseVideo = () => {
      setVideoIsPlaying(false);
      video.pause();
    }

    const playFaqVideo = () => {
      // setFaqVideoIsPlaying(true);
      faqVideoIsPlaying = true;
      faqVideo.play();
    }

    const pauseFaqVideo = () => {
      // setFaqVideoIsPlaying(false);
      faqVideoIsPlaying = false;
      faqVideo.pause();
    }

    const toggleMoreInfo = () => {
      if (infoVisible) {
        setInfoVisible(false);
        setMenuVisible(true);
        setPopupVisible(false);
        playVideo();
      } else {
        setInfoVisible(true);
        setMenuVisible(false);
        setPopupVisible(false);
      }
    }

    const toggleMoreInfoMulti = (num) => {
      setPopupData(num);
      if (infoMultiVisible) {
        setInfoMultiVisible(false);
        setMenuVisible(true);
        setMultiPopupsVisible(true);
      } else {
        setInfoMultiVisible(true);
        setMenuVisible(false);
        setMultiPopupsVisible(false);
      }
    }

    const resumeMulti = () => {
      setMultiPopupsVisible(false);
      playVideo();
    }

    const toggleFaqAnswer = () => {
      if (faqAnswerVisible) {
        setFaqAnswerVisible(false);
        setMenuVisible(true);
        setFaqsVisible(true);
      } else {
        setFaqAnswerVisible(true);
        setMenuVisible(false);
        setFaqsVisible(false);
      }
    }

    const loadFaq = (faq) => {
      toggleFaqAnswer();
      setCurrentFaq(faq)
    }

    const menuAction = (time) => {
      if (faqsVisible || blurVisible) {
        setBlurVisible(false);
        setFaqsVisible(false);
      }

      if (popupVisible) {
        setPopupVisible(false);
      } else if (multiPopupsVisible) {
        setMultiPopupsVisible(false);
      }

      menuItemActive(time);
      setCurrentChapter(time);
      setPopupIncrement(0);
      // currentPopup = 0;

      jumpToChapter(videos[0].chapters[time].start);
    }

    const menuItemActive = (item) => {
        switch (item) {
            case 0:
                setCurrentMenu(0)
                break;
            case 1:
                setCurrentMenu(1)
                break;
            case 2:
                setCurrentMenu(2)
                break;
            case 3:
                setCurrentMenu(3)
                break;
            case 4:
                setCurrentMenu(4)
                break;
            default:
                setCurrentMenu(0)
                break;
          }
    }

    const openFaqs = () => {
      setBlurVisible(true);
      setFaqsVisible(true);
      menuItemActive(4);
      video.pause();
    }

    
    const toggleVideoPlayback = () => {
      if (videoIsPlaying) {
        pauseVideo();
      } else {
        playVideo();
      }
    }

    const toggleFaqVideoPlayback = () => {
      if (faqVideoIsPlaying) {
        pauseFaqVideo();
      } else {
        playFaqVideo();
      }
    }

    useLayoutEffect(() => {

      // const ua = navigator.userAgent.toLowerCase(); 
      // if (ua.indexOf('safari') != -1) { 
      //   if (ua.indexOf('chrome') > -1) {
      //     // alert("1") // Chrome
      //     browserDelay = 4;
      //   } else {
      //     // alert("2") // Safari
      //     browserDelay = 8;
      //   }
      // } else {
      //   browserDelay = 4;
      // }

      browserDelay = 1;

      // console.log("browserDelay", browserDelay)

      // video = document.getElementById('video');
      video = document.querySelector('video');
      faqVideo = document.getElementById('faq-video');

      if (!startVisible) {

        let arrayChapters = [];
        let arraySections = [];

        const chapters = videos[0].chapters;

        for (let i = 0; i < chapters.length; i++) {
          
          const chapterTimes = chapters[i];
          let chapterTime = breakdownTime(chapterTimes.start);
          chapterTime = chapterTime * browserDelay; // 250ms workaround
          arrayChapters.push(chapterTime);

          const sections = chapters[i].sections;

          for (let x = 0; x < sections.length; x++) {
            
            const times = sections[x];
            let time = breakdownTime(times.start);
            time = time * browserDelay; // 250ms workaround
            let timeEnd = breakdownTime(times.end);
            timeEnd = timeEnd * browserDelay; // 250ms workaround
            timeEnd = Math.round(timeEnd);
            arraySections.push(time, timeEnd);
            
          }
          
        }
        
        // console.log("arrayChapters:", arrayChapters)
        // console.log("arraySections:", arraySections)

        
        video.addEventListener('timeupdate', function() {
          
          
          tick = (video.currentTime * browserDelay);
          tick++;
          
          tick = Math.floor(tick);
          // console.log("tick", tick)

          if ((arraySections.includes(tick) || arrayChapters.includes(tick)) && tick !== 0) {

            for (let i = 0; i < videos[0].chapters.length; i++) {
              
              const chapter = videos[0].chapters[i];

              let chapterNewTime = breakdownTime(chapter.start)
              chapterNewTime = chapterNewTime * browserDelay; // 250ms workaround

              if (tick === chapterNewTime) {
                menuItemActive(i);
                setCurrentChapter(i);
                setPopupIncrement(0);
                // currentPopup = 0;
              }
              
              for (let x = 0; x < chapter.sections.length; x++) {
                
                const section = chapter.sections[x];
                // console.log(section.popups)
                let popups = section.popups;
                
                let secondsTime = breakdownTime(section.start)
                secondsTime = secondsTime * browserDelay; // 250ms workaround
                
                if (tick === secondsTime) {
                  setTimeout(() => {
                    pauseVideo();
                    if (popups === 1) {
                      setPopupVisible(true);
                    } else {
                      setMultiPopupsVisible(true);
                    }
                  }, 1000);
                }

                let secondsEndTime = breakdownTime(section.end)
                secondsEndTime = secondsEndTime * browserDelay; // 250ms workaround

                if (tick === secondsEndTime) {

                  if (chapter.sections.length > 1) {
                    setPopupIncrement(x + 1);
                    // currentPopup = x + 1;
                    // console.log("popupIncrement", popupIncrement)
                    // console.log("currentPopup", currentPopup)
                  }

                }
  
              }
            }

          }

        }, false);

      }
    
  
    }, [startVisible])
    
    useLayoutEffect(() => {
        // video = document.getElementById('video');
        video = document.querySelector('video');
        faqVideo = document.getElementById('faq-video');

        // display warning on start if in portrait mode
        if (window.innerHeight > window.innerWidth) {
            setWarningVisible(true);
        }

        // show or hide subtitles
        if (checked) {
            // video.textTracks[0].mode = "showing";
            setSubtitlesEnabled(true);
            setFaqSubtitles(true);
        } else {
            // video.textTracks[0].mode = "hidden";
            setSubtitlesEnabled(false);
            setFaqSubtitles(false);
        }

        video.addEventListener('ended', openFaqs, false);
    });

    // check for window resizing to display warning or not
    if ('onresize' in window) {
        window.addEventListener("resize", function() {
            if (window.innerHeight > window.innerWidth) {
                setWarningVisible(true);
            } else {
                setWarningVisible(false);
            }
        }, false);
    }
    

    const Blur = () => {
      return (
        <div className="blur-overlay"></div>
      )
    }

    const DeviceWarning = () => {
      return (
        <div className="warning-overlay">
          <div className="warning-content">
            <p className="warning-text">Please rotate your mobile device or make you browser window wider for the app to run correctly</p>
            <img src={RotateGif} alt="Rotate device" />
          </div>
        </div>
      )
    }

    const Menu = () => {
      return (
        <ul className="menu-overlay">
          <li>
            <button onClick={() => menuAction(1)} className={ currentMenu === 1 ? "menu-active" : ""}>About <br />avelumab <br />+ axitinib</button>
          </li>
          <li>
            <button onClick={() => menuAction(2)} className={ currentMenu === 2 ? "menu-active" : ""}>Possible <br />side <br />effects</button>
          </li>
          <li>
            <button onClick={() => menuAction(3)} className={ currentMenu === 3 ? "menu-active" : ""}>Life <br />during <br />treatment</button>
          </li>
          <li>
            <button onClick={openFaqs} className={ currentMenu === 4 ? "menu-active" : ""}>FAQs</button>
          </li>
        </ul>
      )
    }

    const StartScreen = () => {
      return (
        <div className="start-overlay">
          <div className="start-subtitles">
            <span>Subtitles</span>
            <label className="switch">
                <input type="checkbox" checked={checked} readOnly />
                <div className="slider"></div>
            </label>
            <button className="start-subtitles-button" onClick={() => {checked ? setChecked(false) : setChecked(true)}}></button>
          </div>
          <button className="start-play" onClick={startVideo}>
            <span className="start-play-text">Click here to start</span>
            <img src={playIcon} alt="Play Video" className="start-play-img" />
          </button>
          <a className="start-pdf" href={`./assets/files/${videos[0].guide}`} rel="noreferrer" target="_blank">
            <img src={pdfIcon} alt="PDF" className="start-pdf-img" />
            <span className="start-pdf-text">Download the<br />PDF guide</span>
          </a>
          <a href="https://yellowcard.mhra.gov.uk/" target="_blank" className="start-link-1"></a>
          <a href="https://yellowcard.mhra.gov.uk/" target="_blank" className="start-link-2"></a>
        </div>
      )
    }

    const Popup = () => {
      return (
        <div className="popup-overlay">
          <img src={`./assets/images/${videos[0].chapters[currentChapter].sections[popupIncrement].image}`} alt="Poster" className="popup-image" />
          <p className="popup-text">{videos[0].chapters[currentChapter].sections[popupIncrement].title}</p>
          <button onClick={toggleMoreInfo} className="popup-button">More information</button>
        </div>
      )
    }

    const MoreInfo = () => {
      return (
        <div className="more-info-overlay">
          <button className="more-info-close" onClick={toggleMoreInfo}>
            <span>Close & resume video</span>
            <img src={closeIcon} alt="Close" />
          </button>
          <iframe src={`./assets/files/${videos[0].chapters[currentChapter].sections[popupIncrement].data}`}></iframe>
        </div>
      )
    }

    const MultiPopups = () => {
      return (
        <div className="popup-multi-overlay">
          <div className="popup-item">
            <img src={`./assets/images/${videos[0].chapters[currentChapter].sections[popupIncrement].popupContent[0].image}`} alt="Poster" className="popup-image" />
            <p className="popup-text">{videos[0].chapters[currentChapter].sections[popupIncrement].popupContent[0].title}</p>
            <button onClick={() => toggleMoreInfoMulti(0)} className="popup-button">More information</button>
          </div>
          <div className="popup-item">
            <img src={`./assets/images/${videos[0].chapters[currentChapter].sections[popupIncrement].popupContent[1].image}`} alt="Poster" className="popup-image" />
            <p className="popup-text">{videos[0].chapters[currentChapter].sections[popupIncrement].popupContent[1].title}</p>
            <button onClick={() => toggleMoreInfoMulti(1)} className="popup-button">More information</button>
          </div>
          <button onClick={resumeMulti} className="popup-resume">Continue</button>
        </div>
      )
    }

    const MoreInfoMulti = () => {
      return (
        <div className="more-info-overlay">
          <button className="more-info-close" onClick={toggleMoreInfoMulti}>
            <span>Close</span>
            <img src={closeIcon} alt="Close" />
          </button>
          <iframe src={`./assets/files/${videos[0].chapters[currentChapter].sections[popupIncrement].popupContent[popupData].data}`}></iframe>
        </div>
      )
    }

    const FaqAnswer = () => {
      return (
        <div className="faq-answer-overlay">
          <button className="faq-answer-close" onClick={toggleFaqAnswer}>
            <span>Close</span>
            <img src={closeIcon} alt="Close" />
          </button>
          {currentFaq.video == null ? <iframe src={`./assets/files/${currentFaq.document}`}></iframe> : <FaqPlayer faq={currentFaq} subtitles={faqSubtitles} />}
          {currentFaq.video == null ? null : <button onClick={toggleFaqVideoPlayback} className="faq-controls-button">
            {/* { faqVideoIsPlaying ? <img src={pauseControl} alt="Pause" /> : <img src={playControl} alt="Play" /> } */}
            <img src={playPauseControl} alt="Pause" />
          </button>}
        </div>
      )
    }

    const Faqs = () => {
      return (
        <div className="faqs-overlay">
          <h1>{videos[0].faq_name}</h1>
          <ul>
            {faqs.map((faq, index) => 
               <li key={index}><button onClick={() => loadFaq(faq)}>{faq.question}</button></li>
            )}
          </ul>
        </div>
      )
    }

    const FaqsBackground = () => {
      return (
        <div className="faqs-background">
          <div className="faqs-blur"></div>
        </div>
      )
    }

    const Controls = () => {
      return (
        <button onClick={toggleVideoPlayback} className="controls-button">
          { videoIsPlaying ? <img src={pauseControl} alt="Pause" /> : <img src={playControl} alt="Play" /> }
        </button>
      )
    }

    const videoJsOptionsSub = {
      id: "video",
      autoplay: false,
      controls: false,
      fluid: false,
      responsive: true,
      captions: true,
      sources: [
        {
          src: videos[0].video,
          type: 'application/x-mpegURL'
        }
      ],
      tracks: [
        {
          src: `./assets/data/${videos[0].subtitles}`,
          kind: "captions",
          srclang: 'en',
          label: 'English',
          default: true
        }
      ],
      userActions: {
        doubleClick: false
      },
      controlBar: {
        fullscreenToggle: false
      }
    }

    const videoJsOptions = {
      id: "video",
      autoplay: false,
      controls: false,
      fluid: false,
      responsive: true,
      captions: true,
      sources: [
        {
          src: videos[0].video,
          type: 'application/x-mpegURL'
        }
      ],
      tracks: [
        {
          src: `./assets/data/${videos[0].subtitles}`,
          kind: "captions",
          srclang: 'en',
          label: 'English',
          default: false
        }
      ],
      userActions: {
        doubleClick: false
      },
      controlBar: {
        fullscreenToggle: false
      }
    }
    
    return (
      <div className="video-group">
        { subtitlesEnabled ? <VideoPlayerSub {...videoJsOptionsSub} /> : <VideoPlayer {...videoJsOptions} /> }
        { !startVisible && !popupVisible && !multiPopupsVisible && !faqsVisible && !infoVisible && !infoMultiVisible ? <Controls /> : null }
        { blurVisible || popupVisible || multiPopupsVisible ? <Blur /> : null }
        { warningVisible ? <DeviceWarning /> : null }
        { startVisible ? <StartScreen /> : null }
        { menuVisible ? <Menu /> : null }
        { popupVisible && !faqsVisible  ? <Popup /> : null }
        { multiPopupsVisible && !faqsVisible ? <MultiPopups /> : null }
        { infoVisible ? <MoreInfo /> : null }
        { infoMultiVisible ? <MoreInfoMulti /> : null }
        { faqsVisible ? <FaqsBackground /> : null }
        { faqsVisible ? <Faqs /> : null }
        { faqAnswerVisible ? <FaqAnswer /> : null }
      </div>
    )
  }
  
  export default VideoElement;