"use strict";

const DbMixin = require("../mixins/db.mixin");

/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

/** @type {ServiceSchema} */
module.exports = {
	name: "products",
	// version: 1

	/**
	 * Mixins
	 */
	mixins: [DbMixin("products")],

	/**
	 * Settings
	 */
	settings: {
		// Available fields in the responses
		fields: ["_id", "name", "description", "unitofmeasure", "price"],

		// Validator for the `create` & `insert` actions.
		entityValidator: {
			name: "string|min:3",
			description: "string|min:3",
			unitofmeasure: "string|min:1",
			price: "number|positive",
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
				name: "string|min:3",
				description: "string|min:3",
				unitofmeasure: "string|min:1",
				price: "number|positive",
			},

			/** @param {Context} ctx */
			async handler(ctx) {
				const doc = await this.adapter.create({
					$inc: {
						_id: ctx.params.id,
						name: ctx.params.name,
						description: ctx.params.description,
						unitofmeasure: ctx.params.unitofmeasure,
						price: ctx.params.price,
					},
				});
				const json = await this.transformDocuments(
					ctx,
					ctx.params,
					doc
				);
				await this.entityChanged("created", json, ctx);

				this.broker.emit("entity.crud", {
					service: "products",
					method: "POST",
					id: json._id,
				});

				return json;
			},
		},

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

		update: {
			rest: "PATCH /:id",

			params: {
				id: {
					type: "number",
					convert: true,
				},
				name: "string|min:3",
				description: "string|min:3",
				unitofmeasure: "string|min:1",
				price: "number|positive",
			},

			async handler(ctx) {
				const doc = await this.adapter.updateById(ctx.params.id, {
					name: ctx.params.name,
					description: ctx.params.description,
					unitofmeasure: ctx.params.unitofmeasure,
					price: ctx.params.price,
				});

				const json = await this.transformDocuments(
					ctx,
					ctx.params,
					doc
				);
				await this.entityChanged("updated", json, ctx);

				this.broker.emit("entity.crud", {
					service: "products",
					method: "UPDATE",
					id: json._id,
				});

				return json;
			},
		},

		delete: {
			rest: "DELETE /:_id",

			params: {
				_id: {
					type: "number",
					convert: true,
				},
			},

			async handler(ctx) {
				const doc = await this.adapter.removeById(ctx.params._id);

				const json = await this.transformDocuments(
					ctx,
					ctx.params,
					doc
				);
				await this.entityChanged("deleted", json, ctx);

				this.broker.emit("entity.crud", {
					service: "products",
					method: "DELETE",
					id: ctx.params._id,
				});

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
					name: "Samsung Galaxy S10 Plus",
					description: "nuevi",
					unitofmeasure: "gm",
					price: 704,
				},
				{
					_id: 2,
					name: "iPhone 11 Pro",
					description: "usado",
					unitofmeasure: "gm",
					price: 999,
				},
				{
					_id: 3,
					name: "Huawei P30 Pro",
					description: "de segunda",
					unitofmeasure: "gm",
					price: 679,
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
