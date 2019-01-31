import React from 'react';
import ReactDOM from 'react-dom';
import { scroller } from 'react-scroll';
import path from 'path';
import 'whatwg-fetch'; // fetch polyfill
import Language from '../../components/language';
import Header from '../../components/header';
import Footer from '../../components/footer';
import Button from '../../components/button';
import ActivityConfig from '../../../site_config/activity';
import BlogConfig from '../../../site_config/blog';
import { getLink } from '../../../utils';
import Icon from '../../components/icon';
import '../../../utils/iconfont.js';
import './index.scss';

// 锚点正则
const anchorReg = /^#[^/]/;
// 相对地址正则，包括./、../、直接文件夹名称开头、直接文件开头
const relativeReg = /^((\.{1,2}\/)|([\w-]+[/.]))/;

/**
 * 创建 Banner
 * @param meta
 * @param language
 * @returns {*}
 */
const createBanner = (meta, language) => {
  if (Object.keys(meta).length === 0) {
    return null;
  }
  const { type } = meta;
  if (type === 'activity') {
    const { title, subtitle, count, time, address, link, target, img } = meta;
    const { detail: { labelCount, labelTime, labelAddress, btnText } } = ActivityConfig[language];
    return (
      <div className="blog-banner">
        <div className="blog-banner-content" style={{ backgroundImage: `url(${img})` }}>
          <p className="title">{title}</p>
          <p className="subtitle">{subtitle}</p>
          <div className="labels">
            <span className="label">
              <svg className="icon banner-icon" aria-hidden="true">
                <use xlinkHref="#icon-user" />
              </svg>
              {labelCount} :
            </span>
            <span className="desc">{count}</span>
            <span className="label">
              <svg className="icon banner-icon" aria-hidden="true">
                <use xlinkHref="#icon-icon-time" />
              </svg>
              {labelTime} :
            </span>
            <span className="desc">{time}</span>
            <span className="label">
              <svg className="icon banner-icon" aria-hidden="true">
                <use xlinkHref="#icon-location1" />
              </svg>
              {labelAddress} :
            </span>
            <span className="desc">{address}</span>
          </div>
          <Button className="blog-button" type="normal" link={getLink(link)} target={target || '_self'}>
            {btnText}
            <Icon type="arrow" size="7px" />
          </Button>
        </div>
      </div>
    );
  } else if (type === 'news') {
    const { title, subtitle, author, time, category, img } = meta;
    const { detail: { labelAuthor, labelTime, labelCategory } } = BlogConfig[language];
    return (
      <div className="blog-banner">
        <div className="blog-banner-content" style={{ backgroundImage: `url(${img})` }}>
          <p className="title">{title}</p>
          <p className="subtitle">{subtitle}</p>
          <div className="labels">
            <span className="label">
              <svg className="icon banner-icon" aria-hidden="true">
                <use xlinkHref="#icon-user" />
              </svg>
              {labelAuthor} :
            </span>
            <span className="desc">{author}</span>
          </div>
          <div className="labels">
            <span className="label">
              <svg className="icon banner-icon" aria-hidden="true">
                <use xlinkHref="#icon-icon-time" />
              </svg>
              {labelTime} :
            </span>
            <span className="desc">{time}</span>
          </div>
          <div className="labels">
            <span className="label">
              <svg className="icon banner-icon" aria-hidden="true">
                <use xlinkHref="#icon-code" />
              </svg>
              {labelCategory} :
            </span>
            {category.split(',').map((item) => {
              return (<span className="cate-babel">{item}</span>);
            })}
          </div>
        </div>
      </div>
    );
  }
  return null;
};


class BlogDetail extends Language {

  constructor(props) {
    super(props);
    this.state = {
      __html: '',
      meta: {},
    };
  }

  componentDidMount() {
    // 通过请求获取生成好的json数据，静态页和json文件在同一个目录下
    fetch(window.location.pathname.replace(/\.html$/i, '.json'))
    .then(res => res.json())
    .then((md) => {
      this.setState({
        __html: md && md.__html ? md.__html : '',
        meta: md.meta || {},
      });
    });
    this.markdownContainer.addEventListener('click', (e) => {
      const isAnchor = e.target.nodeName.toLowerCase() === 'a' && e.target.getAttribute('href') && anchorReg.test(e.target.getAttribute('href'));
      if (isAnchor) {
        e.preventDefault();
        const id = e.target.getAttribute('href').slice(1);
        scroller.scrollTo(id, {
          duration: 1000,
          smooth: 'easeInOutQuint',
        });
      }
    });
  }

  componentDidUpdate() {
    this.handleRelativeLink();
    this.handleRelativeImg();
  }

  handleRelativeLink() {
    const language = this.getLanguage();
    // 获取当前文档所在文件系统中的路径
    // rootPath/en-us/blog/dir/hello.html => /blog/en-us/dir
    const splitPart = window.location.pathname.replace(`${window.rootPath}/${language}`, '').split('/').slice(0, -1);
    const filePath = splitPart.join('/');
    const alinks = Array.from(this.markdownContainer.querySelectorAll('a'));
    alinks.forEach((alink) => {
      const href = alink.getAttribute('href');
      if (relativeReg.test(href)) {
        // 文档之间有中英文之分，md的相对地址要转换为对应HTML的地址
        alink.href = `${path.join(`${window.rootPath}/${language}`, filePath, href.replace(/\.(md|markdown)$/, '.html'))}`;
      }
    });
  }

  handleRelativeImg() {
    const language = this.getLanguage();
    // 获取当前文档所在文件系统中的路径
    // rootPath/en-us/blog/dir/hello.html => /blog/en-us/dir
    const splitPart = window.location.pathname.replace(`${window.rootPath}/${language}`, '').split('/').slice(0, -1);
    splitPart.splice(2, 0, language);
    const filePath = splitPart.join('/');
    const imgs = Array.from(this.markdownContainer.querySelectorAll('img'));
    imgs.forEach((img) => {
      const src = img.getAttribute('src');
      if (relativeReg.test(src)) {
        // 图片无中英文之分
        img.src = `${path.join(window.rootPath, filePath, src)}`;
      }
    });
  }

  render() {
    const language = this.getLanguage();
    const __html = this.props.__html || this.state.__html;
    const meta = this.state.meta;
    return (
      <div className="blog-detail-page">
        <Header
          type="normal"
          currentKey="blog"
          logo="/img/temp/_logo_colorful.png"
          language={language}
          onLanguageChange={this.onLanguageChange}
        />
        {createBanner(meta, language)}
        <section
          className="blog-content markdown-body"
          ref={(node) => { this.markdownContainer = node; }}
          dangerouslySetInnerHTML={{ __html }}
        />
        <Footer logo="/img/temp/_logo_gray.png" language={language} />
      </div>
    );
  }
}

document.getElementById('root') && ReactDOM.render(<BlogDetail />, document.getElementById('root'));

export default BlogDetail;
