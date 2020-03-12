/**
 * 发送短信验证码
 */
var QcloudSms = require("qcloudsms_js");
class CodeSMS {
	constructor(phoneNumber, params) {
		// 短信应用 SDK AppID
		this.appid = 1400306756;
		// 短信应用 SDK AppKey
		this.appkey = "3471e9b44a09ee793d3a368d1cd8f871";
		// 短信模板 ID，需要在短信控制台中申请
		this.templateId = 533934;
		// 签名，签名参数使用的是`签名内容`，而不是`签名ID`
		this.smsSign = "mvi网站";
		//需要发送短信的手机号码
		this.phoneNumber = phoneNumber;
		//发送的数据数组
		this.params = params;//验证码与过期时间
	}

	send(callback) {
		// 实例化 QcloudSms
		var qcloudsms = QcloudSms(this.appid, this.appkey);
		var ssender = qcloudsms.SmsSingleSender();
		ssender.sendWithParam("86", this.phoneNumber, this.templateId, this.params, this.smsSign, "", "", callback);
	}
}

module.exports = CodeSMS
