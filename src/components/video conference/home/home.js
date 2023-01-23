import react from 'react';
import React from 'react';
import './home.css';
import Navbar from '../navbar/navbar';
// import { v4 as uuid } from "uuid";
import '../navbar/navbar.css';
import { Redirect } from 'react-router';
import Dailymeeting from './history';
import Header from './header.js';
import Calls from './calls';
// eslint-disable-next-line
const Home = (props) => {
  const tempuser = localStorage.getItem('user');
  if (tempuser === null) {
    return <Redirect to="/login" />;
  }

  const user = JSON.parse(tempuser);
  return (
    <react.Fragment>
      <div className="home">
        <div className="main-side">
          <Header r={props} />
          <div className="vi">
            <Navbar />
            <div className="vid-stream">
              <div className="row">
                <div className="col-lg-4">
                  <div className="chh">
                    <Calls />
                  </div>
                </div>
                <div className="col-lg-8">
                  <div className="prof">
                    <div className="pic">
                      <img src={user.image} alt="a" />
                    </div>
                    <h3>Meeting history</h3>
                    <div className="history">
                      <Dailymeeting />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </react.Fragment>
  );
};

export default Home;
