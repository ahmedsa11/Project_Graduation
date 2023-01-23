import react, { useEffect, useState } from 'react';
import './history.css';
import { useHistory } from 'react-router';
import socket from '../socket';
const Dailymeeting = () => {
  const tempuser = localStorage.getItem('user');
  const user = JSON.parse(tempuser);

  const [meets, setMeets] = useState([]);
  let history = useHistory();
  function reJoin(id, typeMeet) {
    history.push(`/room${typeMeet}/${id}`);
  }
  useEffect(() => {
  
    setMeets([]);
    socket.emit('get-rooms-user', { mobile: user.mobile });
    socket.on('get-rooms-user', ({ userRooms }) => {
      userRooms.slice(-3).forEach((roomId) => {
        socket.emit('get-all-users', { roomId });
      });
    });
    socket.on('get-all-users', ({ users, roomId, typeMeet }) => {
      setMeets((prev) => [
        ...prev,
        {
          users: users.slice(-3),
          userLength: users.length - users.slice(-3).length,
          typeMeet,
          roomId,
          roomName: roomId.split('+')[1] || 'Unnamed',
        },

      ]);
    });
    return () => {
      socket.off('get-all-users');
      socket.off('get-rooms-user');
    }
    // eslint-disable-next-line
  }, []);
  return (
    <react.Fragment>
      {meets.map((meet) => (
        <div key={meet.roomId} className="dailymeeting">
          {/* <i className="fas fa-times" onClick={()=>remove(meet.roomId)}></i> */}
          <h4>{meet.roomName}</h4>
          <react.Fragment>
            <ul>
              {meet.users.map((user) => (
                <li key={user.mobile}>{user.name}</li>
              ))}
            </ul>
            <div className="im">
              {meet.users.map((user) => (
                <img key={user.mobile} src={user.image} alt="a" />
              ))}
            </div>
          </react.Fragment>
          {meet.userLength === 0 ? '' : <span> +{meet.userLength}</span>}
          <button
            className="rejoin"
            onClick={() => reJoin(meet.roomId, meet.typeMeet)}
          >
            rejoin
          </button>
        </div>
      ))}
    </react.Fragment>
  );
};
export default Dailymeeting;
