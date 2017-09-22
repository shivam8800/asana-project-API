export default require('knex')({
	client: 'mysql',
	connection:{
		host:'localhost',
		user:'root',
		password:'aslam@desusa',
		database:'asanaproject',
		charset: 'utf8',
	}
});