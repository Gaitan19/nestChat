const authorModel = require("./author.model");
const bookModel = require("./book.model");
const customerModel = require("./customer.model");
const sellerModel = require("./seller.model");
const productModel = require("./product.model");
const invoiceModel = require("./invoice.model");
const invoiceDetailModel = require("./invvoiceDetail.model");
const logModel = require("./log.model");

module.exports = {
	author: authorModel,
	book: bookModel,
	customer: customerModel,
	seller: sellerModel,
	product: productModel,
	invoice: invoiceModel,
	invoiceDetail: invoiceDetailModel,
	log: logModel,
};
