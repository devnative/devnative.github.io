import React from 'react';
import ReactDOM from 'react-dom';
import { getScrollTop, getLink } from '../../../utils';
import Header from '../../components/header';
import Button from '../../components/button';
import Footer from '../../components/footer';
import Language from '../../components/language';
import Item from './featureItem';
import homeConfig from '../../../site_config/home';
import './index.scss';

class Home extends Language {

  constructor(props) {
    super(props);
    this.state = {
      headerType: 'primary',
    };
  }

  componentDidMount() {
    window.addEventListener('scroll', () => {
      const scrollTop = getScrollTop();
      if (scrollTop > 66) {
        this.setState({
          headerType: 'normal',
        });
      } else {
        this.setState({
          headerType: 'primary',
        });
      }
    });
  }

  render() {
    const language = this.getLanguage();
    const { brand, landscape, evaluation} = homeConfig[language];
    const { headerType } = this.state;
    const headerLogo = headerType === 'primary' ? '/img/_logo_white.png' : '/img/_logo_colorful.png';
    return (
      <div className="home-page">
        <section className="top-section">
          <Header
            currentKey="home"
            type={headerType}
            logo={headerLogo}
            language={language}
            onLanguageChange={this.onLanguageChange}
          />
          <div className="vertical-middle">
            <div className="product-name">
              <h2>{brand.brandName}</h2>
            </div>
            <p className="product-desc">{brand.briefIntroduction}</p>
          </div>
          <div className="animation animation1" />
          <div className="animation animation2" />
          <div className="animation animation3" />
          <div className="animation animation4" />
          <div className="animation animation5" />
        </section>
        <section className="introduction-section">
          <div className="introduction-body">
            <img src={getLink(landscape.img)} />
            <div className="introduction">
              <h3>{landscape.title}</h3>
              <p>{landscape.desc}</p>
              <Button customClass="primary" type={landscape.button.type} link={landscape.button.link} target={landscape.button.target}>{landscape.button.text}</Button>
            </div>
          </div>
        </section>
        <section className="introduction-section">
          <div className="introduction-body background-gray">
            <div className="introduction">
              <h3>{evaluation.title}</h3>
              <p>{evaluation.desc}</p>
              <Button customClass="normal" type={evaluation.button.type} link={evaluation.button.link} target={evaluation.button.target}>{evaluation.button.text}</Button>
            </div>
            <img src={getLink(evaluation.img)} />
          </div>
        </section>
        <Footer logo="/img/_logo_gray.png" language={language} />
      </div>
    );
  }
}

document.getElementById('root') && ReactDOM.render(<Home />, document.getElementById('root'));

export default Home;
