import react, { Component } from 'react';
import './verification.css';
import { Redirect } from 'react-router';
import verify from '../../img/vecteezy_identity-biometric-verification_ 1.png';
import authentication from '../firebase';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import Loader from '../loader/loader';
import NewPassword from '../forgetpass/password';
import { Api } from '../api/api';
// import firebase from "../firebase";
class Verification extends Component {
  state = {
    error: {},
    num1: '',
    num2: '',
    num3: '',
    num4: '',
    num5: '',
    num6: '',
    mobile: this.props.phone,
    code: '',
    username: this.props.username,
    pass: this.props.pass,
    gender: this.props.gender,
    very: '',
    setUpRecaptcha: this.props.set,
    loading: false,
    direct: this.props.direct,
  };
  header = {
    API_KEY: process.env.REACT_APP_API_KEY,
    'Content-Type': 'application/json',
  };
  nextotp = () => {
    const otp = document.querySelectorAll('.otp');
    for (let i = 0; i < otp.length - 1; i++) {
      otp[i].addEventListener('keyup', function () {
        this.nextElementSibling.focus();
      });
    }
  };

  setUpRecaptcha = () => {
    window.recaptchaVerifier = new RecaptchaVerifier(
      'recap',
      {
        size: 'invisible',
        callback: (response) => {},
      },
      authentication
    );
  };
  sendagain = () => {
    this.setState({ loading: true });
    this.setUpRecaptcha();
    const phoneNumber = '+' + this.state.mobile;
    const appVerifier = window.recaptchaVerifier;
    signInWithPhoneNumber(authentication, phoneNumber, appVerifier)
      .then((confirmationResult) => {
        this.setState({ loading: false });
        window.confirmationResult = confirmationResult;
      })
      .catch((error) => {
        this.setState({ loading: false });
      });
  };
  update = async () => {
    let tempuser = localStorage.getItem('user');
    let user = JSON.parse(tempuser);
    let data2 = await fetch(`${Api}/${user.mobile}`, {
      headers: this.header,
      method: 'PATCH',
      body: JSON.stringify({
        mobile: this.state.mobile,
      }),
    });
    let res2 = await data2.json();
    if (res2.status === 'success') {
      localStorage.setItem('user', JSON.stringify(res2.data));
      this.setState({
        very: 'updated',
      });
    }
  };

  signup = async () => {
    let data2 = await fetch(`${Api}/`, {
      headers: this.header,
      method: 'POST',
      body: JSON.stringify({
        name: this.state.username,
        mobile: this.state.mobile,
        password: this.state.pass,
        gender: this.state.gender,
      }),
    });
    let res2 = await data2.json();
    if (res2.status === 'success') {
      localStorage.setItem('user', JSON.stringify(res2.data));
      this.setState({
        very: 'verified',
      });
    }
  };
  forget = async () => {
    this.setState({
      very: 'updatedpass',
    });
  };
  handlesubotp = async (e) => {
    e.preventDefault();
    // const error = this.validsignup();
    // if (error) return;
    //back end
    const code =
      this.state.num1 +
      this.state.num2 +
      this.state.num3 +
      this.state.num4 +
      this.state.num5 +
      this.state.num6;
    window.confirmationResult
      .confirm(code)
      .then(async (result) => {
        // User signed in successfully.

        if (this.state.direct === 'signup') {
          await this.signup();
        } else if (this.state.direct === 'updated') {
          await this.update();
        } else if (this.state.direct === 'forget') {
          await this.forget();
        }
        // ...
      })
      .catch((error) => {
        // User couldn't sign in (bad verification code?)
        // ...
        alert('bad verification code');
      });
  };

  handlechangesignup = (e) => {
    let state = { ...this.state };
    state[e.currentTarget.name] = e.currentTarget.value;
    this.setState(state);
  };
  componentDidMount() {
    this.nextotp();
  }
  render() {
    if (this.state.very === 'verified') {
      return (
        <react.Fragment>
          <Redirect to="/home" />
        </react.Fragment>
      );
    }
    if (this.state.very === 'updated') {
      return (
        <react.Fragment>
          <Redirect to="/home" />
        </react.Fragment>
      );
    }
    if (this.state.very === 'updatedpass') {
      return <NewPassword Phone={this.state.mobile} />;
    }
    return (
      <react.Fragment>
        {this.state.loading ? <Loader /> : null}
        <div id="recap"></div>
        <div className="verification">
          <div className="about-us">
            <div className="info-box">
              <h2>Enter verification code</h2>
              <p> We have sent the Verification code to </p>{' '}
              <p className="mobile">{this.state.mobile}</p>
              <form onSubmit={this.handlesubotp}>
                <div className="code">
                  <input
                    className="otp"
                    required
                    type="text"
                    name="num1"
                    onChange={this.handlechangesignup}
                    maxLength={1}
                  />
                  <input
                    className="otp"
                    required
                    type="text"
                    name="num2"
                    onChange={this.handlechangesignup}
                    maxLength={1}
                  />
                  <input
                    className="otp"
                    required
                    type="text"
                    name="num3"
                    onChange={this.handlechangesignup}
                    maxLength={1}
                  />
                  <input
                    className="otp"
                    required
                    type="text"
                    name="num4"
                    onChange={this.handlechangesignup}
                    maxLength={1}
                  />
                  <input
                    className="otp"
                    required
                    type="text"
                    name="num5"
                    onChange={this.handlechangesignup}
                    maxLength={1}
                  />
                  <input
                    className="otp"
                    required
                    type="text"
                    name="num6"
                    onChange={this.handlechangesignup}
                    maxLength={1}
                  />
                </div>
                <span onClick={this.sendagain}>send the code again</span>
                <button type="submit">Verify</button>
              </form>
            </div>
            <div className="image-box">
              <img src={verify} alt="verification" />
            </div>
          </div>
        </div>
      </react.Fragment>
    );
  }
}
export default Verification;
