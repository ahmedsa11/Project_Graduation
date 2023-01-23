import react, { useState } from 'react';
import { Redirect, useHistory } from 'react-router';
import Header from '../video conference/home/header';
import Navbar from '../video conference/navbar/navbar';
import logoutimg from '../../img/logout.png';
import { Calendar } from 'react-calendar';
import './calendar.css';
import 'react-calendar/dist/Calendar.css';
const Calendarr = (props) => {
  const [value, onChange] = useState(new Date());
  const tempuser = localStorage.getItem('user');
  const logou = useHistory();
  //   let user = JSON.parse(tempuser);
  if (tempuser === null) {
    return <Redirect to="/login" />;
  }

  const logout = () => {
    window.localStorage.removeItem('user');
    logou.push('/');
  };
  return (
    <react.Fragment>
      <div className="calendar">
        <div className="main-side">
          <Header r={props} />
          <div className="vi">
            <Navbar />
            <div className="vid-stream">
              <h2>Calendar</h2>
              <div className="cal">
                <Calendar onChange={onChange} value={value} />
                <img
                  className="logout"
                  src={logoutimg}
                  alt="a"
                  onClick={logout}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </react.Fragment>
  );
};

export default Calendarr;
