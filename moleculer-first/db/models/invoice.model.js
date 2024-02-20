const Sequelize = require("sequelize");

module.exports = {
	name: "book",
	define: {
		id: {
			type: Sequelize.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},

		sellerId: {
			type: Sequelize.INTEGER,
			references: {
				model: "sellers",
				key: "id",
			},
		},

		customerId: {
			type: Sequelize.INTEGER,
			references: {
				model: "customers",
				key: "id",
			},
		},

		total: {
			type: Sequelize.INTEGER,
		},
	},
	options: {
		// Options from https://sequelize.org/docs/v6/moved/models-definition/
		modelName: "book",
	},
};
