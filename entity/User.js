/**
 * 用户实体
 */
class User {
	
	constructor(user_id,user_phone,user_password,user_name,user_type,user_login,user_register) {
		this.user_id = user_id;
		this.user_phone = user_phone;
		this.user_password = user_password;
		this.user_name = user_name;
		this.user_type = user_type;
		this.user_login = user_login;
		this.user_register = user_register;
	}
	
	
	
}

module.exports =  User;