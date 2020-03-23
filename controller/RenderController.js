//引入express模块
const express = require("express")
//创建路由器对象
var router = express.Router()
//引入JsonResult类
const JsonResult = require("../util/JsonResult")
//引入异常
const ServiceError = require("../error/ServiceError")
//引入业务类
const renderService = require("../service/RenderService")

//多条件查询租借记录
router.post('/searchRenders',(req,res,next)=>{
	var render_user = Number(req.body.render_user);
	var render_book = Number(req.body.render_book);
	var render_state = req.body.render_state;
	var pageCurrent = Number(req.body.startIndex);
	var pageSize = Number(req.body.pageSize);
	var startIndex = (pageCurrent - 1) * pageSize;
	var params = {
		render_state:render_state,
		order1:'render_id',
		order2:'asc',
		startIndex:startIndex,
		pageSize:pageSize
	}
	if(render_user != 0){
		params.render_user = render_user;
	}else{
		params.render_user = '';
	}
	if(render_book != 0){
		params.render_book = render_book;
	}else{
		params.render_book = '';
	}
	renderService.queryRender(req,res,next,params)
})

//删除租借记录
router.post('/deleteRender',(req,res,next)=>{
	var render_id = req.body.render_id;
	renderService.deleteRender(req,res,next,{
		render_id
	})
})

//通过id查询租借记录
router.post('/searchRender',(req,res,next)=>{
	var render_id = req.body.render_id;
	renderService.searchRender(req,res,next,{
		render_id:render_id
	})
})

//修改租借记录
router.post('/modifyRender',(req,res,next)=>{
	var render_id = req.body.render_id;
	var render_time = req.body.render_time;
	var render_state = req.body.render_state;
	renderService.modifyRender(req,res,next,{
		render_id:render_id,
		render_time:render_time,
		render_state:render_state
	})
})

module.exports = router
