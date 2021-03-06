//引入连接池模块
const pool = require("../pool")
//dao
const bookDao = require("../dao/BookDao")
const bookTypeDao = require("../dao/BookTypeDao")
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
const Book = require("../entity/Book")
//引入验证码
const SMSCode = require("../util/CodeSMS.js")
//引入验证码缓存
const SMSCache = require("../util/SMSCodeCache.js")
//引入分页对象
const PageObject = require("../util/PageObject.js")
//创建业务类
const service = {};

//查询书籍
service.queryBook = function(req,res,next,params){
	var options = {
		book_name:params.book_name,
		book_author:params.book_author,
		book_company:params.book_company,
	}
	if(params.book_type != -1){
		options.book_type = params.book_type
	}
	var pageObj = null;
	var bookType = null;
	bookDao.queryBookCounts(options).then((result)=>{
		if(result == 0){
			throw new ServiceError('暂无数据');
		}
		pageObj = new PageObject(params.startIndex,params.pageSize,result);
		options.order1 = 'book_id';
		options.order2 = 'asc';
		options.startIndex = params.startIndex;
		options.pageSize = params.pageSize;
		return bookDao.queryBookByMore(options);
	}).then((result)=>{
		bookType = result;
		var funs = [];
		bookType.forEach((item,index)=>{
			funs.push(bookTypeDao.queryBookTypeById(item.book_type))
		})
		return Promise.all(funs)
	}).then((result)=>{
		result.forEach((item,index)=>{
			bookType[index].bookType = item[0].bt_name;
			// console.log(item[0].bt_name);
		})
		return bookType
	}).then((result)=>{
		return res.json(new JsonResult(JsonResult.STATUS_SUCCESS,'OK',{
			pageObj:pageObj,
			books:result
		}))
	}).catch((error)=>{
		next(error);
	})
}

//删除书籍
service.deleteBook = function(req,res,next,params){
	var book_id = params.book_id;
	bookDao.deleteBook(book_id).then((result)=>{
		return res.json(new JsonResult(JsonResult.STATUS_SUCCESS,'OK'))
	}).catch((error)=>{
		next(error);
	})
}

//添加书籍
service.addBook = function(req,res,next,params){
	var book = new Book(params.book_id,params.book_name,params.book_author,params.book_company,params.book_company_date,params.book_type,new Date(),params.book_counts);
	bookDao.addBook(book).then((result)=>{
		return res.json(new JsonResult(JsonResult.STATUS_SUCCESS,'添加成功'))
	}).catch((error)=>{
		next(error);
	})
}

//根据id查询书籍
service.queryBookById = function(req,res,next,params){
	var book_id = params.book_id;
	bookDao.queryBookById(book_id).then((result)=>{
		return res.json(new JsonResult(JsonResult.STATUS_SUCCESS,'OK',result))
	}).catch((error)=>{
		next(error);
	})
}

//修改书籍信息
service.modifyBook = function(req,res,next,params){
	var book_id = params.book_id;
	bookDao.queryBookById(book_id).then((result)=>{
		var book = result[0];
		book.book_name = params.book_name;
		book.book_author = params.book_author;
		book.book_company = params.book_company;
		book.book_company_date = params.book_company_date;
		book.book_type = params.book_type;
		book.book_counts = params.book_counts;
		bookDao.modifyBook(book,'book_id').then((result)=>{
			return res.json(new JsonResult(JsonResult.STATUS_SUCCESS,'OK'))
		}).catch((error)=>{
			next(error);
		})
	}).catch((error)=>{
		next(error);
	})
}

module.exports = service