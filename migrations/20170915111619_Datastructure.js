
exports.up = function(knex, Promise) {
  
  return knex
	  .schema
	  .createTable('users', function( usersTable ){

	  	//primary key
	  	usersTable.increments();

	  	//data
	  	usersTable.string('username', 50).notNullable().unique();
	  	usersTable.string('email', 250).notNullable().unique();
	  	usersTable.string('password', 150).notNullable().unique();

	  })
	  .createTable('tasks', function( tasksTable ){

	  	//primary key
	  	tasksTable.increments();
	  	//foreignkey connections
	  	tasksTable.string('userId').references('username').inTable('users');

	  	//data
	  	tasksTable.string('taskText', 1000).notNullable();
	  	//date timestamp
	  	tasksTable.timestamp('createdAt').notNullable();
	  	tasksTable.date('dueDate').notNullable();

	  })
	  .createTable('collaborator', function( collaborate ){

	  	//primary key
	  	collaborate.increments();
	  	//foreignkey connection
	  	collaborate.string('userId1', 50).references('email').inTable('users');
	  	collaborate.string('taskId1', 50).references('userId').inTable('tasks');

	  })
	  .createTable('taskscomments', function( tasksComments ){

	  	//primary key
	  	tasksComments.increments();
	  	//foreignkey connection
	  	tasksComments.string('taskId', 50).references('userId').inTable('tasks');

	  	//data
	  	tasksComments.string('commentText', 1000).notNullable();
	  	//date
	  	tasksComments.timestamp('createdAt').notNullable();

	  })
	  .createTable('nestedcomments', function( nestedComments ){

	  	//primary key
	  	nestedComments.increments();
	  	//foreignkey connection
	  	nestedComments.string('taskCommentId', 50).references('taskId').inTable('taskscomments');

	  	//data
	  	nestedComments.string('nestedCommentsText', 1000).notNullable();
	  	//date
	  	nestedComments.timestamp('createdAt').notNullable();

	  });
};

exports.down = function(knex, Promise) {
  	return knex
  	.schema
  		.dropTableIfExists('nestedcomments')
  		.dropTableIfExists('taskscomments')
  		.dropTableIfExists('collaborator')
  		.dropTableIfExists('tasks')
  		.dropTableIfExists('users');
};
