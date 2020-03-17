//引入express模块
const express = require("express")
//创建路由器对象
var router = express.Router()
//引入JsonResult类
const JsonResult = require("../util/JsonResult")
//引入异常
const ServiceError = require("../error/ServiceError")
//引入业务类
const bookService = require("../service/BookService")

//添加书籍


//查询书籍
router.post("/searchBook",(req,res,next)=>{
	var book_name = req.body.book_name;
	var book_author = req.body.book_author;
	var book_company = req.body.book_company;
	var book_type = Number(req.body.book_type);
	var pageCurrent = Number(req.body.startIndex);
	var pageSize = Number(req.body.pageSize);
	var startIndex = (pageCurrent - 1) * pageSize;
	var params = {
		book_name:book_name,
		book_author:book_author,
		book_company:book_company,
		book_type:book_type,
		order1:'book_id',
		order2:'asc',
		startIndex:startIndex,
		pageSize:pageSize
	}
	bookService.queryBook(req,res,next,params)
})

//删除书籍
router.post("/deleteBook",(req,res,next)=>{
	var book_id = req.body.book_id;
	var params = {
		book_id:book_id
	}
	bookService.deleteBook(req,res,next,params);
})

//添加书籍
router.post('/addBook',(req,res,next)=>{
	var book_name = req.body.book_name;
	var book_author = req.body.book_author;
	var book_company = req.body.book_company;
	var book_company_date = new Date(req.body.book_company_date);
	var book_type = req.body.book_type;
	var book_counts = req.body.book_counts;
	var params = {
		book_name:book_name,
		book_author:book_author,
		book_company:book_company,
		book_company_date:book_company_date,
		book_type:book_type,
		book_counts:book_counts
	}
	bookService.addBook(req,res,next,params);
})






module.exports = router