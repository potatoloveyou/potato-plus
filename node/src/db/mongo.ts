const { MongoClient, ObjectId } = require('mongodb');
// import { MongoClient, ObjectId } from 'mongodb';

const uri = 'mongodb://localhost:27017';

const client = new MongoClient(uri); // 创建一个客户端

const db = client.db('app_node');

const various_bar = db.collection('various_bar');

const index_swiper_imgs = db.collection('index_swiper_imgs');

const goods_search = db.collection('goods_search');

const user_shipping_addresses = db.collection('user_shipping_addresses');

const shopping_cart = db.collection('shopping_cart');

const shopping_cart_item = db.collection('shopping_cart_item');

const user = db.collection('user');

// 存储长期token
const refresh_tokens = db.collection('refresh_tokens');

// 存储验证码
const verify = db.collection('verify');

// 订单
const order = db.collection('order');

module.exports = {
	ObjectId,
	client,
	various_bar,
	index_swiper_imgs,
	goods_search,
	user_shipping_addresses,
	shopping_cart,
	shopping_cart_item,
	user,
	refresh_tokens,
	verify,
	order,
};
