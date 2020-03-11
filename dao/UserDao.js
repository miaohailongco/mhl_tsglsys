//引入自定义的异常
const ServiceError = require("../error/ServiceError.js")
//引入工具类
const util = require("../util/util.js")
//引入sql操作
const SqlUtil = require("../util/SqlUtil")
//创建sql类实例
const sqlUtil = new SqlUtil('user')
//创建dao
let dao = {}

/**
 * 注册用户
 * @param {Object} user
 */
dao.createUser = function(user) {
	return new Promise(function(resolve, reject) {
		sqlUtil.insert(user).then((result)=>{
			resolve(result);
		}).catch((error)=>{
			reject(error);
		})
	})
}

/**
 * 修改用户信息
 * @param {Object} user
 */
dao.modifyUser = function(user){
	return new Promise(function(resolve,reject){
		sqlUtil.update(user,'user_id').then((result)=>{
			resolve(result);
		}).catch((error)=>{
			reject(error);
		})
	})
}

/**
 * 删除用户信息
 */
dao.deleteUser = function(user_id){
	return new Promise(function(resolve,reject){
		sqlUtil.delete('user_id',user_id).then((result)=>{
			resolve(result);
		}).catch((error)=>{
			reject(error);
		})
	})
}

/**
 * 根据id查询用户
 */
dao.queryUserById = function(user_id){
	return new Promise(function(resolve,reject){
		sqlUtil.query('user_id',user_id).then((result)=>{
			resolve(result);
		}).catch((error)=>{
			reject(error);
		});
	})
}

/**
 * 根据手机号码查询用户
 */
dao.queryUserByPhone = function(user_phone){
	return new Promise(function(resolve,reject){
		sqlUtil.query('user_phone',user_phone).then((result)=>{
			resolve(result);
		}).catch((error)=>{
			reject(error);
		})
	})
}

/**
 * 多条件查询用户
 */
dao.queryUserByMore = function(options){
	return new Promise(function(resolve,reject){
		sqlUtil.querys(options).then((result)=>{
			resolve(result);
		}).catch((error)=>{
			reject(error);
		})
	})
}

/**
 * 多条件查询用户的总记录数
 * @param {Object} queryOptions
 */
dao.queryUserCounts = function(options){
	return new Promise(function(resolve,reject){
		sqlUtil.queryCounts(options).then((result)=>{
			resolve(result[0]['count(1)']);
		}).catch((error)=>{
			reject(error);
		})
	})
}


module.exports = dao
