//引入连接池模块
const pool = require("../pool")
//dao
const bookTypeDao = require("../dao/BookTypeDao")
//引入JsonResult类
const JsonResult = require("../util/JsonResult")
//引入异常
const ServiceError = require("../error/ServiceError")
//引入md5
const md5 = require("md5-node")
//引入token工具
const jwt = require("../util/JwtToken")
//引入工具类
const util = require("../util/util")
//引入实体
const BookType = require("../entity/BookType")
//引入验证码
const SMSCode = require("../util/CodeSMS.js")
//引入验证码缓存
const SMSCache = require("../util/SMSCodeCache.js")
//引入分页对象
const PageObject = require("../util/PageObject.js")
//创建业务类
const service = {};

//多条件查询图书类型
service.queryBookType = function(req,res,next,params){
	var options = {
		bt_name:params.bt_name
	}
	var PageObj = null;
	bookTypeDao.queryBookTypeCounts(options).then((result)=>{
		if(result == 0){
			throw new ServiceError('暂无数据');
		}
		PageObj = new PageObject(params.startIndex,params.pageSize,result)
		options.order1 = 'bt_id';
		options.order2 = 'asc';
		options.startIndex = params.startIndex;
		options.pageSize = params.pageSize;
		return bookTypeDao.queryBookTypeByMore(options);
	}).then((result)=>{
		return res.json(new JsonResult(JsonResult.STATUS_SUCCESS,'OK',{
			pageObj:PageObj,
			bookTypes:result
		}))
	}).catch((error)=>{
		next(error);
	})
}

//删除书籍类型
service.deleteBookType = function(req,res,next,params){
	var bt_id = params.bt_id;
	bookTypeDao.deleteBookType(bt_id).then((result)=>{
		return res.json(new JsonResult(JsonResult.STATUS_SUCCESS,'OK'))
	}).catch((error)=>{
		next(error);
	})
}

//根据类型id查询类型
service.queryBookTypeById = function(req,res,next,params){
	var bt_id = params.bt_id;
	bookTypeDao.queryBookTypeById(bt_id).then((result)=>{
		return res.json(new JsonResult(JsonResult.STATUS_SUCCESS,'OK',result))
	}).catch((error)=>{
		next(error);
	})
}

//修改书籍类型
service.modifyBookType = function(req,res,next,params){
	var bt_id = params.bt_id;
	var bt_name = params.bt_name;
	bookTypeDao.queryBookTypeById(bt_id).then((result)=>{
		var bt = result[0];
		bt.bt_name = bt_name;
		bookTypeDao.modifyBookType(bt,'bt_id').then((result)=>{
			return res.json(new JsonResult(JsonResult.STATUS_SUCCESS,'OK'))
		}).catch((error)=>{
			next(error);
		})
	}).catch((error)=>{
		next(error);
	})
}

//添加书籍类型
service.addBookType = function(req,res,next,params){
	var bt_name = params.bt_name;
	var bt = new BookType(null,bt_name,new Date());
	bookTypeDao.addBookType(bt).then((result)=>{
		return res.json(new JsonResult(JsonResult.STATUS_SUCCESS,'OK'))
	}).catch((error)=>{
		next(error);
	})
}

module.exports = service