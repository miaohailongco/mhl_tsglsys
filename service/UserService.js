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



module.exports = service
