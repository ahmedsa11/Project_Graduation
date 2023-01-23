import react, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router';
import './App.css';
import NOT from './components/notfound';
import Form from './components/form/form';
import Home from './components/video conference/home/home';
import Setting from './components/setting/setting';
import Calendarr from './components/calendar/calendar';
import Roomvideo from './components/video conference/roomvideo/roomvideo';
import Roomaudio from './components/video conference/roomaudio/roomaudio';
import LandingPage from './components/Landingpage/Landingpage';
import Forget from './components/forgetpass/forgetpass';
class App extends Component {
  render() {
    return (
      <react.Fragment>
        <Switch>
          <Route exact path="/" component={LandingPage} />
          <Route path="/login" component={Form} />
          <Route path="/home" component={Home} />
          <Route path="/forget" component={Forget} />
          <Route path="/setting" component={Setting} />
          <Route path="/calendar" component={Calendarr} />
          <Route path="/roomvideo/:roomvideoId" component={Roomvideo} />
          <Route path="/roomaudio/:roomaudioId" component={Roomaudio} />
          <Route path="/notfound" component={NOT} />
          <Redirect to="/notfound" />
        </Switch>
      </react.Fragment>
    );
  }
}
export default App;
