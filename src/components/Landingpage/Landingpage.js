import react, { useEffect } from 'react';
import './landingpage.css';
import logo from '../../img/loooo.png';
import iconchat from '../../img/MicrosoftTeams-imag (17) 1.png';
import iconvid from '../../img/icons8-laptop-play-video-24.png';
import iconshare from '../../img/icons8-share-3-32.png';
import iconcall from '../../img/icons8-ringer-volume-32.png';
import iconrecord from '../../img/icons8-music-record-32.png';
import icontrans from '../../img/icons8-closed-captioning-32.png';
import googleplay from '../../img/googleplay.png';
import WOW from 'wowjs';
import imgapp from '../../img/image 28.png';
import group from '../../img/Group 1738.png';
import member1 from '../../img/salama.jpg';
import member2 from '../../img/osama.jpg';
import member3 from '../../img/rania.jpg';
import member4 from '../../img/rawan.jpg';
import member5 from '../../img/tabarani.jpg';
import member6 from '../../img/hassib.jpg';
import member7 from '../../img/heba.jpg';
import member8 from '../../img/menna.jpg';
import landimg from '../../img/la.png';
import l1 from '../../img/l1.jpg';
import l2 from '../../img/l2.jpg';
import l3 from '../../img/l3.jpg';
import { useHistory } from 'react-router';
const LandingPage = () => {
  let tempuser = localStorage.getItem('user');
  let user = JSON.parse(tempuser);
  const history = useHistory();
  const login = () => {
    history.push('/login');
  };
  const gohome = () => {
    history.push('/home');
  };
  const activeLink = () => {
    const link = document.querySelectorAll('.land a');
    link.forEach((act) => {
      act.addEventListener('click', function () {
        link.forEach((btn) => btn.classList.remove('activelink'));
        this.classList.add('activelink');
      });
    });
  };
  useEffect(() => {
    activeLink(); 
      new WOW.WOW({
        live: false
      }).init();
  }, []);
  return (
    <react.Fragment>
      <div className="landing">
        <div className="land" id="home">
          <div className="navbarr">
            <img src={logo} alt="logo" />
            <ul className="ulnav">
              <li>
                <a className="activelink" href="#home">
                  Home
                </a>
              </li>
              <li>
                <a href="#service">Service</a>
              </li>
              <li>
                <a href="#about">About Us</a>
              </li>
            </ul>
            {tempuser ? (
              <div className="profileandname">
                {' '}
                <img
                  className="profilee"
                  src={user.image}
                  onClick={gohome}
                  alt="profile"
                />
                <span onClick={gohome}>{user.name}</span>
              </div>
            ) : (
              <button onClick={login}>Login</button>
            )}
          </div>
          <div className="intro">
            <div className="textintro">
              <h2 className='wow fadeInUp'  data-wow-duration="1.5s">
                Social communication system for the signer and <br /> non-signer
                people{' '}
              </h2>
              <ul>
                <li className='wow fadeInUp'  data-wow-duration="2s">Sign language to text </li>
                <li className='wow fadeInUp'  data-wow-duration="2.5s">Speech to text </li>
                <li className='wow fadeInUp'  data-wow-duration="3s">Speech to sign language </li>
                <li className='wow fadeInUp'  data-wow-duration="3.5s">video communication </li>
              </ul>
            </div>
            <div className="imgintro">
              <img src={landimg} alt="land" />
            </div>
          </div>
        </div>
        <div className="feature" id="service">
          <h1>Check Out All Feature</h1>
          <div className="colorbar1"></div>
          <div className="contfeat">
            <div className="row">
              <div className="col-lg-4 col-sm-6">
                <div className="featuericon">
                  <img src={iconchat} alt="icon8" />
                  <h3>Chat</h3>
                </div>
              </div>
              <div className="col-lg-4 col-sm-6">
                <div className="featuericon">
                  <img src={icontrans} alt="icon8" />
                  <h3>Caption</h3>
                </div>
              </div>
              <div className="col-lg-4 col-sm-6">
                <div className="featuericon">
                  <img src={iconvid} alt="icon8" />
                  <h3>Video Conference</h3>
                </div>
              </div>
              <div className="col-lg-4 col-sm-6">
                <div className="featuericon">
                  <img src={iconshare} alt="icon8" />
                  <h3>Screen Share</h3>
                </div>
              </div>
              <div className="col-lg-4 col-sm-6">
                <div className="featuericon">
                  <img src={iconcall} alt="icon8" />
                  <h3>Call</h3>
                </div>
              </div>
              <div className="col-lg-4 col-sm-6">
                <div className="featuericon">
                  <img src={iconrecord} alt="icon8" />
                  <h3>Recording</h3>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="about">
          <div className="abouttext">
            <h2>
              Fast, Reliable,And Service <br /> Video Conferencing
            </h2>
            <p>
              Connect app is an extremely secure, high-end video conferencing
              tool. And since it's a browser-based platform, it's incredibly
              simple to use all you need is a link to join a call or event - so
              great for meetings on the fly
            </p>
          </div>
          <div className="aboutimg">
            <img src={l1} alt="aa" />
          </div>
        </div>
        <div className="about">
          <div className="abouttext">
            <h2>
              Work And Study From <br /> Anywhere
            </h2>
            <p>
              Connect app allows you to Work and Study from anywhere. The
              ability to deliver projects remotely with video conferencing plays
              a huge part in the workforce success while creating a culture that
              supports work-life balance
            </p>
          </div>
          <div className="aboutimg">
            <img src={l2} alt="aa" />
          </div>
        </div>
        <div className="about">
          <div className="abouttext">
            <h2>
              Control Your Most <br /> Valuable Time{' '}
            </h2>
            <p>
              {' '}
              Connect app allows you to control your time. A conference host can
              ensure an effective virtual meeting -one that happens in a
              well-planned, controlled setting. which can reduce logistics costs
              of travel and accommodations
            </p>
          </div>
          <div className="aboutimg">
            <img src={l3} alt="aa" />
          </div>
        </div>
        <div className="work" id="how">
          <h1>How does it work</h1>
          <div className="colorbar1"></div>
          <div className="contwork">
            <div className="row">
              <div className="col-lg-4 col-md-6 ">
                <div className="workicon">
                  <div className="infoo">
                    <img src={group} alt="logo" />
                    <h3>ASL Signer</h3>
                    <p> deaf person signing during the video call</p>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-6">
                <div className="cardd">
                  <div className="workicon mainn">
                    <div className="infoo">
                      <img src={logo} alt="logo" />
                      <h3>Connect</h3>
                      <p>
                        {' '}
                        -transfer from ASL to text in real-time <br />
                        -Transcribes from speech to text <br />
                        -Provides video communication
                      </p>
                    </div>
                  </div>
                  <div className="ly"></div>
                </div>
              </div>
              <div className="col-lg-4 col-md-6">
                <div className="workicon">
                  <div className="infoo">
                    <img src={group} alt="logo" />
                    <h3>Speaker</h3>
                    <p>Speaker Hearing person speaking during the video call</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="ourteam" id="about">
          <h1>Meet Our Team</h1>
          <div className="colorbar1"></div>
          <div className="contour">
            <div className="row">
              <div className="col-lg-3 col-md-6">
                <div className="ourteaminfo">
                  <div className="im">
                    <img src={member2} alt="icon8" />
                  </div>
                  <h3>Mohamed Osama</h3>
                  <span>Cloud DevOps</span>
                </div>
              </div>
              <div className="col-lg-3 col-md-6">
                <div className="ourteaminfo">
                  <div className="im">
                    <img src={member6} alt="icon8" />
                  </div>
                  <h3>Mohamed Hassib</h3>
                  <span>Machine Learning</span>
                </div>
              </div>
              <div className="col-lg-3 col-md-6">
                <div className="ourteaminfo">
                  <div className="im">
                    <img src={member1} alt="icon8" />
                  </div>
                  <h3>Ahmed Salama</h3>
                  <span>Frontend Developer</span>
                </div>
              </div>
              <div className="col-lg-3 col-md-6">
                <div className="ourteaminfo">
                  <div className="im">
                    <img src={member5} alt="icon8" />
                  </div>
                  <h3>Ahmed Mostafa</h3>
                  <span>Backend Developer</span>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-3 col-md-6">
                <div className="ourteaminfo">
                  <div className="im">
                    <img src={member4} alt="icon8" />
                  </div>
                  <h3>Rawan Emad</h3>
                  <span>Android Developer</span>
                </div>
              </div>
              <div className="col-lg-3 col-md-6">
                <div className="ourteaminfo">
                  <div className="im">
                    <img src={member3} alt="icon8" />
                  </div>
                  <h3>Rania Khaled</h3>
                  <span>Android Developer</span>
                </div>
              </div>
              <div className="col-lg-3 col-md-6">
                <div className="ourteaminfo">
                  <div className="im">
                    <img src={member8} alt="icon8" />
                  </div>
                  <h3>Mennat Allah Kamal</h3>
                  <span>UI/UX Designer</span>
                </div>
              </div>
              <div className="col-lg-3 col-md-6">
                <div className="ourteaminfo">
                  <div className="im">
                    <img src={member7} alt="icon8" />
                  </div>
                  <h3>Heba Elsaid</h3>
                  <span>Backend Developer</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="android">
          <div className="imgapp wow fadeInLeft"     data-wow-duration="1.5s"
                data-wow-offset="100">
            <img src={imgapp} alt="app" />
          </div>
          <div className="textapp wow fadeInRight"     data-wow-duration="1.5s"
                data-wow-offset="100">
            <div className="textcontent">
              <h3>Download our app </h3>
              <h1>
                Get Connect App
                <br /> More Easily
              </h1>
              <p>
              stay connected with people from your android phone
              </p>
              <img src={googleplay} alt="googleplay" />
            </div>
          </div>
        </div>

        <div className="footer">
          <div className="container">
            <div className="row">
              <div className="col-md-6">
                <h2>
                  <img src={logo} alt="as" /> Connect
                </h2>
                <a href="#facebook">
                  <i className="fab fa-facebook"></i>
                </a>
                <a href="#twitter">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#linkedin">
                  <i className="fab fa-linkedin-in"></i>
                </a>
              </div>
              <div className="col-md-6">
                <ul>
                  <li>
                    <a href="#home">
                      <i className="fas fa-chevron-right"></i>Home
                    </a>
                  </li>
                  <li>
                    <a href="#service">
                      <i className="fas fa-chevron-right"></i>Service
                    </a>
                  </li>
                  <li>
                    <a href="#how">
                      <i className="fas fa-chevron-right"></i>How does it work
                    </a>
                  </li>
                  <li>
                    <a href="#about">
                      <i className="fas fa-chevron-right"></i>About Us
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </react.Fragment>
  );
};

export default LandingPage;
