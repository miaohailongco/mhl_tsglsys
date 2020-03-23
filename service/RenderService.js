//引入连接池模块
const pool = require("../pool")
//dao
const renderDao = require("../dao/RenderDao")
const userDao = require("../dao/UserDao")
const bookDao = require("../dao/BookDao")
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
const Render = require("../entity/render.js")
//引入验证码
const SMSCode = require("../util/CodeSMS.js")
//引入验证码缓存
const SMSCache = require("../util/SMSCodeCache.js")
//引入分页对象
const PageObject = require("../util/PageObject.js")
//创建业务类
const service = {};

//多条件查询租借记录
service.queryRender = function(req,res,next,params){
	var options = {
		render_user:params.render_user,
		render_book:params.render_book,
	}
	if(params.render_state != -1){
		options.render_state = params.render_state
	}
	var pageObj = null;
	var renders = null;
	renderDao.queryRenderConuts(options).then((result)=>{
		if(result == 0){
			throw new ServiceError('暂无数据')
		}
		pageObj = new PageObject(params.startIndex,params.pageSize,result);
		options.order1 = 'render_id';
		options.order2 = 'asc';
		options.startIndex = params.startIndex;
		options.pageSize = params.pageSize;
		return renderDao.queryRenderByMore(options);
	}).then((result)=>{
		renders = result;
		var funs = [];
		renders.forEach((item,index)=>{
			funs.push(userDao.queryUserById(item.render_user));
		})
		return Promise.all(funs);
	}).then((result)=>{
		result.forEach((item,index)=>{
			renders[index].userName = item[0].user_name;
		})
		var funs = [];
		renders.forEach((item,index)=>{
			funs.push(bookDao.queryBookById(item.render_book));
		})
		return Promise.all(funs);
		//promise.all
	}).then((result)=>{
		// console.log(result);
		result.forEach((item,index)=>{
			renders[index].bookName = item[0].book_name;
		})
	}).then((result)=>{
		return res.json(new JsonResult(JsonResult.STATUS_SUCCESS,'OK',{
			pageObj:pageObj,
			renders:renders
		}))
	}).catch((error)=>{
		next(error);
	})
}

//删除租借记录
service.deleteRender = function(req,res,next,params){
	var render_id = params.render_id;
	renderDao.deleteRender(render_id).then((result)=>{
		return res.json(new JsonResult(JsonResult.STATUS_SUCCESS,'OK'))
	}).catch((error)=>{
		next(error);
	})
}

//根据租借id查询租借记录
service.searchRender = function(req,res,next,params){
	var render_id = params.render_id;
	renderDao.queryRenderById(render_id).then((result)=>{
		return res.json(new JsonResult(JsonResult.STATUS_SUCCESS,'OK',result))
	}).catch((error)=>{
		next(error);
	})
}

//修改租借记录
service.modifyRender = function(req,res,next,params){
	var render_id = params.render_id;
	var render_time = params.render_time;
	var render_state = params.render_state;
	renderDao.queryRenderById(render_id).then((result)=>{
		var render = result[0];
		if(!render_time){
			render.render_state = render_state;
		}else{
			render.render_time = render_time;
		}
		renderDao.modifyRender(render,'render_id').then((result)=>{
			return res.json(new JsonResult(JsonResult.STATUS_SUCCESS,'OK'))
		}).catch((error)=>{
			next(error);
		})
	}).catch((error)=>{
		next(error);
	})
}

module.exports = service