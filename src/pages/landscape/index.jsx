import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Redirect, Route, Link } from 'react-router-dom';
import Language from '../../components/language';
import Header from '../../components/header';
import Footer from '../../components/footer';
// import activityConfig from '../../../site_config/activity';
import './index.scss';

class InnerClass extends React.Component {
  pushHistory = (key, value) => {
    const { history, location } = this.props;
    history.push({
      ...location,
      search: `${key}=${value}`,
    });
  };

  replaceHistory = (key, value) => {
    const { history, location } = this.props;
    history.replace({
      ...location,
      pathname: location.pathname,
      search: `${key}=${value}`,
    });
  };

  render() {
    return (
      <div>
        <div>tab | {this.props.location.hash}</div>
        <div onClick={this.pushHistory.bind(null, 'a', 1)}>pushA</div>
        <div onClick={this.replaceHistory.bind(null, 'a', 2)}>replaceA</div>
      </div>
    );
  }
}


class Landscape extends Language {

  render() {
    const language = this.getLanguage();
    // const { barText, activities } = activityConfig[language];
    return (
      <Router>
        <div>
          <div className="landscape-page">
            <Header
              currentKey="landscape"
              type="normal"
              logo="/img/custom/logo@2x.png"
              language={language}
              onLanguageChange={this.onLanguageChange}
            />
            <div style={{ marginTop: 70 }}>
              <Link to="#rpc">Home</Link>
              <Link to="#abc">ABC</Link>
            </div>
          </div>
          <Switch>
            <Redirect from="/:lang/landscape/index.html" to="/:lang/landscape/#rpc" />
            <Route path="/:lang/landscape/" component={InnerClass} />
          </Switch>
          <Footer logo="/img/custom/logo_white@2x.png" language={language} />
        </div>
      </Router>
    );
  }
}

document.getElementById('root') && ReactDOM.render(<Landscape />, document.getElementById('root'));

export default Landscape;
