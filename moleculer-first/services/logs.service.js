"use strict";

const DbMixin = require("../db/database.mixin");

/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

/** @type {ServiceSchema} */
module.exports = {
	name: "logs",
	// version: 1

	/**
	 * Mixins
	 */
	mixins: [DbMixin("log")],

	/**
	 * Settings
	

	/**
	 * Action Hooks
	 */
	hooks: {
		before: {
			/**
			 * Register a before hook for the `create` action.
			 * It sets a default value for the quantity field.
			 *
			 * @param {Context} ctx
			 */
			// create(ctx) {
			// 	ctx.params.quantity = 0;
			// },
		},
	},

	/**
	 * Actions
	 */
	actions: {
		find: {
			rest: "GET /:id",
			params: {
				id: {
					type: "number",
					convert: true,
				},
			},

			/** @param {Context} ctx */
			async handler(ctx) {
				const doc = await this.adapter.findById(ctx.params.id);

				const json = await this.transformDocuments(
					ctx,
					ctx.params,
					doc
				);

				return json;
			},
		},
	},

	/**
	 * Methods
	 */
	methods: {
		/**
		 * Loading sample data to the collection.
		 * It is called in the DB.mixin after the database
		 * connection establishing & the collection is empty.
		 */
		// async seedDB() {
		// 	await this.adapter.insertMany([
		// 		{
		// 			service: "logs",
		// 			action: "POST",
		// 			message: "it was created the service logs",
		// 		},
		// 	]);
		// },
	},

	events: {
		"entity.crud": {
			async handler(ctx) {
				const { method, id, service } = ctx.params;
				await this.adapter.insert({
					description: `${service}: ${id} was ${method}${
						method === "POST" ? "ED" : "D"
					} `,
					date: Date.now(),
				});
			},
		},
	},

	/**
	 * Fired after database connection establishing.
	 */
	async afterConnected() {
		// await this.adapter.collection.createIndex({ name: 1 });
	},
};
