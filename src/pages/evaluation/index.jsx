import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory';
import Tabs from 'antd/lib/tabs';
import 'antd/lib/tabs/style/css';
import Tag from 'antd/lib/tag';
import 'antd/lib/tag/style/css';
import List from 'antd/lib/list';
import 'antd/lib/list/style/css';
import Tooltip from 'antd/lib/tooltip';
import 'antd/lib/tooltip/style/css';
import queryString from 'query-string';

import Language from '../../components/language';
import Header from '../../components/header';
import Footer from '../../components/footer';
import CustomButton from '../../components/button';
import CustomIcon from '../../components/icon';
import CustomModal from '../../components/modal';
import evaluationConfig from '../../../site_config/evaluation';
import {requestCompare, requestProductDetail} from '../../../utils/service';
import '../../../utils/iconfont';
import './index.scss';

const { TabPane } = Tabs;
const { CheckableTag } = Tag;

const history = createBrowserHistory();

/**
 * checkable tag
 */
class CheckTag extends React.Component {

  handleChange = (checked) => {
    const { id, onTagChange } = this.props;
    onTagChange(id, checked);// 设置变化值
  };

  render() {
    const { checked } = this.props;
    return (
      <Tag className="evaluation-tag" color="#FAFAFA" onClick={this.handleChange.bind(null, !checked)}>
        <span className="name">{this.props.name}</span>
        <CheckableTag {...this.props} className="evaluation-check-tag" checked={checked} onChange={this.handleChange}>
          <svg className="icon icon-duihao" aria-hidden="true">
            <use xlinkHref="#icon-duihao1"></use>
          </svg>
        </CheckableTag>
      </Tag>
    )
  }
}

/**
 * Compare Table
 */
class CustomTable extends React.PureComponent {

  convertRowHead = sceneList => {
    let arr = [];
    sceneList.map(item => {
      arr = [...arr, {name: item.name, comment: item.comment}];
      arr = [...arr, ...item.items];
    });
    return arr;
  };

  creatRowHeaderItem = item => {
    if (item.nameId) {
      return (<List.Item className="custom-table-cell">{item.name}</List.Item>);
    } else {
      return (
        <List.Item className="custom-table-cell custom-scene">
          {item.name}
          {item.comment &&
            <Tooltip title={item.comment}>
              <svg className="icon icon-tanhao" aria-hidden="true">
                <use xlinkHref="#icon-tanhao"></use>
              </svg>
            </Tooltip>
          }
        </List.Item>
      )
    }
  };

  convertRowData = (selectItem, sceneList) => {
    let arr = [];
    sceneList.map(sceneItem => {
      const { id: sceneId, items } = sceneItem;
      arr.push('-');
      items.map(item => {
        const { nameId } = item;
        arr.push(selectItem.sceneProperties[sceneId][nameId]);
      });
    });
    return arr;
  };

  createHeader = (item) => {
    return (
      <div className="custom-list-header">
        <img
          className="header-logo"
          src={item.logoUrl}
          alt="logo"
          onClick={this.props.handleProductDetail.bind(null, item.id)}
        />
        <div className="header-flex">
          <div className="header-name">{item.name}</div>
          <div className="header-github">
            <div className="header-star">
              <svg className="icon icon-star" aria-hidden="true">
                <use xlinkHref="#icon-star_full"></use>
              </svg>
              {item.git_star_num}
            </div>
            <div className="header-star-desc">Github Star</div>
          </div>
        </div>
      </div>
    )
  };

  createColumns = (selectData, sceneList) => {
    return selectData.map(selectItem => {
      return (
        <List
          className="custom-column"
          header={this.createHeader(selectItem)}
          bordered={false}
          dataSource={this.convertRowData(selectItem, sceneList)}
          renderItem={item => (<List.Item className="custom-table-cell">{item}</List.Item>)}
          split={true}
          size="small"
        />
      )
      }
    )
  };

  render() {
    const {language, gitUrl, selectData, sceneList} = this.props;
    const { method, tableHeader } = evaluationConfig[language];
    return (
      <div className="custom-table">
        <List
          className="custom-column"
          header={
            gitUrl
            ? (<div className="custom-list-header">
                <CustomButton type="normal" link={gitUrl} target="_blank">
                  {method}
                  <CustomIcon type="arrow" size="10px"/>
                </CustomButton>
              </div>)
            : <div className="custom-list-header table-header">{tableHeader}</div>}
          bordered={false}
          dataSource={this.convertRowHead(sceneList)}
          renderItem={this.creatRowHeaderItem}
          split={true}
          size="small"
        />
        {this.createColumns(selectData, sceneList)}
      </div>
    )
  }
}


class Evaluation extends Language {

  constructor(){
    super();
    this.state = {
      areaInfo: [],
      productionList: [],
      sceneList: [],
      activeKey: "1",// TODO 默认值, 后端处理
      selectData: [],
      visible: false,
      productDetail: {},
    }
  }

