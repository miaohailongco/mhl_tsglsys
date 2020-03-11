//引入自定义的异常
const ServiceError = require("../error/ServiceError.js")
//引入工具类
const util = require("../util/util.js")
//引入sql操作
const SqlUtil = require("../util/SqlUtil")
//创建sql类实例
const sqlUtil = new SqlUtil('render')
//创建dao
let dao = {}

/**
 * 添加租借记录
 */
dao.addRender = function(render){
	return new Promise(function(resolve,reject){
		sqlUtil.insert(render).then((result)=>{
			resolve(result);
		}).catch((error)=>{
			reject(error);
		})
	})
}

/**
 * 删除租借记录
 */
dao.deleteRender = function(render_id){
	return new Promise(function(resolve,reject){
		sqlUtil.delete('render_id',render_id).then((result)=>{
			resolve(result);
		}).catch((error)=>{
			reject(error);
		})
	})
}

/**
 * 修改租借记录
 */
dao.modifyRender = function(render){
	return new Promise(function(resolve,reject){
		sqlUtil.update(render,'render_id').then((result)=>{
			resolve(result);
		}).catch((error)=>{
			reject(error);
		})
	})
}

/**
 * 根据id查询租借记录
 */
dao.queryRenderById = function(render_id){
	return new Promise(function(resolve,reject){
		sqlUtil.query('render_id',render_id).then((result)=>{
			console.log(render_id);
			resolve(result);
		}).catch((error)=>{
			reject(error);
		})
	})
}

/**
 * 多条件查询租借记录
 */
dao.queryRenderByMore = function(options){
	return new Promise(function(resolve,reject){
		sqlUtil.querys(options).then((result)=>{
			resolve(result);
		}).catch((error)=>{
			reject(error);
		})
	})
}

/**
 * 多条件查询租借记录总数
 */
dao.queryRenderConuts = function(options){
	return new Promise(function(resolve,reject){
		sqlUtil.queryCounts(options).then((result)=>{
			resolve(result[0]['count(1)']);
		}).catch((error)=>{
			reject(error);
		})
	})
}

module.exports = dao
