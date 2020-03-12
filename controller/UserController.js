//引入express模块
const express = require("express")
//创建路由器对象
var router = express.Router()
//引入JsonResult类
const JsonResult = require("../util/JsonResult")
//引入异常
const ServiceError = require("../error/ServiceError")
//引入业务类
const userService = require("../service/UserService")

//发送验证码
router.post("/sendMessage",(req,res,next)=>{
	var user_phone = req.body.user_phone;
	userService.sendMessage(req,res,next,{
		user_phone:user_phone
	})
})

//用户注册
router.post("/register",(req,res,next)=>{
	var user_phone = req.body.user_phone;//手机号
	var user_password = req.body.user_password;//密码
	var user_name = req.body.user_name;//用户昵称
	var user_code = req.body.user_code;//验证码
	var params = {
		user_phone:user_phone,
		user_password:user_password,
		user_name:user_name,
		user_code:user_code
	};
	userService.register(req,res,next,params);
})

//用户登录
router.post("/login",(req,res,next)=>{
	var user_phone = req.body.user_phone;//手机号
	var user_password = req.body.user_password;//密码
	var user_type = Number(req.body.user_type);//用户身份类型
	var params = {
		user_phone:user_phone,
		user_password:user_password,
		user_type:user_type
	}
	userService.login(req,res,next,params)
})

//验证码登录
router.post("/loginCode",(req,res,next)=>{
	var user_phone = req.body.user_phone;
	var user_code = req.body.user_code;
	var user_type = req.body.user_type;
	var params = {
		user_phone:user_phone,
		user_code:user_code,
		user_type:user_type
	}
	userService.loginCode(req,res,next,params)
})

module.exports = router
