import react from 'react';
import './chat.css';
import React, { useEffect, useState, useRef } from 'react';
import socket from '../socket';
import { Redirect } from 'react-router';
const Chat = ({ roomId }) => {
  const [msg, setMsg] = useState([]);
  const [inputImage, setinputImage] = useState('');
  const [imageSended, setimageSended] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef();

  useEffect(() => {
    socket.on('FE-receive-message', ({ msg, sender, img, inputImage }) => {
      setMsg((msgs) => [...msgs, { sender, msg, img, inputImage }]);
    });
  }, []);
  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(() => {
    scrollToBottom();
  }, [msg]);

  const tempuser = localStorage.getItem('user');

  if (tempuser === null) {
    return <Redirect to="/" />;
  }

  const user = JSON.parse(tempuser);
  const currentUser = user.name;
  const imageuser = user.image;
  // Scroll to Bottom of Message List

  const sendMessage = (e) => {
    setimageSended(true);
    const text = document.getElementById('textt');
    const msg = text.value;
    if (msg || inputImage) {
      socket.emit('BE-send-message', {
        roomId,
        msg,
        inputImage,
        sender: currentUser,
        img: imageuser,
      });
      inputRef.current.value = '';
    }
    setinputImage('');
  };

  function importData() {
    let input = document.createElement('input');

    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      setimageSended(false);
      let file = e.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setinputImage(reader.result);
      };
    };

    input.click();
  }
  const deleteImg = () => {
    setimageSended(true);
    setinputImage('');
  };
  return (
    <react.Fragment>
      <div className="chat-side" id="chat">
        <i className="fas fa-sign-out-alt"></i>
        <div className="chat">
          {msg &&
            msg.map(({ sender, msg, img, inputImage }, idx) => {
              if (sender !== currentUser) {
                return (
                  <div className="sender" key={idx}>
                    <img src={img} alt="a" />
                    <div className="text-box">
                      <strong>{sender} : </strong>
                      {inputImage !== '' && (
                        <img className="img-inbox" src={inputImage} alt="g" />
                      )}
                      <p>{msg} </p>
                    </div>
                  </div>
                );
              } else {
                return (
                  <div className="reciver" key={idx}>
                    <div className="text-box">
                      {inputImage !== '' && (
                        <img className="img-inbox" src={inputImage} alt="g" />
                      )}
                      <p>{msg} </p>
                    </div>
                  </div>
                );
              }
            })}
          <div
            style={{ float: 'left', clear: 'both' }}
            ref={messagesEndRef}
          ></div>
        </div>
        <div className="typing">
          <div className="textin">
            <div className="feat">
              <i className="fas fa-image" id="imggg" onClick={importData}></i>
            </div>
            {inputImage !== '' && !imageSended && (
              <div className="info-imagee">
                <i className="fas fa-times" onClick={deleteImg}></i>
                <img className="sended-image" src={inputImage} alt="fj" />
              </div>
            )}
            <textarea
              spellCheck="false"
              type="text"
              placeholder="Write message...."
              ref={inputRef}
              id="textt"
            ></textarea>
            <div className="send">
              <i className="fas fa-paper-plane" onClick={sendMessage}></i>
            </div>
          </div>
        </div>
      </div>
    </react.Fragment>
  );
};
export default Chat;
