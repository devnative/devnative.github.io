/**
 * 所有后端服务的请求接口
 */
// 所有服务的列表
const LANDSCAPE = 'http://106.15.104.211/landscape/';
// 产品详情
const PRODUCTDETAIL = 'http://106.15.104.211/product/';
// 评测页面
const COMPARE = 'http://106.15.104.211/compare/get';

/**
 * 获得所有的架构服务
 * @param language
 * @returns {Promise<Response | never>}
 */
const requestLandscape = (language) => {
  return fetch(`${LANDSCAPE}?language=${language}`, {
    method: 'get',
    mode: 'cors',
  }).then((res) => {
    if (res.ok) {
      return res.json();
    } else {
      return {};
    }
  })
};

/**
 * 获取某个产品的详细信息
 * @param id
 * @param language
 * @returns {Promise<Response | never>}
 */
const requestProductDetail = (id, language) => {
  return fetch(`${PRODUCTDETAIL}${id}?language=${language}`, {
    method: 'get',
    mode: 'cors',
  }).then((res) => {
    if (res.ok) {
      return res.json();
    } else {
      return {};
    }
  })
};

// http://106.15.104.211/compare/get  POST  参数{"areaId":1,"language":"xx"}

/**
 * 获取评测的数据
 * @param areaId
 * @param language
 * @returns {Promise<Response | never>}
 */
const requestCompare = (areaId, language) => {
  return fetch(COMPARE, {
    method: 'post',
    mode: 'cors',
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({areaId, language})
  }).then((res) => {
    if (res.ok) {
      return res.json();
    } else {
      return {};
    }
  })
};

export {
  requestLandscape,
  requestProductDetail,
  requestCompare,
}
