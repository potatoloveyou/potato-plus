const Router = require('@koa/router');
const router = new Router();

const bodyParser = require('koa-bodyparser');
// 局部应用 body parser 中间件
router.use(bodyParser());

const { verify } = require('../db/mongo.ts');

const verifyEmail = async (ctx, next) => {

};

module.exports = verifyEmail;
