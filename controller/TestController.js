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

const md5 = require("md5-node")
//引入token工具
const jwt = require("../util/JwtToken")
//引入工具类
const util = require("../util/util")
//引入实体
const Render = require("../entity/Render")
//引入连接池模块
const pool = require("../pool")
//dao
const userDao = require("../dao/UserDao")
const bookDao = require("../dao/BookDao")
const bookTypeDao = require("../dao/BookTypeDao")
const renderDao = require("../dao/RenderDao")

router.post('/test',(req,res,next)=>{
	var options = {
		render_user:0
	}
	renderDao.queryRenderConuts(options).then((result)=>{
		return res.json(new JsonResult(JsonResult.STATUS_SUCCESS,'ok',result));
	}).catch((error)=>{
		next(error)
	})
})


module.exports = router