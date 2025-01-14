// import Router from '@koa/router';
import Router from '@koa/router';

import config from '../modules/Config';

/**
 * api路由模块
 */
const router = new Router({
	prefix: config.apiPrefix,
});

export default router;
