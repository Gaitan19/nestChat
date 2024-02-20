const Sequelize = require("sequelize");

module.exports = {
	name: "product",
	define: {
		id: {
			type: Sequelize.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		name: {
			type: Sequelize.STRING,
		},
		description: {
			type: Sequelize.STRING,
		},
		unitofmeasure: {
			type: Sequelize.STRING,
		},
		price: {
			type: Sequelize.INTEGER,
		},
	},
	options: {
		// Options from https://sequelize.org/docs/v6/moved/models-definition/
		modelName: "product",
	},
};
