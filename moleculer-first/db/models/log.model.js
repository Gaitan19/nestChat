const Sequelize = require("sequelize");
module.exports = {
	name: "log",
	define: {
		id: {
			type: Sequelize.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		description: {
			type: Sequelize.STRING,
		},
		date: {
			type: Sequelize.DATE,
		},
	},
	options: {
		// Options from https://sequelize.org/docs/v6/moved/models-definition/
		modelName: "log",
	},
};
