const setting = require("./util/set.js");
const mysql = require("mysql");
//创建连接池对象
var pool = mysql.createPool({
	host : setting.ip,
	port : "3306",
	user : "root",
	password : "mhl130125",
	database : "mhl_tsgl",
	connectionLimit : 15
});

//导出连接池
module.exports = pool;

