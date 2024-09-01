// backend function called via fetch:
// the structure of the function is company defined.

let data = [
	{},
	async function run(ctx) {
		const { obj1, obj2 } = ctx.request.body;
		const _ = require('lodash');
		data[0] = _.isEqual(obj1,obj2);
	}
];

module.exports = {
	data,
}