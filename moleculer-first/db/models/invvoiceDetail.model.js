const Sequelize = require("sequelize");

module.exports = {
	name: "invoiceDetail",
	define: {
		id: {
			type: Sequelize.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},

		productId: {
			type: Sequelize.INTEGER,
			references: {
				model: "products",
				key: "id",
			},
		},

		invoiceId: {
			type: Sequelize.INTEGER,
			references: {
				model: "invoices",
				key: "id",
			},
		},

		price: {
			type: Sequelize.INTEGER,
		},
	},
	options: {
		// Options from https://sequelize.org/docs/v6/moved/models-definition/
		modelName: "invoiceDetail",
	},
};
