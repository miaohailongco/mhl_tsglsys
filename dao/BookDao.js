//引入自定义的异常
const ServiceError = require("../error/ServiceError.js")
//引入工具类
const util = require("../util/util.js")
//引入sql操作
const SqlUtil = require("../util/SqlUtil")
//创建sql类实例
const sqlUtil = new SqlUtil('book')
//创建dao
let dao = {}


/**
 * 增加书籍
 */
dao.addBook = function(book){
	return new Promise(function(resolve,reject){
		sqlUtil.insert(book).then((result)=>{
			resolve(result);
		}).catch((error)=>{
			reject(error);
		})
	})
}

/**
 * 删除书籍
 */
dao.deleteBook = function(book_id){
	return new Promise(function(resolve,reject){
		sqlUtil.delete('book_id',book_id).then((result)=>{
			resolve(result);
		}).catch((error)=>{
			reject(error);
		})
	})
}

/**
 * 修改图书信息
 */
dao.modifyBook = function(book){
	return new Promise(function(resolve,reject){
		sqlUtil.update(book,'book_id').then((result)=>{
			resolve(result);
		}).catch((error)=>{
			reject(error);
		})
	})
}

/**
 * 根据图书id查询
 */
dao.queryBookById = function(book_id){
	return new Promise(function(resolve,reject){
		sqlUtil.query('book_id',book_id).then((result)=>{
			resolve(result);
		}).catch((error)=>{
			reject(error);
		})
	})
}

/**
 * 图书多条件查询
 */
dao.queryBookByMore = function(options){
	return new Promise(function(resolve,reject){
		sqlUtil.querys(options).then((result)=>{
			resolve(result);
		}).catch((error)=>{
			reject(error);
		})
	})
}

/**
 * 多条件查询图书的总记录数
 */
dao.queryBookCounts = function(options){
	return new Promise(function(resolve,reject){
		sqlUtil.queryCounts(options).then((result)=>{
			resolve(result[0]['count(1)']);
		}).catch((error)=>{
			reject(error);
		})
	})
}

module.exports = dao
