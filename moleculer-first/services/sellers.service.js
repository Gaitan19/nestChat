"use strict";

const DbMixin = require("../db/database.mixin");

/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

/** @type {ServiceSchema} */
module.exports = {
	name: "sellers",
	// version: 1

	/**
	 * Mixins
	 */
	mixins: [DbMixin("seller")],

	/**
	 * Settings
	 */

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
		/**
		 * Increase the quantity of the product item.
		 */

		create: {
			rest: "POST /",
			params: {
				name: "string|min:3",
				lastName: "string|min:3",
			},

			/** @param {Context} ctx */
			async handler(ctx) {
				const doc = await this.adapter.insert(ctx.params);
				const json = await this.transformDocuments(
					ctx,
					ctx.params,
					doc
				);
				await this.entityChanged("created", json, ctx);

				this.broker.emit("entity.crud", {
					service: "seller",
					method: "POST",
					id: json.id,
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
				name: "string|min:3|optional",
				lastName: "string|min:3|optional",
			},

			async handler(ctx) {
				const updatedValue = await this.adapter.findById(ctx.params.id);
				const { name, lastName } = ctx.params;

				if (name) updatedValue.dataValues.name = name;
				if (lastName) updatedValue.dataValues.lastName = lastName;

				const doc = await this.adapter.updateById(ctx.params.id, {
					...updatedValue.dataValues,
				});

				console.log("doc :>> ", doc);

				const json = await this.transformDocuments(
					ctx,
					ctx.params,
					doc
				);
				await this.entityChanged("updated", json, ctx);

				// this.broker.emit("entity.crud", {
				// 	service: "seller",
				// 	method: "UPDATE",
				// 	id: json.id,
				// });

				return json;
			},
		},

		delete: {
			rest: "DELETE /:id",

			params: {
				id: {
					type: "number",
					convert: true,
				},
			},

			async handler(ctx) {
				const doc = await this.adapter.removeById(ctx.params.id);

				const json = await this.transformDocuments(
					ctx,
					ctx.params,
					doc
				);
				await this.entityChanged("deleted", json, ctx);

				this.broker.emit("entity.crud", {
					service: "seller",
					method: "DELETE",
					id: ctx.params.id,
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
	},

	/**
	 * Fired after database connection establishing.
	 */
	async afterConnected() {
		// await this.adapter.collection.createIndex({ name: 1 });
	},
};
