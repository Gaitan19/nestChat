const authorModel = require("./author.model");
const bookModel = require("./book.model");
const customerModel = require("./customer.model");
const sellerModel = require("./seller.model");

module.exports = {
	author: authorModel,
	book: bookModel,
	customer: customerModel,
	seller: sellerModel,
};
