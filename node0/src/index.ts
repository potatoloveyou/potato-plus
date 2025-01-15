// import * as Koa from "koa";
// https://juejin.cn/post/6844903922767757320?searchId=20250114155755EE547276C7064351590B

import Koa from 'koa';
const App = new Koa();

import './routes/test';
import router from './routes/main';

// 开始使用路由
App.use(router.routes());