  async componentDidMount(){
    let { activeKey } = this.state;
    let selected = '';
    const { location: {search} } = history;
    if(search !== ''){
      const obj = queryString.parse(search);
      activeKey = obj.areaid || "1";// areaId
      selected = obj.pids || [];// selected
      // console.log('parse', selected);
    }
    // 默认值
    const language = this.getLanguage();
    const result = await requestCompare(activeKey, language);
    const { success, body} = result;
    if(success){
      const { areaInfo = [], productionList = [], sceneList = [] } = body;
      if(areaInfo.length > 0) {
        // 选择路径中的选择值
        let selectedArr = [];
        if (selected.length > 0) {
          // const keys = selected.split(',');
          selected.map(prodId => {
            const prodItem = productionList.filter(item => item.id == prodId);
            selectedArr = [...selectedArr, ...prodItem];
          });
        } else {
          // 默认选中3个
          selectedArr = productionList.slice(0, 3);
        }
        this.setState({
          areaInfo,
          productionList,
          sceneList,
          activeKey: activeKey != "1" ? activeKey : `${areaInfo[0].id}`,
          selectData: selectedArr,
        }, this.replaceSearch);
      }
    }
  }

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
      })

    }
  };


  onTabChange = async (activeKey) => {
    history.push({
      search: `areaid=${activeKey}`,
    });
    const language = this.getLanguage();
    const result = await requestCompare(activeKey, language);
    const { success, body} = result;
    if(success){
      const { areaInfo = [], productionList = [], sceneList = [] } = body;
      this.setState({
        activeKey,
        areaInfo,
        productionList,
        sceneList,
        selectData: productionList.slice(0, 3),
      }, this.replaceSearch);
    }
  };

  replaceSearch = () => {
    const { location: {search} } = history;
    const { areaid } = queryString.parse(search);
    const { selectData } = this.state;
    const ids = selectData.map(data => data.id);

    console.log(queryString.stringify({areaid, pids: ids}));

    history.replace({
      search: queryString.stringify({areaid, pids: ids}),
    });
  };

  onTagChange = (prodId, checked) => {
    // console.log(prodId, checked);
    const { productionList, selectData } = this.state;
    // 如果是则添加，如果否则删除
    if(checked){
      const prodItem = productionList.filter(item => item.id == prodId);
      this.setState({
        selectData: [...selectData, ...prodItem],
      }, this.replaceSearch);
    }else{
      // 快速删除数组中的某一项
      const temp = [...selectData];
      temp.splice(temp.findIndex(item => item.id === prodId), 1);
      this.setState({
        selectData: temp
      }, this.replaceSearch);
    }
  };

  /**
   * 创建标签
   */
  createTags = () => {
    const {productionList, selectData} = this.state;
    return productionList.map((item) => {
      const newArr =  selectData.filter(prod => prod.id === item.id);
      const checked = newArr.length > 0;
      return (
        <CheckTag id={item.id} name={item.name} checked={checked} onTagChange={this.onTagChange}/>
      )
    })
  };

  /**
   * 创建表格
   */
  createTable = () => {
    const language = this.getLanguage();
    const {activeKey, selectData, sceneList} = this.state;
    const areaItem = this.state.areaInfo.filter(item => item.id == activeKey);
    const {git_url} = areaItem[0];

    if (selectData.length === 0) {
      return null;
    } else {
      return <CustomTable
        language={language}
        gitUrl={git_url}
        selectData={selectData}
        sceneList={sceneList}
        handleProductDetail={this.handleProductDetail}
      />;
    }
  };

  createPaneContent = (item) => {
    const {activeKey} = this.state;
    if (item.id != activeKey) {
      return <div>no data</div>
    } else {
      return (<div>
        <div className="tag-area">
          {this.createTags()}
        </div>
        {this.createTable()}
      </div>)
    }
  };

  createTabPane = (areaInfo) => {
    return areaInfo.map((item) => {
      return (
        <TabPane tab={item.name} key={item.id}>
          {this.createPaneContent(item)}
        </TabPane>
      )
    })
  };

  render() {
    const language = this.getLanguage();
    // const { method } = evaluationConfig[language];
    const { areaInfo, activeKey, visible, productDetail} = this.state;
    return (
      <Router history={history}>
        <div>
          <div className="evaluation-page">
            <Header
              currentKey="evaluation"
              type="normal"
              logo="/img/custom/logo@2x.png"
              language={language}
              onLanguageChange={this.onLanguageChange}
            />

            {areaInfo.length > 0
            && (
              <div className="middle-container">
                <Tabs
                  // defaultActiveKey={1}
                  onChange={this.onTabChange}
                  activeKey={activeKey}
                >
                  {this.createTabPane(areaInfo)}
                </Tabs>
              </div>
            )}
            <Footer logo="/img/custom/logo_white@2x.png" language={language} />
            <CustomModal visible={visible} item={productDetail} handleVisble={this.closeModal}/>
          </div>
        </div>
      </Router>
    );
  }
}

document.getElementById('root') && ReactDOM.render(<Evaluation />, document.getElementById('root'));

export default Evaluation;
