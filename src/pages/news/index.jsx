import React from 'react';
import ReactDOM from 'react-dom';
import Language from '../../components/language';
import Header from '../../components/header';
import Bar from '../../components/bar';
import PageSlider from '../../components/pageSlider';
import EventCard from '../community/eventCard';
import Footer from '../../components/footer';
import newsConfig from '../../../site_config/news';
import './index.scss';

class News extends Language {

  render() {
    const language = this.getLanguage();
    const { barText, events } = newsConfig[language];
    return (
      <div className="community-page">
        <Header
          currentKey="news"
          type="normal"
          logo="/img/custom/logo@2x.png"
          language={language}
          onLanguageChange={this.onLanguageChange}
        />
        <Bar img="/img/system/community.png" text={barText} />
        <section className="events-section">
          <PageSlider pageSize={9}>
            {events.list.map((item, i) => (
              <EventCard event={item} key={i} />
            ))}
          </PageSlider>
        </section>
        <Footer logo="/img/custom/logo_white@2x.png" language={language} />
      </div>
    );
  }
}

document.getElementById('root') && ReactDOM.render(<News />, document.getElementById('root'));

export default News;
