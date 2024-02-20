"use strict";

const DbService = require("moleculer-db");
const SqlAdapter = require("moleculer-db-adapter-sequelize");
const DbConfig = require("./database.config");
const Models = require("./models/index");

module.exports = function (table) {
	const schema = {
		mixins: [DbService],
		adapter: new SqlAdapter(
			`mysql://${DbConfig.username}:${DbConfig.password}@${DbConfig.host}:${DbConfig.port}/${DbConfig.database}`
		),
		model: Models[table],
	};

	return schema;
};
