import React from 'react';
import ReactDOM from 'react-dom';
import { Router, } from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory';
import {Modal, Tooltip} from 'antd';
import domtoimage from 'dom-to-image';
import queryString from 'query-string';
import clipboard from 'clipboard-copy';
import Language from '../../components/language';
import Header from '../../components/header';
import Footer from '../../components/footer';
import CustomModal from '../../components/modal';
import landscapeConfig from '../../../site_config/landscape';
import { requestLandscape, requestProductDetail } from '../../../utils/service';
import '../../../utils/iconfont';
import './index.scss';

const confirm = Modal.confirm;
const history = createBrowserHistory();

const CUSTOMCOLOR = [
  {fontColor: "#1EBB0B", backColor:"rgba(30,187,11,0.15)"},
  {fontColor: "#E2384C", backColor:"rgba(226,56,76,0.15)"},
  {fontColor: "#00A391", backColor:"rgba(0,163,145,0.15)"},
  {fontColor: "#ED7800", backColor:"rgba(237,120,0,0.15)"},
  {fontColor: "#135DE7", backColor:"rgba(19,93,231,0.15)"},
  {fontColor: "#07A8E3", backColor:"rgba(7, 168, 227, 0.15)"},
];

/**
 * 大类ID和KEY的对应关系
 */
const IDMAPKEY = {
  "1": "load",
  "2": "security",
  "3": "microService",
  "4": "log",
  "5": "base",
  "6": "other",
};

/**
 * 自定义服务的组件
 * @param props
 * @returns {*}
 * @constructor
 */
function ServiceBox(props){
  const data = ['web A', 'service A', 'web B', 'service B'];
  const fontColor="#571ED3";
  const backColor="rgba(87,30,211,0.15)";
  return (
    <div className="arch-card" style={{backgroundColor: backColor}}>
      <div className="arch-cate-name" style={{color: fontColor}}>{props.name}</div>
      <div className="arch-container">
        {data.map(item => {
          return (<div className="arch-item arch-item-service">
            {item}
          </div>)
        })}
      </div>
    </div>
  );
}

/**
 * 架构中的容器
 */
class ArchBox extends React.Component {
  /**
   * 查看详情
   * @param id
   */
  handleDetail = (id) => {
    this.props.handleProductDetail(id);
  };

  /**
   * 删除选中
   * @param cateKey
   * @param id
   */
  handleArchRemove = (cateKey, id) => {
    this.props.handleArchRemove(cateKey, id);
  };
  render(){
    const { cateKey, selectedServices = [] } = this.props;
    return (
      <div className="arch-container">
        {
          selectedServices.length === 0
            ? (<div  className="arch-item arch-blank">
              <svg className="icon icon-jiahao" aria-hidden="true">
                <use xlinkHref="#icon-jiahao"></use>
              </svg>
            </div>)
          : selectedServices.map((item) => {
            return (<div className="arch-item">
              <div className="arch-cate">{item.areaName}</div>
              <img className="arch-logo" src={item.logoUrl} alt={item.logoUrl} />
              <div className="arch-name">{item.name}</div>
              <div className="arch-hover">
                <svg onClick={this.handleDetail.bind(null, item.id)} className="icon icon-hover icon-tanhao" aria-hidden="true">
                  <use xlinkHref="#icon-tanhao"></use>
                </svg>
                <svg onClick={this.handleArchRemove.bind(null, cateKey, item.id)} className="icon icon-hover icon-chahao" aria-hidden="true">
                  <use xlinkHref="#icon-chahao"></use>
                </svg>
              </div>
            </div>)
          })
        }
      </div>
    );
  }
}

/**
 * 卡片区域
 */
class CardSection extends React.Component {
  render(){
    const { cateKey, cateName, selected, fontColor, backColor, handleProductDetail, handleArchRemove } = this.props;
    return (
      <div className="arch-card" style={{backgroundColor: backColor}}>
        <div className="arch-cate-name" style={{color: fontColor}}>{cateName}</div>
        <ArchBox cateKey={cateKey} selectedServices={selected} handleProductDetail={handleProductDetail} handleArchRemove={handleArchRemove}/>
      </div>
    );
  }
}

