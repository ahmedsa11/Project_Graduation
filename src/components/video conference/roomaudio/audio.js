import React, { useEffect, useRef } from 'react';
import './roomaudio.css';
const VideoCard = (props) => {
  const ref = useRef();
  const peer = props.peer;
  const img = peer.image;
  useEffect(() => {
    peer.on('stream', (stream) => {
      ref.current.srcObject = stream;
    });
    peer.on('track', (track, stream) => {});
  }, [peer]);

  return (
    <React.Fragment>
      <img src={img} alt="s" />
      <video playsInline autoPlay ref={ref}></video>
    </React.Fragment>
  );
};

export default VideoCard;
