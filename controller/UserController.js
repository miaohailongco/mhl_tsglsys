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

//用户注册
router.post("/register",(req,res,next)=>{
	var user_phone = req.body.user_phone;//手机号
	var user_password = req.body.user_password;//密码
	var user_name = req.body.user_name;//用户昵称
	var params = {
		user_phone:user_phone,
		user_password:user_password,
		user_name:user_name
	};
	userService.register(req,res,next,params);
})

module.exports = router
