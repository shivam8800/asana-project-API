export default require('knex')({
	client: 'mysql',
	connection:{
		host:'localhost',
		user:'root',
		password:'shivam@jaancrush',
		database:'asana',
		charset: 'utf8',
	}
});