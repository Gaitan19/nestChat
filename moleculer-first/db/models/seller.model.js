const Sequelize = require("sequelize");
module.exports = {
	name: "seller",
	define: {
		id: {
			type: Sequelize.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		name: {
			type: Sequelize.STRING,
		},
		lastName: {
			type: Sequelize.STRING,
		},
	},
	options: {
		// Options from https://sequelize.org/docs/v6/moved/models-definition/
		modelName: "seller",
	},
};
