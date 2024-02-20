const authorModel = require("./author.model");
const bookModel = require("./book.model");
const customerModel = require("./customer.model");
const sellerModel = require("./seller.model");
const productModel = require("./product.model");

module.exports = {
	author: authorModel,
	book: bookModel,
	customer: customerModel,
	seller: sellerModel,
	product: productModel,
};
