// 引入mockjs
const Mock = require("mockjs");

import poumiantuline5 from './data/poumiantuline5.json'
import poumiantuline2 from './data/poumiantuline2.json'



// Mock.mock( url, post/get , 返回的数据)；

Mock.mock("/api/poumiantuline5", "post", poumiantuline5);
Mock.mock("/api/poumiantuline2", "post", poumiantuline2);