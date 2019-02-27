import React from 'react';
import PropTypes from 'prop-types';
import siteConfig from '../../../site_config/site';
import { getLink } from '../../../utils';
import './index.scss';

const propTypes = {
  logo: PropTypes.string.isRequired, // logo地址
  language: PropTypes.oneOf(['zh-cn', 'en-us']),
};

class Footer extends React.Component {

  render() {
    const { logo, language } = this.props;
    const { disclaimer: { zhihu, email, recruit }, copyright } = siteConfig[language];
    return (
      <footer className="footer-container">
        <div className="footer-body">
          <img src={getLink(logo)} />
          <div className="cols-container">
            <a className="link" href={zhihu.link}>{zhihu.text}</a>
            <a className="link" href={email.link}>{email.text}</a>
            <a className="link" href={recruit.link}>{recruit.text}</a>
          </div>
          <div className="copyright">
            <span>{copyright}</span>
          </div>
        </div>
      </footer>
    );
  }
}

Footer.propTypes = propTypes;

export default Footer;
