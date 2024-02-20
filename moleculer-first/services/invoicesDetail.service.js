"use strict";

const DbMixin = require("../db/database.mixin");

/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

/** @type {ServiceSchema} */
module.exports = {
	name: "invoicesDetail",
	// version: 1

	/**
	 * Mixins
	 */
	mixins: [DbMixin("invoiceDetail")],

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

		create: {
			rest: "POST /",
			params: {
				productId: "number|integer|convert",
				invoiceId: "number|integer|convert",
				price: "number|positive|convert",
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
					service: "invoiceDetail",
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
				productId: "number|integer|convert|optional",
				invoiceId: "number|integer|convert|optional",
				price: "number|positive|optional",
			},

			async handler(ctx) {
				const updateValue = await this.adapter.findById(ctx.params.id);

				const { productId, invoiceId, price } = ctx.params;

				if (productId) updateValue.productId = productId;
				if (invoiceId) updateValue.invoiceId = invoiceId;
				if (price) updateValue.price = price;

				const doc = await this.adapter.updateById(ctx.params.id, {
					...updateValue,
				});

				const json = await this.transformDocuments(
					ctx,
					ctx.params,
					doc
				);
				await this.entityChanged("updated", json, ctx);

				this.broker.emit("entity.crud", {
					service: "invoiceDetail",
					method: "UPDATE",
					id: json.id,
				});

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
					service: "invoiceDetail",
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
