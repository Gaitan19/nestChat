"use strict";

const DbMixin = require("../mixins/db.mixin");

/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

/** @type {ServiceSchema} */
module.exports = {
	name: "invoices",
	// version: 1

	/**
	 * Mixins
	 */
	mixins: [DbMixin("invoices")],

	/**
	 * Settings
	 */
	settings: {
		// Available fields in the responses
		fields: ["_id", "total"],

		// Validator for the `create` & `insert` actions.
		entityValidator: {
			total: "number|positive",
		},
	},

	/**
	 * Action Hooks
	 */
	hooks: {
		before: {
			/**
			 * Register a before hook for the `create` action.
			 * It sets a default value for the description field.
			 *
			 * @param {Context} ctx
			 */
		},
	},

	/**
	 * Actions
	 */
	actions: {
		/**
		 * The "moleculer-db" mixin registers the following actions:
		 *  - list
		 *  - find
		 *  - count
		 *  - create
		 *  - insert
		 *  - update
		 *  - remove
		 */
		// --- ADDITIONAL ACTIONS ---

		created: {
			rest: "POST /",
			params: {
				id: "number|integer|positive",
				total: "number|positive",
			},

			/** @param {Context} ctx */
			async handler(ctx) {
				const doc = await this.adapter.create({
					$inc: {
						_id: ctx.params.id,
						total: ctx.params.total,
					},
				});
				const json = await this.transformDocuments(
					ctx,
					ctx.params,
					doc
				);
				await this.entityChanged("created", json, ctx);

				return json;
			},
		},

		find: {
			rest: "GET /:id",
			params: {
				id: "any",
			},

			/** @param {Context} ctx */
			async handler(ctx) {
				const doc = await this.adapter.findById(
					parseInt(ctx.params.id, 10)
				);

				const json = await this.transformDocuments(
					ctx,
					ctx.params,
					doc
				);

				return json;
			},
		},

		update: {
			rest: "PATCH /:id",

			params: {
				id: "any",
				total: "number|positive",
			},

			async handler(ctx) {
				const doc = await this.adapter.updateById(
					parseInt(ctx.params.id, 10),
					{
						total: ctx.params.name,
					}
				);

				const json = await this.transformDocuments(
					ctx,
					ctx.params,
					doc
				);
				await this.entityChanged("updated", json, ctx);

				return json;
			},
		},

		delete: {
			rest: "DELETE /:_id",

			params: {
				_id: "any",
			},

			async handler(ctx) {
				const doc = await this.adapter.removeById(
					parseInt(ctx.params._id, 10)
				);

				const json = await this.transformDocuments(
					ctx,
					ctx.params,
					doc
				);
				await this.entityChanged("deleted", json, ctx);

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
		async seedDB() {
			await this.adapter.insertMany([
				{
					_id: 1,
					total: 704,
				},
				{
					_id: 2,
					total: 999,
				},
				{
					_id: 3,
					total: 679,
				},
			]);
		},
	},

	/**
	 * Fired after database connection establishing.
	 */
	async afterConnected() {
		// await this.adapter.collection.createIndex({ name: 1 });
	},
};
