"use strict";

const DbMixin = require("../mixins/db.mixin");

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
	mixins: [DbMixin("logs")],

	/**
	 * Settings
	 */
	settings: {
		// Available fields in the responses
		fields: ["_id", "description", "date"],

		// Validator for the `create` & `insert` actions.
		entityValidator: {
			description: "string|min:3",
			date: "date",
		},
	},

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
				id: "any",
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
			// Register handler to the "other" group instead of "payment" group.
			async handler(ctx) {
				const { method, id, service } = ctx.params;
				const date = new Date();
				await this.adapter.insert({
					description: `${service}: ${id} was ${method}${
						method === "POST" ? "ED" : "D"
					} `,
					date: Date.now(),
				});

				console.log("ctx :>> ", ctx.params);
				// console.log("Payload:", ctx.params);
				// console.log("Sender:", ctx.nodeID);
				// console.log("Metadata:", ctx.meta);
				// console.log("The called event name:", ctx.eventName);
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
