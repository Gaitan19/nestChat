const Sequelize = require("sequelize");

module.exports = {
	name: "book",
	define: {
		id: {
			type: Sequelize.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		title: {
			type: Sequelize.STRING,
		},
		authorId: {
			type: Sequelize.INTEGER,
			references: {
				model: "authors",
				key: "id",
			},
		},
	},
	options: {
		// Options from https://sequelize.org/docs/v6/moved/models-definition/
		modelName: "book",
	},
};
