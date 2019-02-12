// 全局的一些配置
export default {
  rootPath: '/product', // 发布到服务器的根目录，需以/开头但不能有尾/，如果只有/，请填写空字符串
  port: 8080, // 本地开发服务器的启动端口
  domain: 'dubbo.apache.org', // 站点部署域名，无需协议和path等
  defaultSearch: 'google', // 默认搜索引擎，baidu或者google
  defaultLanguage: 'zh-cn',
  'en-us': {
    pageMenu: [
      {
        key: 'home', // 用作顶部菜单的选中
        text: 'Home',
        link: '/en-us/index.html',
      },
      {
        key: 'landscape',
        text: 'Landscape',
        link: 'https://design.devnative.io/en-us/landscape/index.html',
      },
      {
        key: 'evaluation',
        text: 'Evaluation',
        link: 'https://design.devnative.io/en-us/evaluation/index.html',
      },
      {
        key: 'activities',
        text: 'Activities',
        link: '/en-us/activities/index.html',
      },
      {
        key: 'news',
        text: 'News',
        link: '/en-us/news/index.html',
      },
    ],
    disclaimer: {
      zhihu: {
        text: 'ZhiHu Account',
        link: '#', // TODO 链接
        target: '',
      },
      email: {
        text: 'Email',
        link: 'mailto:#', // TODO 链接
        target: '',
      },
      recruit: {
        text: 'Recruit',
        link: '#', // TODO 链接
        target: '',
      }
    },
    copyright: 'Copyright © 2019 The Develop Native Authors. All rights reserved.',
  },
  'zh-cn': {
    pageMenu: [
      {
        key: 'home',
        text: '首页',
        link: '/zh-cn/index.html',
      },
      {
        key: 'landscape',
        text: 'Landscape',
        link: 'https://design.devnative.io/zh-cn/landscape/index.html',
      },
      {
        key: 'evaluation',
        text: '测评',
        link: 'https://design.devnative.io/zh-cn/evaluation/index.html',
      },
      {
        key: 'activities',
        text: '活动',
        link: '/zh-cn/activities/index.html',
      },
      {
        key: 'news',
        text: '新闻',
        link: '/zh-cn/news/index.html',
      },
    ],
    disclaimer: {
      zhihu: {
        text: '知乎机构号',
        link: '#', // TODO 链接
        target: '',
      },
      email: {
        text: '官方邮箱',
        link: 'mailto:#', // TODO 链接
        target: '',
      },
      recruit: {
        text: '招贤纳士',
        link: '#', // TODO 链接
        target: '',
      }
    },
    copyright: 'Copyright © 2019 The Develop Native Authors. All rights reserved.',
  },
};
