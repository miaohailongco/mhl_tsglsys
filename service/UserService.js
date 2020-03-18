//引入连接池模块
const pool = require("../pool")
//dao
const userDao = require("../dao/UserDao")
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
const User = require("../entity/User")
//引入验证码
const SMSCode = require("../util/CodeSMS.js")
//引入验证码缓存
const SMSCache = require("../util/SMSCodeCache.js")
//引入分页对象
const PageObject = require("../util/PageObject.js")
//创建业务类
const service = {};

//注册业务
service.register = function(req,res,next,params){
	userDao.queryUserByPhone(params.user_phone).then((result)=>{
		if(result.length == 0){
			var user = new User(null,params.user_phone,md5(params.user_password),params.user_name,0,new Date(),new Date());
			userDao.createUser(user).then((result)=>{
				return res.json(new JsonResult(JsonResult.STATUS_SUCCESS,'ok'))
			}).catch((error)=>{
				next(error);
			})
		}else{
			throw new ServiceError('该手机号已被注册')
		}
	}).catch((error)=>{
		next(error);
	})
}

//登录业务
service.login = function(req,res,next,params){
	userDao.queryUserByPhone(params.user_phone).then((result)=>{
		if(result.length == 0){
			throw new ServiceError('该手机号未注册')
		}
		var user = result[0];
		if(user.user_password != md5(params.user_password)){
			throw new ServiceError('密码错误')
		}
		if(user.user_type != 1 && params.user_type == 1){
			throw new ServiceError('您不是管理员');
		}
		var u = {};
		Object.assign(u,user);
		var token =  jwt.getToken(u);
		return res.json(new JsonResult(JsonResult.STATUS_SUCCESS,'OK',{
			token:token,
			user:u
		}))
	}).catch((error)=>{
		next(error);
	})
}

//发送验证码
service.sendMessage = function(req,res,next,params){
	userDao.queryUserByPhone(params.user_phone).then((result)=>{
		if(result.length != 0){
			throw new ServiceError('该手机号已被注册')
		}
		var code = util.randomCheckCode();
		var sc = new SMSCode(params.user_phone,[code,2]);
		sc.send(function(error,res1,resData){
			if(error){
				next(new ServiceError('短信验证码发送失败'))
				return;
			}
			if(resData.result != 0){
				next(new ServiceError('短信验证码发送失败：验证码功能受限'));
				return;
			}
			SMSCache.set(params.user_phone,code);
			console.log(params.user_phone,code);
			return res.json(new JsonResult(JsonResult.STATUS_SUCCESS,'ok'));
		})
	}).catch((error)=>{
		next(error);
	})
}

//验证码登录
service.loginCode = function(req,res,next,params){
	userDao.queryUserByPhone(params.user_phone).then((result)=>{
		if(result.length == 0){
			throw new ServiceError('该手机号未注册')
		}
		var user = result[0];
		var user_phone = params.user_phone;
		console.log(params.user_code,SMSCache.get(user_phone));
		if(params.user_code != SMSCache.get(user_phone)){
			throw new ServiceError('验证码错误')
		}
		if(user.user_type != 1 && params.user_type == 1){
			throw new ServiceError('您不是管理员');
		}
		var u = {};
		Object.assign(u,user);
		var token =  jwt.getToken(u);
		return res.json(new JsonResult(JsonResult.STATUS_SUCCESS,'OK',{
			token:token,
			user:u
		}))
	}).catch((error)=>{
		next(error);
	})
}

//多条件查询用户
service.queryUser = function(req,res,next,params){
	var options = {
		user_phone:params.user_phone,
		user_name:params.user_name
	}
	if(params.user_type == 0 || params.user_type == 1){
		options.user_type = params.user_type
	}
	var pageObj = null;
	userDao.queryUserCounts(options).then((result)=>{
		if(result == 0){
			throw new ServiceError('暂无数据');
		}
		pageObj = new PageObject(params.startIndex,params.pageSize,result)
		options.order1 = 'user_id';
		options.order2 = 'asc';
		options.startIndex = params.startIndex;
		options.pageSize = params.pageSize;
		return userDao.queryUserByMore(options)
	}).then((result)=>{
		return res.json(new JsonResult(JsonResult.STATUS_SUCCESS,'OK',{
			pageObj:pageObj,
			users:result
		}))
	}).catch((error)=>{
		next(error);
	})
}

//根据id查询用户
service.queryUserById = function(req,res,next,params){
	var user_id = params.user_id;
	userDao.queryUserById(user_id).then((result)=>{
		return res.json(new JsonResult(JsonResult.STATUS_SUCCESS,'OK',result))
	}).catch((error)=>{
		next(error);
	})
}

//修改用户信息
service.modifyUser = function(req,res,next,params){
	var user_id = params.user_id;
	userDao.queryUserById(user_id).then((result)=>{
		var user = result[0];
		//根据手机号查询
		userDao.queryUserByPhone(params.user_phone).then((result)=>{
			console.log(result[0].user_id);
			if(result[0].user_id != user_id ){
				throw new ServiceError('该手机号已被注册，请修改为其他手机号')
			}else{
				user.user_phone = params.user_phone;
				user.user_name = params.user_name;
				user.user_type = params.user_type
				// console.log(user);
				userDao.modifyUser(user,'user_id').then((result)=>{
					return res.json(new JsonResult(JsonResult.STATUS_SUCCESS,'OK'))
				}).catch((error)=>{
					next(error);
				})
			}
		}).catch((error)=>{
			next(error);
		})
		
	})
}

//删除用户
service.deleteUser = function(req,res,next,params){
	var user_id = params.user_id;
	userDao.deleteUser(user_id).then((result)=>{
		return res.json(new JsonResult(JsonResult.STATUS_SUCCESS,'OK'))
	}).catch((error)=>{
		next(error);
	})
}

module.exports = service
