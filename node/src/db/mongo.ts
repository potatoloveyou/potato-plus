const { MongoClient, ObjectId } = require('mongodb');
// import { MongoClient, ObjectId } from 'mongodb';

const uri = 'mongodb://localhost:27017';

const client = new MongoClient(uri); // 创建一个客户端

const db = client.db('app_node');

const goods_search = db.collection('goods_search');

module.exports = { ObjectId, client,  goods_search };
