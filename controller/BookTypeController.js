//引入express模块
const express = require("express")
//创建路由器对象
var router = express.Router()
//引入JsonResult类
const JsonResult = require("../util/JsonResult")
//引入异常
const ServiceError = require("../error/ServiceError")
//引入业务类
const bookTypeService = require("../service/BookTypeService")

//多条件查询书籍类型
router.post('/searchTypes',(req,res,next)=>{
	var bt_name = req.body.bt_name;
	var pageCurrent = Number(req.body.startIndex);
	var pageSize = Number(req.body.pageSize);
	var startIndex = (pageCurrent - 1) * pageSize;
	var params = {
		bt_name:bt_name,
		order1:"user_id",
		order2:"asc",
		startIndex:startIndex,
		pageSize:pageSize
	}
	bookTypeService.queryBookType(req,res,next,params)
})

//删除书籍类型
router.post('/deleteBookType',(req,res,next)=>{
	var bt_id = req.body.bt_id;
	bookTypeService.deleteBookType(req,res,next,{bt_id})
})

//根据类型id查询书籍类型
router.post('/searchType',(req,res,next)=>{
	var bt_id = req.body.bt_id;
	bookTypeService.queryBookTypeById(req,res,next,{
		bt_id:bt_id
	})
})

//修改类型名称
router.post('/modifyType',(req,res,next)=>{
	var bt_id = req.body.bt_id;
	var bt_name = req.body.bt_name;
	var params = {
		bt_id:bt_id,
		bt_name:bt_name
	}
	bookTypeService.modifyBookType(req,res,next,params)
})

//添加书籍类型
router.post('/addType',(req,res,next)=>{
	var bt_name = req.body.bt_name;
	bookTypeService.addBookType(req,res,next,{
		bt_name:bt_name
	})
})

module.exports = router