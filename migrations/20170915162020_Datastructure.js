
exports.up = function(knex, Promise) {
	return knex
		.schema
		.createTable('users', function( usersTable ){
			// primary key
			usersTable.increments();
			//data
			usersTable.string( 'name', 50 ).notNullable();
			usersTable.string( 'username', 50 ).notNullable().unique();
            usersTable.string( 'email', 250 ).notNullable().unique();
            usersTable.string( 'password', 128 ).notNullable();
		})
		.createTable('tasks', function( tasksTable ){
			// primary key
			tasksTable.increments();
			tasksTable.string( 'userId' ).references( 'username' ).inTable( 'users' );
			//data
			tasksTable.string( 'taskText', 1000 ).notNullable();
			//data timestamp
			tasksTable.timestamp( 'created_at' ).notNullable();
			tasksTable.date( 'dueDate' ).notNullable();
		})
		.createTable( 'collaborator', function( collaborat ){
			//primary key
			collaborat.increments();
			//foreignkey connection
			collaborat.string( 'userId1', 50 ).references( 'username' ).inTable( 'users' );
			collaborat.string( 'taskId1', 50 ).references( 'userId' ).inTable( 'tasks' );

		})
		.createTable( 'tasksComments', function( taskComment){
			//primary key
			taskComment.increments();
			//foreignkey connection
			taskComment.string( 'taskId', 50 ).references( 'userId' ).inTable('tasks');
			//data
			taskComment.string( 'commentText', 1000 ).notNullable();
			//date
			taskComment.timestamp( 'created_at' ).notNullable();
		})
		.createTable( 'nestedComment', function( nestedcomment){
			//primary key
			nestedcomment.string( 'taskCommentId', 50 ).references( 'taskId' ).inTable( 'tasksComments');
			//data
			nestedcomment.string( 'nestedcommentText', 1000).notNullable();
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
