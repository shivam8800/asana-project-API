

exports.up = function(knex, Promise) {
	return knex
		.schema
		.createTable('users', function( usersTable ){
			// primary key
			usersTable.increments('id').primary();
			//data
			usersTable.string( 'name', 50 ).notNullable();
			usersTable.string( 'username', 50 ).notNullable().unique();
            usersTable.string( 'email', 250 ).notNullable().unique();
            usersTable.string( 'password', 128 ).notNullable();
            usersTable.boolean( 'isAdmin' ).notNullable().defaultTo( false );
		})
		.createTable('tasks', function( tasksTable ){
			// primary key
			tasksTable.increments('id').primary();
			tasksTable.integer( 'userId', 20).unsigned().references( 'id' ).inTable('users');
			//data
			tasksTable.text( 'taskText').notNullable();
			//data timestamp
			tasksTable.timestamp( 'created_at' ).notNullable();
			tasksTable.date( 'dueDate' ).notNullable();
		})
		.createTable( 'collaborator', function( collaborat ){
			//primary key
			collaborat.increments('id').primary();
			//foreignkey connection
			collaborat.integer( 'userId1', 20).unsigned().references( 'id' ).inTable('users');
			collaborat.integer( 'taskId1', 20).unsigned().references( 'id' ).inTable('tasks');
			collaborat.integer( 'assignto', 20).unsigned().references( 'id' ).inTable('users');

		})
		.createTable( 'tasksComments', function( taskComment){
			//primary key
			taskComment.increments('id').primary();
			//foreignkey connection
			taskComment.integer( 'taskId', 20).unsigned().references( 'id' ).inTable('tasks');
			//data
			taskComment.text( 'commentText').notNullable();
			//date
			taskComment.timestamp( 'created_at' ).notNullable();
		})
		.createTable( 'nestedComment', function( nestedcomment){
			//primary key
			nestedcomment.increments('id').primary();
			nestedcomment.integer( 'taskCommentId', 20).unsigned().references( 'id' ).inTable('tasksComments');
			//data
			nestedcomment.text( 'nestedcommentText').notNullable();
			//date
			nestedcomment.timestamp( 'created_at' ).notNullable();
		});
  
};

exports.down = function(knex, Promise) {
	return knex
        .schema
        	.dropTableIfExists( 'nestedComment' )
        	.dropTableIfExists( 'tasksComments' )
        	.dropTableIfExists( 'collaborator' )
            .dropTableIfExists( 'tasks' )
            .dropTableIfExists( 'users' );
};
