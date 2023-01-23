import React, { useState } from 'react';
import styled from 'styled-components';
import phonealt from '../../../img/index 1.png';
import tool from '../../../img/MicrosoftTeams-image8) 1.png';
import socket from '../socket';
import ScrollToBottom from 'react-scroll-to-bottom';
const BottomBar = ({
  goToBack,
  toggleCameraAudio,
  userVideoAudio,
  screenRecod,
  toggleRecording,
  text,
  toSign,
  settoSign,
  roomId,
}) => {
  const [sendNameVs, setsendNameVs] = useState('');
  socket.on('receive-text', ({ name }) => {
    setsendNameVs(name);
  });
  const opentool = () => {
    const tool = document.getElementsByClassName('to');
    for (let i = 0; i < tool.length; i++) {
      tool[0].onclick = () => {
        const sign = document.querySelector('.signlang');
        tool[0].classList.toggle('activetool');
        sign.classList.toggle('showsign');
        settoSign((signcheck) => !signcheck);
        if (toSign) {
          socket.emit('leave-sign-room', { roomId: roomId, id: 'voicetosign' });
        } else {
          socket.emit('join-sign-room', { roomId: roomId, id: 'voicetosign' });
        }
      };
      tool[1].onclick = () => {
        const caption = document.querySelector('.caption');
        const sendnameStext = document.getElementById('sendnameVtext');
        tool[1].classList.toggle('activetool');
        caption.classList.toggle('showsign');
        sendnameStext.classList.toggle('showName');
      };
    }
  };
  return (
    <React.Fragment>
      <div className="footer">
        <div className="tools">
          <div className="dropdown">
            <button className="dropbtn">
              <img src={tool} alt="tool" />
              Tools
            </button>
            <div className="dropdown-content">
              <ul>
                <li className="to" onClick={opentool}>
                  Sign Language
                </li>
                <li className="to" onClick={opentool}>
                  Caption
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="buttons">
          <div className="cp">
            <span className="sendnameVtext"id='sendnameVtext'>{sendNameVs && sendNameVs +': '} </span>
            <ScrollToBottom>
              <div className="caption lead text-center" id="textarea">
                <p className="pcap" ref={text}></p>
              </div>
            </ScrollToBottom>
          </div>
          <ul>
            <li>
              <CameraButton
                id="a"
                onClick={toggleCameraAudio}
                data-switch="audio"
              >
                {userVideoAudio.audio ? (
                  <i className="fas fa-microphone"></i>
                ) : (
                  <i className="fas fa-microphone-slash"></i>
                )}
              </CameraButton>
            </li>
            <li>
              <button onClick={goToBack} id="phonealt">
                <img src={phonealt} alt="phone" />
              </button>
            </li>
            <li>
              <button onClick={toggleRecording}>
                {screenRecod ? (
                  <i className="fas fa-stop"></i>
                ) : (
                  <i className="fas fa-record-vinyl"></i>
                )}
              </button>
            </li>
          </ul>
        </div>
      </div>
    </React.Fragment>
  );
};
const CameraButton = styled.button`
  * {
    pointer-events: none;
  }
`;
export default BottomBar;
