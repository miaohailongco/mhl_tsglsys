/**
 * 图书实体
 */
class Book {
	
	constructor(book_id,book_name,book_author,book_company,book_company_date,book_type,book_in) {
		this.book_id = book_id;
		this.book_name = book_name;
		this.book_author = book_author;
		this.book_company = book_company;
		this.book_company_date = book_company_date;
		this.book_type = book_type;
		this.book_in = book_in;
	}
	
	
	
}

module.exports =  Book;