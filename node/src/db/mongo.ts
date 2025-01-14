const { MongoClient, ObjectId } = require('mongodb');
// import { MongoClient, ObjectId } from 'mongodb';

const uri = 'mongodb://localhost:27017';

const client = new MongoClient(uri); // 创建一个客户端

const db = client.db('app_node');

const goods_search = db.collection('goods_search');

const top_bar = db.collection('top_bar');

const order_bar = db.collection('order_bar');

const user_shipping_addresses = db.collection('user_shipping_addresses');

const shopping_cart = db.collection('orderBar');

const order = db.collection('order');

module.exports = {
	ObjectId,
	client,
	goods_search,
	top_bar,
	order_bar,
	user_shipping_addresses,
	order,
};
