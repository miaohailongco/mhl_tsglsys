/**
 * 登录拦截器
 */
class LoginFilter {
	constructor() {
		this.routes = [
			'/api/user/login',
			'/api/user/register',
			'/api/user/sendMessage',
			'/api/user/loginCode'
		]
	}
	
	//用户登录路径拦截
	doFilter(route){
		if(this.routes.includes(route)){
			return false;//不需要登录		
		}else{
			return true;//需要登录
		}
	}
}

module.exports = new LoginFilter()