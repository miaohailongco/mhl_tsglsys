/**
 * 租借记录试实体
 */
class Render {
	constructor(render_id,render_date,render_user,render_book,render_time) {
		this.render_id = render_id;
		this.render_date = render_date;
		this.render_user = render_user;
		this.render_book = render_book;
		this.render_time = render_time;
	}
	
}

module.exports = Render