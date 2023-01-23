import React, { useEffect, useRef } from 'react';
import './roomvideo.css';
const VideoCard = (props) => {
  const ref = useRef();
  const peer = props.peer;
  useEffect(() => {
    peer.on('stream', (stream) => {
      ref.current.srcObject = stream;
    });
    peer.on('track', (track, stream) => {});
  }, [peer]);

  return (
    <React.Fragment>
      <video playsInline autoPlay ref={ref}></video>
    </React.Fragment>
  );
};

export default VideoCard;
