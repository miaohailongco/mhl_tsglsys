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
//创建业务类
const service = {};

//注册业务
service.register = function(req,res,next,params){
	var user = new User(null,params.user_phone,md5(params.user_password),params.user_name,0,new Date(),new Date());
	userDao.createUser(user).then((result)=>{
		return res.json(new JsonResult(JsonResult.STATUS_SUCCESS,'ok'))
	}).catch((error)=>{
		next(error);
	})
}

module.exports = service