/**
 * 领域块
 */
class AreaSection extends React.Component {
  constructor(){
    super();
    this.initFlag = true;
  }

  // selected
  checkSelected = (id) => {
    const result = this.props.selected.filter(item => item.id == id);
    return (result.length > 0);
  };

  handleSelected = (cateId, cateName, areaId, areaName, item) => {
    this.props.handleSelected(cateId, cateName, areaId, areaName, item);
  };

  // 初始化的默认选择
  initSelected =  (cateId, cateName, areaId, areaName, item) => {
    const result = this.props.initSelect.filter(id => id == item.id);
    if(result.length > 0){
      this.props.handleSelected(cateId, cateName, areaId, areaName, item);
    }
    return null;
  };

  componentDidMount(){
    this.initFlag = false;
  }

  render() {
    const {cateId, cateName, dataItem, backColor, fontColor, handleProductDetail} = this.props;
    return (
      <div className="source-section" style={{backgroundColor: backColor}}>
        <div className="source-area-name" style={{color: fontColor}}>{cateName}</div>
        <div className="source-container">
          {dataItem.map(cateItem => {
            const { productList, id: areaId, name: areaName, has_report, reportUrl} = cateItem;
            return (
              <div className="source-cate">
                <div className="source-cate-header">
                  <span className="source-cate-name">{areaName}</span>
                  {has_report && <a className="source-report" href={reportUrl} target="_blank">
                    <img src="/img/custom/icon_report@2x.png" alt=""/>
                    评测报告
                  </a>}
                </div>
                <div className="source-items">
                  {productList.map(item => {
                    return (
                      <div className={`source-item ${this.checkSelected(item.id) ? 'selected': ''}`}
                           onClick={this.handleSelected.bind(null, cateId, cateName, areaId, areaName, item)}>
                        {this.initFlag ? this.initSelected(cateId, cateName, areaId, areaName, item) : null}
                        {/* 选中或取消*/}
                        <img className="source-logo" src={item.logoUrl} alt={item.logoUrl}/>
                        <div className="source-name">{item.name}</div>
                        <div className="source-hover">
                          {/* 显示详情*/}
                          <svg onClick={handleProductDetail.bind(null, item.id)} className="icon icon-hover icon-tanhao" aria-hidden="true">
                            <use xlinkHref="#icon-tanhao"></use>
                          </svg>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    );
  }
}
// 初始化从URL中获取选中参数
const getInitSelect = () => {
  let {load = '', security = '', microService = '', log = '', other = '', base = ''} = queryString.parse(window.location.search);
  load = load !== '' ? load.split(',') : [];
  security = security !== '' ? security.split(',') : [];
  microService = microService !== '' ? microService.split(',') : [];
  log = log !== '' ? log.split(',') : [];
  other = other !== '' ? other.split(',') : [];
  base = base !== '' ? base.split(',') : [];
  return [...load, ...security, ...microService, ...log, ...other, ...base];
};

class Landscape extends Language {

  constructor(){
    super();
    this.state = {
      dataSource: [],
      load : [],
      security: [],
      microService: [],
      log: [],
      other: [],
      base: [],
      visible: false,
      productDetail: {},
    };
    this.initSelect = getInitSelect();
    this.archRef = React.createRef();
  }

  handleDownload = () => {
    domtoimage.toJpeg(this.archRef.current, {bgcolor: '#ffffff'})
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = 'devnative-landscape.jpeg';
        link.href = dataUrl;
        link.click();
      });
  };

  handleShare = () => {
    let search = '?';
    const {load, security, microService, log, other, base} = this.state;
    search += `load=${load.map(item => item.id).join(',')}`;
    search += `&security=${security.map(item => item.id).join(',')}`;
    search += `&microService=${microService.map(item => item.id).join(',')}`;
    search += `&log=${log.map(item => item.id).join(',')}`;
    search += `&other=${other.map(item => item.id).join(',')}`;
    search += `&base=${base.map(item => item.id).join(',')}`;
    clipboard(window.location.origin + window.location.pathname + search);
    history.push({
      search,
    });
  };

  handleDelete = () => {
    const { ok, cancel, confirmText } = landscapeConfig[this.getLanguage()];
    confirm({
      icon: '',
      okText: `${ok}`,
      cancelText: `${cancel}`,
      title: `${confirmText}`,
      onOk: () => {
        // 确认一下
        this.setState({
          load : [],
          security: [],
          microService: [],
          log: [],
          other: [],
          base: [],
        });
      },
    });

  };

  closeModal = () => {
    this.setState({
      visible: false,
    });
  };

  // 获取产品详情
  handleProductDetail = async (id, e) => {
    e.stopPropagation();
    const language = this.getLanguage();
    const result = await requestProductDetail(id, language);
    const { success, body} = result;
    if(success){
      this.setState({
        visible: true,
        productDetail: body,
      });
    }
  };

  // cateKey
  handleArchRemove = (cateKey, id) => {
    const data = this.state[cateKey];
    const newArr = data.filter(item => item.id !== id);
    this.setState({
      [cateKey]: newArr,
    });
  };

  handleSelected = (cateId, cateName, areaId, areaName, selectItem) => {
    const key = IDMAPKEY[cateId];
    const data = this.state[key];
    const result = data.filter(item => item.id === selectItem.id);
    let newArr = [];
    if(result.length > 0){
      // 选中状态，去除选中状态
      newArr = data.filter(item => item.id !== selectItem.id);
    }else{
      // 未选中状态，点击选中
      // 一个子类别中仅保留一个数据
      const diffArea = data.filter(item => item.areaId !== areaId);
      newArr = [...diffArea, {...selectItem, cateId, cateName, areaId, areaName}];
    }
    this.setState({
      [key]: newArr,
    });
  };

  async componentDidMount() {
    const language = this.getLanguage();
    const result = await requestLandscape(language);
    const { success, body} = result;
    if(success){
      const { groupList } = body;
      if(groupList && Array.isArray(groupList)){
        this.setState({
          dataSource: groupList,
        });
      }
    }
  }

  render() {
    const language = this.getLanguage();
    const {
      title,
      app,
      browser,
      iot,
      loadText,
      securityText,
      microServiceText,
      serviceText,
      logText,
      otherText,
      baseText,
      copy,
    } = landscapeConfig[language];

    const { dataSource, load, security, microService, log, other, base, visible, productDetail } = this.state;
    const selected = [...load, ...security, ...microService, ...log, ...other, ...base];
    return (
      <Router history={history}>
        <div>
          <div className="landscape-page">
            <Header
              currentKey="landscape"
              type="normal"
              logo="/img/custom/logo@2x.png"
              language={language}
              onLanguageChange={this.onLanguageChange}
            />
            <div className="middle-container">
              <div className="arch-title">{title}</div>
              {/*架构图部分*/}
              <div className="operator-right">
                <svg onClick={this.handleDownload} className="icon icon-operator icon-clouddownload" aria-hidden="true">
                  <use xlinkHref="#icon-clouddownload"></use>
                </svg>
                <Tooltip title={copy} trigger='click'>
                  <svg onClick={this.handleShare} className="icon icon-operator icon-fenxiang" aria-hidden="true">
                    <use xlinkHref="#icon-fenxiang"></use>
                  </svg>
                </Tooltip>
                <svg onClick={this.handleDelete} className="icon icon-operator icon-trash" aria-hidden="true">
                  <use xlinkHref="#icon-trash"></use>
                </svg>
              </div>
              <div className="architecture" ref={this.archRef}>
                <div className="arch-upper">
                  <div className="arch-ui">
                    <div className="arch-ui-item">
                      <img src="/img/custom/icon-app@2x.png" alt=""/>
                      <div className="arch-ui-item-label">{app}</div>
                    </div>
                    <div className="arch-ui-item">
                      <img src="/img/custom/icon-explorer@2x.png" alt=""/>
                      <div className="arch-ui-item-label">{browser}</div>
                    </div>
                    <div className="arch-ui-item">
                      <img src="/img/custom/icon-iot@2x.png" alt=""/>
                      <div className="arch-ui-item-label">{iot}</div>
                    </div>
                  </div>
                  <img className="arch-arrow" src="/img/custom/icon_arrow_small_architecture@2x.png" alt=""/>
                  <div className="arch-balance">
                    <CardSection
                      cateKey="load"
                      cateName={loadText}
                      selected={load}
                      fontColor="#1EBB0B"
                      backColor="rgba(30,187,11,0.15)"
                      handleProductDetail={this.handleProductDetail}
                      handleArchRemove={this.handleArchRemove}
                    />
                  </div>
                  <img className="arch-arrow" src="/img/custom/icon_arrow_small_architecture@2x.png" alt=""/>
                  <div className="arch-services">
                    <div className="arch-security">
                      <CardSection
                        cateKey="security"
                        cateName={securityText}
                        selected={security}
                        fontColor="#E2384C"
                        backColor="rgba(226,56,76,0.15)"
                        handleProductDetail={this.handleProductDetail}
                        handleArchRemove={this.handleArchRemove}
                      />
                    </div>
                    <img className="arch-arrow" src="/img/custom/icon_arrow_small_architecture@2x.png" alt=""/>
                    <div className="arch-middle-section">
                      <div className="stretch arch-micro-service">
                        <CardSection
                          cateKey="microService"
                          cateName={microServiceText}
                          selected={microService}
                          fontColor="#00A391"
                          backColor="rgba(0,163,145,0.15)"
                          handleProductDetail={this.handleProductDetail}
                          handleArchRemove={this.handleArchRemove}
                        />
                      </div>
                      <img className="arch-arrow rotate180" src="/img/custom/icon_arrow_gray_architecture.png" alt=""/>
                      <div className="arch-web-service">
                        <ServiceBox name={serviceText}/>
                      </div>
                      <img className="arch-arrow" src="/img/custom/icon_arrow_gray_architecture.png" alt=""/>
                      <div className="stretch arch-log">
                        <CardSection
                          cateKey="log"
                          cateName={logText}
                          selected={log}
                          fontColor="#ED7800"
                          backColor="rgba(237,120,0,0.15)"
                          handleProductDetail={this.handleProductDetail}
                          handleArchRemove={this.handleArchRemove}
                        />
                      </div>
                      <img className="arch-arrow rotate270 arrow-base" src="/img/custom/icon_arrow_small_architecture@2x.png" alt=""/>
                    </div>
                    <img className="arch-arrow rotate270" src="/img/custom/icon_arrow_gray_architecture.png" alt=""/>
                    <div className="arch-others">
                      <CardSection
                        cateKey="other"
                        cateName={otherText}
                        selected={other}
                        fontColor="#135DE7"
                        backColor="rgba(19,93,231,0.15)"
                        handleProductDetail={this.handleProductDetail}
                        handleArchRemove={this.handleArchRemove}
                      />
                    </div>
                  </div>
                </div>
                <div className="arch-base">
                  <div className="arch-base-name">{baseText}</div>
                  <div className="arch-container-right">
                    <ArchBox cateKey="base" selectedServices={base} handleProductDetail={this.handleProductDetail} handleArchRemove={this.handleArchRemove}/>
                  </div>
                </div>
              </div>

              {/*数据源部分*/}
              {
                dataSource.length > 0 &&
                dataSource.map((item, index) => {
                  const {fontColor = '#ED7800', backColor = 'rgba(237,120,0,0.15)'} = CUSTOMCOLOR[index];
                  return <AreaSection
                    cateId={item.id}
                    cateName={item.name}
                    dataItem={item.areaList}
                    fontColor={fontColor}
                    backColor={backColor}
                    initSelect={this.initSelect}
                    selected={selected}
                    handleSelected={this.handleSelected}
                    handleProductDetail={this.handleProductDetail}
                  />
                })
              }
            </div>
          </div>
          <Footer logo="/img/custom/logo_white@2x.png" language={language} />
          <CustomModal visible={visible} item={productDetail} handleVisble={this.closeModal}/>
        </div>
      </Router>
    );
  }
}

document.getElementById('root') && ReactDOM.render(<Landscape />, document.getElementById('root'));

export default Landscape;
