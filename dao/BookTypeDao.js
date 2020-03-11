//引入自定义的异常
const ServiceError = require("../error/ServiceError.js")
//引入工具类
const util = require("../util/util.js")
//引入sql操作
const SqlUtil = require("../util/SqlUtil")
//创建sql类实例
const sqlUtil = new SqlUtil('bookType')
//创建dao
let dao = {}

/**
 * 添加图书类别
 */
dao.addBookType = function(bookType){
	return new Promise(function(resolve,reject){
		sqlUtil.insert(bookType).then((result)=>{
			resolve(result);
		}).catch((error)=>{
			reject(error);
		})
	})
}

/**
 * 删除图书类别
 */
dao.deleteBookType = function(bt_id){
	return new Promise(function(resolve,reject){
		sqlUtil.delete('bt_id',bt_id).then((result)=>{
			resolve(result);
		}).catch((error)=>{
			reject(error);
		})
	})
}

/**
 * 修改图书类别
 */
dao.modifyBookType = function(bookType){
	return new Promise(function(resolve,reject){
		sqlUtil.update(bookType,'bt_id').then((result)=>{
			resolve(result);
		}).catch((error)=>{
			reject(error);
		})
	})
}

/**
 * 根据图书类别id查询
 */
dao.queryBookTypeById = function(bt_id){
	return new Promise(function(resolve,reject){
		sqlUtil.query('bt_id',bt_id).then((result)=>{
			resolve(result);
		}).catch((error)=>{
			reject(error);
		})
	})
}

/**
 * 多条件查询图书类别
 */
dao.queryBookTypeByMore = function(options){
	return new Promise(function(resolve,reject){
		sqlUtil.querys(options).then((result)=>{
			resolve(result);
		}).catch((error)=>{
			reject(error);
		})
	})
}

/**
 * 多条件查询图书类别总数
 */
dao.queryBookTypeCounts = function(options){
	return new Promise(function(resolve,reject){
		sqlUtil.queryCounts(options).then((result)=>{
			resolve(result[0]['count(1)']);
		}).catch((error)=>{
			reject(error);
		})
	})
}

module.exports = dao
