import React, { useEffect, useRef, useState } from 'react';
import react from 'react';
import { useReactMediaRecorder } from 'react-media-recorder';
import Peer from 'simple-peer';
import socket from '../socket';
import './roomvideo.css';
import Navbar from '../navbar/navbar';
import Chat from '../chat/chat';
import logo from '../../../img/MicrosoftTeams-image4) 1.png';
import groupicon from '../../../img/group-chatt 1.png';
import BottomBar from './BottomBar';
import VideoCard from './vid';
import { Redirect } from 'react-router';
import Loader from '../../loader/loader';
import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition';
import Signlang from './signlanguage';
import SignToText from './signtotext';
import grid1 from '../../../img/icons8-grid-50.png';
import { useStopwatch } from 'react-timer-hook';
const Copy = () => {
  var Url = document.getElementById('paste-box');
  Url.value = window.location.href;
  Url.focus();
  Url.select();
  document.execCommand('Copy');
};
const grid = () => {
  const grid6 = document.getElementById('grid6');
  const grid4 = document.getElementById('grid4');
  const grid1 = document.getElementById('grid1');
  const viditem = document.querySelectorAll('.vid-item');
  // const videoconference = document.querySelector('.video-conference');
  // if(videoconference.style.width=="100%"){
  for (let i = 0; i < viditem.length; i++) {
    grid6.onclick = () => {
      viditem[i].style.width = 'calc(100% / 4)';
      viditem[i].style.height = 'auto';
    };

    grid4.onclick = () => {
      viditem[i].style.width = 'calc(100% / 3)';
      viditem[i].style.height = 'auto';
    };
    grid1.onclick = () => {
      viditem[i].style.width = '100%';
      viditem[i].style.height = '100%';
      // vids.style.padding = '0% 0%';
      // viditem[i].style.margin = '0% 3%';
    };
  }
  // }
  // else{

  // }
};
const openchat = () => {
  const icon = document.querySelector('.fa-comment-dots');
  const iconphone = document.querySelector('.fa-sign-out-alt');
  icon.onclick = () => {
    document.querySelector('.chat-side').classList.toggle('open');
    document.querySelector('#main').classList.toggle('openmain');
    document.querySelector('.fa-comment-dots').classList.toggle('active');
  };
  iconphone.onclick = () => {
    document.querySelector('.chat-side').classList.toggle('open');
    document.querySelector('#main').classList.toggle('openmain');
    document.querySelector('.fa-comment-dots').classList.toggle('active');
  };
};
const openpopup = () => {
  let popup = document.querySelector('.popup-wrapper');
  let popupBtn = document.querySelector('.popup-open');
  let popupClose = document.querySelector('.close-btn');
  popupBtn.addEventListener('click', (e) => {
    e.preventDefault();
    showPopup();
  });

  popupClose.addEventListener('click', (e) => {
    e.preventDefault();
    removePopup();
  });

  popup.addEventListener('click', (e) => {
    let target = e.target;
    if (target.classList.contains('popup-wrapper')) {
      removePopup();
    } else return;
  });

  function showPopup() {
    popup.classList.add('active');
  }

  function removePopup() {
    popup.classList.remove('active');
  }
};
const close = () => {
  const pop = document.querySelector('.popup-wrapper2');
  pop.classList.remove('showop');
  pop.classList.add('hideop');
};
const Roomvideo = (props) => {
  const [peers, setPeers] = useState([]);
  const [toSign, settoSign] = useState(false);
  const [loading, setloading] = useState(false);
  const [signToText, setsignToText] = useState(false);
  const [signToTextCaption, setsignToTextCaption] = useState(false);
  const [userVideoAudio, setUserVideoAudio] = useState({
    localUser: { video: true, audio: true },
  });
  const [screenShare, setScreenShare] = useState(false);
  const [screenRecod, setScreenRecor] = useState(false);
  const peersRef = useRef([]);
  const userVideoRef = useRef();
  const screenTrackRef = useRef();
  const userStream = useRef();
  const roomId = props.match.params.roomvideoId;
  const tempuser = localStorage.getItem('user');
  const user = JSON.parse(tempuser);
  const audio = userVideoAudio['localUser'].audio;
  const { startRecording, stopRecording, mediaBlobUrl } = useReactMediaRecorder(
    { screen: true }
  );
  let {
    listening,
    // browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  let text = useRef();
  let senderName = useRef();
  let textsign = useRef();
  // if (!browserSupportsSpeechRecognition) {
  //   return (<span>Browser doesn't support speech recognition.</span>)
  // }
  const { seconds, minutes, hours } = useStopwatch({ autoStart: true });
  useEffect(() => {
    // Set Back Button Event
    navigator.mediaDevices.getUserMedia =
      navigator.mediaDevices.getUserMedia ||
      navigator.mediaDevices.webKitGetUserMedia ||
      navigator.mediaDevices.moxGetUserMedia ||
      navigator.mediaDevices.mozGetUserMedia ||
      navigator.mediaDevices.msGetUserMedia;
    window.addEventListener('popstate', goToBack);
    if (tempuser === null) {
      return <Redirect to="/login" />;
    }
    // setloading(true);
    // Connect Camera & Mic
    setloading(true);

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setloading(false);
        userVideoRef.current.srcObject = stream;
        userStream.current = stream;
        socket.emit('BE-join-room', {
          roomId,
          user,
          video: true,
          audio: true,
          typeMeet: 'video',
        });

        socket.on('FE-user-join', ({ userId, info }) => {
          // all users
          let { user: newUser, video, audio } = info;

          const peer = createPeer(userId, socket.id, stream);
          peer.userName = newUser.name;
          peer.peerID = userId;

          peersRef.current.push({
            peerID: userId,
            peer,
            userName: newUser.name,
            audio,
          });

          setUserVideoAudio((preList) => {
            return {
              ...preList,
              [peer.userName]: { video, audio },
            };
          });
          setPeers((users) => {
            return [...users, peer];
          });
        });

        socket.on('FE-receive-call', ({ signal, from, info }) => {
          let { user: newUser, video, audio } = info;
          const peerIdx = findPeer(from);

          if (!peerIdx) {
            const peer = addPeer(signal, from, stream);

            peer.userName = newUser.name;
            peer.peerID = from;

            peersRef.current.push({
              peerID: from,
              peer,
              userName: newUser.name,
              audio,
            });

            setPeers((users) => {
              return [...users, peer];
            });
            setUserVideoAudio((preList) => {
              return {
                ...preList,
                [peer.userName]: { video, audio },
              };
            });
          }
        });

        socket.on('FE-call-accepted', ({ signal, answerId }) => {
          const peerIdx = findPeer(answerId);
          peerIdx.peer.signal(signal);
        });

        socket.on('FE-user-leave', ({ userId }) => {
          const peerIdx = findPeer(userId);
          if (peerIdx) {
            peerIdx.peer.destroy();
            peersRef.current = peersRef.current.filter(
              ({ peerID }) => peerID !== userId
            );

            setPeers((users) => {
              users = users.filter((user) => user.peerID !== userId);
              return [...users];
            });
          }
        });
      })
      .catch((error) => {
        setloading(false);
        // alert(error)
        alert('Sorry, getUserMedia is not supported ');
      });

    socket.on('FE-toggle-camera', ({ userId, switchTarget }) => {
      const peerIdx = findPeer(userId);
      setUserVideoAudio((preList) => {
        let video = preList[peerIdx.userName].video;
        let audio = preList[peerIdx.userName].audio;

        if (switchTarget === 'video') {
          video = !video;
        } else {
          audio = !audio;
          peerIdx.audio = audio;
        }

        return {
          ...preList,
          [peerIdx.userName]: { video, audio },
        };
      });
    });

    return () => {
      socket.disconnect();
    };
    // eslint-disable-next-line
  }, []);
  //voice to sign
  useEffect(() => {
    if (audio) {
      SpeechRecognition.startListening({
        language: 'en-US',
        continuous: false,
      });
    } else {
      SpeechRecognition.stopListening();
    }
    
    // eslint-disable-next-line
  }, [listening, audio]);
  function createPeer(userId, caller, stream) {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });
    peer.on('signal', (signal) => {
      socket.emit('BE-call-user', {
        userToCall: userId,
        from: caller,
        signal,
      });
    });
    peer.on('disconnect', () => {
      peer.destroy();
    });

    return peer;
  }
  function addPeer(incomingSignal, callerId, stream) {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });

    peer.on('signal', (signal) => {
      socket.emit('BE-accept-call', { signal, to: callerId });
    });

    peer.on('disconnect', () => {
      peer.destroy();
    });

    peer.signal(incomingSignal);

    return peer;
  }

  function findPeer(id) {
    return peersRef.current.find((p) => p.peerID === id);
  }
  function createUserVideo(peer, index, arr) {
    return (
      <div className="vid-item" key={index} onClick={expandScreen}>
        {/* <i className="fas fa-expand" ></i> */}
        <VideoCard key={index} peer={peer} number={arr.length} />

        <div className="icon">
          {findPeer(peer.peerID).audio ? (
            <i className="fas fa-microphone"></i>
          ) : (
            <i className="fas fa-microphone-slash"></i>
          )}
        </div>
        <span className="name">{peer.userName}</span>
      </div>
    );
  }
  function createUseroption(peer, index, arr) {

    return (
      <option disabled key={index}>
        {peer.userName}
      </option>
    );
  }
  // BackButton
  const goToBack = (e) => {
    e.preventDefault();
    // socket.emit('BE-leave-room', { roomId });
    window.location.href = '/home';
  };
  const toggleCameraAudio = (e) => {
    const target = e.target.getAttribute('data-switch');
    setUserVideoAudio((preList) => {
      let videoSwitch = preList['localUser'].video;
      let audioSwitch = preList['localUser'].audio;

      if (target === 'video') {
        const userVideoTrack =
          userVideoRef.current.srcObject.getVideoTracks()[0];
        videoSwitch = !videoSwitch;
        userVideoTrack.enabled = videoSwitch;
      } else {
        const userAudioTrack =
          userVideoRef.current.srcObject.getAudioTracks()[0];
        audioSwitch = !audioSwitch;
        userAudioTrack.enabled = audioSwitch;
      }

      return {
        ...preList,
        localUser: { video: videoSwitch, audio: audioSwitch },
      };
    });

    socket.emit('BE-toggle-camera-audio', {
      roomId,
      switchTarget: target,
    });
  };
  const clickScreenSharing = () => {
    if (!screenShare) {
      navigator.mediaDevices
        .getDisplayMedia({ cursor: true })
        .then((stream) => {
          const screenTrack = stream.getTracks()[0];

          peersRef.current.forEach(({ peer }) => {
            // replaceTrack (oldTrack, newTrack, oldStream);
            peer.replaceTrack(
              peer.streams[0]
                .getTracks()
                .find((track) => track.kind === 'video'),
              screenTrack,
              userStream.current
            );
          });
          // Listen click end
          screenTrack.onended = () => {
            peersRef.current.forEach(({ peer }) => {
              peer.replaceTrack(
                screenTrack,
                peer.streams[0]
                  .getTracks()
                  .find((track) => track.kind === 'video'),
                userStream.current
              );
            });
            userVideoRef.current.srcObject = userStream.current;
            setScreenShare(false);
          };
          userVideoRef.current.srcObject = stream;
          screenTrackRef.current = screenTrack;
          setScreenShare(true);
        });
    } else {
      screenTrackRef.current.onended();
    }
  };
  const expandScreen = (e) => {
    const watchvid =e.target
    if (watchvid.requestFullscreen) {
      watchvid.requestFullscreen({navigationUI: 'hide'});
    } else if (watchvid.mozRequestFullScreen) {
      /* Firefox */
      watchvid.mozRequestFullScreen({navigationUI: 'hide'});
    } else if (watchvid.webkitRequestFullscreen) {
      /* Chrome, Safari & Opera */
      watchvid.webkitRequestFullscreen({navigationUI: 'hide'});
    } else if (watchvid.msRequestFullscreen) {
      /* IE/Edge */
      watchvid.msRequestFullscreen({navigationUI: 'hide'});
    }
  };
  const toggleRecording = () => {
    setScreenRecor((checkrec) => !checkrec);
  };
  useEffect(() => {
    if (screenRecod) {
      startRecording();
      document.querySelector('.rec-time').style.border = '2px solid red';
      document.getElementById('dottt').style.display = 'block';
    }
    if (!screenRecod) {
      stopRecording();
    }
    // eslint-disable-next-line
  }, [screenRecod]);
  useEffect(() => {
    if (!mediaBlobUrl) return;
    document.getElementById('pop').classList.add('showop');
    document.querySelector('.rec-time').style.border = '2px solid #b9bec2';
    document.getElementById('dottt').style.display = 'none';
    setScreenRecor(false);
  }, [mediaBlobUrl]);
  if (tempuser === null) {
    return <Redirect to="/login" />;
  }
  return (
    <react.Fragment>
      {loading ? <Loader /> : null}

      <div className="roomvideo">
        <div className="video-conference">
          <div className="main-side" id="main">
            <div className="screen-record">
              <div id="pop" className="popup-wrapper2">
                <button className="close-btn2" onClick={close}>
                  <i className="fas fa-times"></i>
                </button>
                <video src={mediaBlobUrl} controls autoPlay />
              </div>
            </div>
            <div className="navbar">
              <div className="logo">
                <img src={logo} alt="logo" />
              </div>
              <div className="title">
                <h4>{roomId.split('+')[1] || 'Unnamed'}</h4>
              </div>
              <div className="grid-show">
                <ul>
                  <li id="grid1" onClick={grid}>
                    <img src={grid1} alt="f" />
                  </li>
                  <li id="grid6" onClick={grid}>
                    <i className="fas fa-th"></i>
                  </li>
                  <li id="grid4" onClick={grid}>
                    <i className="fas fa-th-large"></i>
                  </li>
                  <li>
                    <i className="fas fa-comment-dots" onClick={openchat}></i>
                  </li>
                  <li>
                    <img id="imgp" src={user.image} alt="a" />
                  </li>
                </ul>
              </div>
            </div>
            <div className="vi">
              <Navbar />
              <div className="vid-stream">
                <div className="opts">
                  <img src={groupicon} alt="group" />
                  <select className="nump">
                    <option defaultValue hidden>
                      {peers.length + 1}
                    </option>
                    <option disabled>{user.name}</option>
                    {peers &&
                      peers.map((peer, index, arr) => {
                        return createUseroption(peer, index, arr);
                      })}
                  </select>
                  <div className="invite">
                    <i
                      className="fas fa-users popup-open"
                      onClick={openpopup}
                    ></i>
                    Invite a participant
                    <div className="popup-wrapper">
                      <div className="popup">
                        <button className="close-btn">
                          <i className="fas fa-times"></i>
                        </button>
                        <div className="copy">
                          <input type="text" id="paste-box" />
                          <button onClick={Copy}>Copy Link</button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="rec-time">
                    <span id="dottt"></span>
                    <span>{hours}</span>:<span>{minutes}</span>:
                    <span>{seconds}</span>
                  </div>
                </div>
                <div className="vids">
                  <div className="stream vid-item signlang">
                    <Signlang
                      toSign={toSign}
                      roomId={roomId}
                      user={user}
                      text={text}
                      senderName={senderName}
                    />
                    <span className="name" ref={senderName}></span>
                  </div>
                  <div className="vid-item">
                    <div>
                      {/* <i className="fas fa-expand"></i> */}
                      <video
                        onClick={expandScreen}
                        ref={userVideoRef}
                        muted
                        autoPlay
                        playsInline
                      ></video>
                      <SignToText
                        signToTextCaption={signToTextCaption}
                        roomId={roomId}
                        textsign={textsign}
                        signToText={signToText}
                        audio={audio}
                        user={user}
                        userVideoAudio={userVideoAudio['localUser']}
                      />
                    </div>
                    <div className="icon">
                      {userVideoAudio['localUser'].audio ? (
                        <i className="fas fa-microphone"></i>
                      ) : (
                        <i className="fas fa-microphone-slash"></i>
                      )}
                    </div>
                    <span className="name">{user.name}</span>
                  </div>
                  {peers &&
                    peers.map((peer, index, arr) => {
                      return createUserVideo(peer, index, arr);
                    })}
                </div>
              </div>
            </div>
            <BottomBar
              clickScreenSharing={clickScreenSharing}
              goToBack={goToBack}
              toggleCameraAudio={toggleCameraAudio}
              userVideoAudio={userVideoAudio['localUser']}
              screenShare={screenShare}
              text={text}
              toSign={toSign}
              signToText={signToText}
              setsignToText={setsignToText}
              settoSign={settoSign}
              senderName={senderName}
              toggleRecording={toggleRecording}
              screenRecod={screenRecod}
              textsign={textsign}
              roomId={roomId}
              setsignToTextCaption={setsignToTextCaption}
            />
          </div>
          <Chat roomId={roomId} />
        </div>
      </div>
    </react.Fragment>
  );
};

export default Roomvideo;
