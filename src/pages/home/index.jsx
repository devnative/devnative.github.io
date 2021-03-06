import React from 'react';
import ReactDOM from 'react-dom';
import { getScrollTop, getLink } from '../../../utils';
import Header from '../../components/header';
import Button from '../../components/button';
import Footer from '../../components/footer';
import Language from '../../components/language';
import Slider from '../../components/slider';
import Icon from '../../components/icon';
import EventCard from '../../pages/community/eventCard';
import homeConfig from '../../../site_config/home';
import communityConfig from '../../../site_config/community';
import activityConfig from '../../../site_config/activity';
import './index.scss';

const sliceArray = (arr = [], end = 6) => {
  if (!Array.isArray(arr) || arr.length === 0) {
    return [];
  }
  if (isNaN(end)) {
    end = 6;
  }
  let len = arr.length;
  len = len < end ? len : end;
  return arr.slice(0, len);
};

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
    const { brand, landscape, evaluation, news, acts } = homeConfig[language];
    const { events } = communityConfig[language];
    const eventList = sliceArray(events.list, 6);
    const { activities } = activityConfig[language];
    const actList = sliceArray(activities.list, 6);
    const { headerType } = this.state;
    const headerLogo = headerType === 'primary' ? '/img/custom/logo_white@2x.png' : '/img/custom/logo@2x.png';
    return (
      <div className="home-page">
        <section className="top-section">
          <img src="/img/custom/bg_banner@2x.png" />
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
        </section>
        <section className="introduction-section">
          <div className="introduction-body">
            <img src={getLink(landscape.img)} />
            <div className="introduction">
              <h3>{landscape.title}</h3>
              <p>{landscape.desc}</p>
              <Button type={landscape.button.type} link={landscape.button.link} target={landscape.button.target}>
                {landscape.button.text}
                <Icon type="arrow" size="7px" />
              </Button>
            </div>
          </div>
        </section>
        <section className="introduction-section">
          <div className="introduction-body background-gray">
            <div className="introduction">
              <h3>{evaluation.title}</h3>
              <p>{evaluation.desc}</p>
              <Button type={evaluation.button.type} link={evaluation.button.link} target={evaluation.button.target}>
                {evaluation.button.text}
                <Icon type="arrow" size="7px" />
              </Button>
            </div>
            <img src={getLink(evaluation.img)} />
          </div>
        </section>
        {
          eventList.length > 0 &&
          (<section className="events-section">
            <a className="more" target={news.target} href={news.link}>
              {news.more}
              <Icon type="arrow" size="7px" style={{ borderColor: '#333333' }} />
            </a>
            <h3>{events.title}</h3>
            <Slider>
              {eventList.map((event, i) => (
                  <EventCard event={event} key={i} type="arrow" />
              ))}
            </Slider>
          </section>)
        }
        {
          actList.length > 0 &&
          (<section className="events-section">
            <a className="more" target={acts.target} href={acts.link}>
              {acts.more}
              <Icon type="arrow" size="7px" style={{ borderColor: '#333333' }} />
            </a>
            <h3>{activities.title}</h3>
            <Slider>
              {actList.map((act, i) => (
                  <EventCard event={act} key={i} type="button" more={activities.more} />
              ))}
            </Slider>
          </section>)
        }
        <Footer logo="/img/custom/logo_white@2x.png" language={language} />
      </div>
    );
  }
}

document.getElementById('root') && ReactDOM.render(<Home />, document.getElementById('root'));

export default Home;
