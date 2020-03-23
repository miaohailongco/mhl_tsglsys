
//引入express模块
const express = require("express");
//引入中间件
const bodyParser = require("body-parser");
//引入JsonResult类
const JsonResult = require("./util/JsonResult");
//引入工具类util
const util = require("./util/util");
const loginFilter = require("./util/LoginFilter")
//引入token工具
const jwt = require("./util/JwtToken");
//引入自定义的异常
const ServiceError = require("./error/ServiceError");
const TokenError = require("./error/TokenError");
//引入dao
const userDao = require("./dao/UserDao");
//引入setting系统配置
const setting = require("./util/set");

//创建web服务器
var server = express();
server.all("*", function(req, res, next) {
	//设置允许跨域的域名，*代表允许任意域名跨域
	res.setHeader("Access-Control-Allow-Origin", "*");
	//允许的header类型
	res.setHeader("Access-Control-Allow-Headers", "*");
	//跨域允许的请求方式 
	res.setHeader("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");
	if (req.method.toLowerCase() == 'options')
		res.send(200); //让options尝试请求快速结束
	else
		next();
});

//监听端口
server.listen(setting.port,'0.0.0.0');
//使用body-parser中间件
server.use(bodyParser.json({
	limit: '500mb'
}));
server.use(bodyParser.urlencoded({
	limit: '50mb',
	extended: true
}));


//请求拦截
server.use(function(req, res, next) {
	var url = req.originalUrl; //获取浏览器中当前访问的nodejs路由地址
	if (loginFilter.doFilter(url)) { //该地址需要用户token验证
		var token = req.headers['authorization'];
		if (token) {
			//解析token
			jwt.parseToken(token).then(function(result) {
				user_id = result.user_id;
				return userDao.queryUserById(user_id);
			}).then((result)=>{
				if(result.length == 0){
					next(new ServiceError('TOKEN已失效，请重新登录'));
				}else{
					next();
				}
			}).catch(function(error) {
				next(error);
			})
		} else {
			next(new TokenError('TOKEN已失效，请重新登录'));
		}
	} else {
		next();
	}
});
//引入测试
const TestController = require("./controller/TestController")
//引入controller目录下的js接口文件
const UserController = require("./controller/UserController")

const BookController = require("./controller/BookController")

const BookTypeController = require("./controller/BookTypeController")

const RenderControllor = require("./controller/RenderController")

//挂载路由器
server.use('/api/test',TestController);
server.use("/api/user",UserController);
server.use("/api/book",BookController);
server.use("/api/bookType",BookTypeController);
server.use("/api/render",RenderControllor);

//异常捕获
server.use(function(error, req, res, next) {
	console.log(error);
	if (error) {
		if (error.name == "ServiceError") {
			res.json(new JsonResult(JsonResult.STATUS_SERVICE_ERROR, error.message));
		} else if (error.name == "TokenError") {
			res.json(new JsonResult(JsonResult.STATUS_TOKEN_ERROR, error.message));
		} else {
			res.json(new JsonResult(JsonResult.STATUS_SERVICE_ERROR, "系统出现了一点小小的错误,请重新尝试"));
		}
	}
});


