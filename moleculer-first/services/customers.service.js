"use strict";

const DbMixin = require("../mixins/db.mixin");

/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

/** @type {ServiceSchema} */
module.exports = {
	name: "customers",
	// version: 1

	/**
	 * Mixins
	 */
	mixins: [DbMixin("customers")],

	/**
	 * Settings
	 */
	settings: {
		// Available fields in the responses
		fields: ["_id", "name", "lastName", "address", "phone"],

		// Validator for the `create` & `insert` actions.
		entityValidator: {
			name: "string|min:3",
			lastName: "string|min:3",
			address: "string|min:3",
			phone: "number|integer|positive",
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

		created: {
			rest: "POST /",
			params: {
				id: "number|integer|positive",
				name: "string|min:3",
				lastName: "string|min:3",
				address: "string|min:3",
				phone: "number|integer|positive",
			},

			/** @param {Context} ctx */
			async handler(ctx) {
				const doc = await this.adapter.create({
					$inc: {
						_id: ctx.params.id,
						name: ctx.params.name,
						lastName: ctx.params.lastName,
						address: ctx.params.address,
						phone: ctx.params.phone,
					},
				});

				const json = await this.transformDocuments(
					ctx,
					ctx.params,
					doc
				);

				this.broker.emit("entity.crud", {
					service: "customer",
					method: "POST",
					id: json._id,
				});

				await this.entityChanged("created", json, ctx);

				return json;
			},
		},

		find: {
			rest: "GET /:id",
			params: {
				// id: "any",
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
				address: "string|min:3|optional",
				phone: "number|integer|positive|optional",
			},

			async handler(ctx) {
				const update = await this.adapter.findById(ctx.params.id);

				const { name, lastName, address, phone } = ctx.params;

				if (name) update.name = name;
				if (lastName) update.lastName = lastName;
				if (address) update.address = address;
				if (phone) update.phone = phone;

				console.log("update :>> ", update);

				const doc = await this.adapter.updateById(ctx.params.id, {
					...update,
				});

				const json = await this.transformDocuments(
					ctx,
					ctx.params,
					update
				);
				await this.entityChanged("updated", json, ctx);

				this.broker.emit("entity.crud", {
					service: "customer",
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
					service: "customer",
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
		async seedDB() {
			await this.adapter.insertMany([
				{
					_id: 1,
					name: "kevin",
					lastName: "gonzales",
					address: "managua",
					phone: 87549961,
				},
				{
					_id: 2,
					name: "manolo",
					lastName: "lopez",
					address: "granada",
					phone: 77144451,
				},
				{
					_id: 3,
					name: "luis",
					lastName: "hernandez",
					address: "leon",
					phone: 58083149,
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
