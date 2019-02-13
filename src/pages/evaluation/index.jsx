import React from 'react';
import ReactDOM from 'react-dom';
import Language from '../../components/language';
import Header from '../../components/header';
import Footer from '../../components/footer';
// import activityConfig from '../../../site_config/activity';
import './index.scss';

class Evaluation extends Language {

  render() {
    const language = this.getLanguage();
    // const { barText, activities } = activityConfig[language];
    return (
      <div className="evaluation-page">
        <Header
          currentKey="evaluation"
          type="normal"
          logo="/img/custom/logo@2x.png"
          language={language}
          onLanguageChange={this.onLanguageChange}
        />
        <div>
          评测页
        </div>
        <Footer logo="/img/custom/logo_white@2x.png" language={language} />
      </div>
    );
  }
}

document.getElementById('root') && ReactDOM.render(<Evaluation />, document.getElementById('root'));

export default Evaluation;
