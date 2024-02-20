const Sequelize = require("sequelize");

module.exports = {
	name: "customer",
	define: {
		id: {
			type: Sequelize.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		name: {
			type: Sequelize.STRING,
		},
		lastName: { type: Sequelize.STRING },
		address: {
			type: Sequelize.STRING,
		},
		phone: {
			type: Sequelize.INTEGER,
		},
	},
	options: {
		// Options from https://sequelize.org/docs/v6/moved/models-definition/
		modelName: "customer",
	},
};
