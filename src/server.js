import Hapi from 'hapi';
import knex from './knex';
import jwt from 'jsonwebtoken';

const server = new Hapi.Server();

server.connection({
	port: 8000
});

server.register( require( 'hapi-auth-jwt' ), ( err ) => {
    server.auth.strategy( 'token', 'jwt', {

        key: 'vZiYpmTzqXMp8PpYXKwqc9ShQ1UhyAfy',

        verifyOptions: {
            algorithms: [ 'HS256' ],
        }

    } );

} );

server.route({
<<<<<<< HEAD
	method: 'GET',
	path: '/hello/{userName}',
	handler: ( request, reply) =>{
	reply('Hello World '+ request.params.userName + '!');
=======
	method: 'POST',
	path: '/auth',
	handler: ( request, reply) =>{

		const { username, password } = request.payload;

		const getOperation = knex('users').where({
			username,
		}).select('password', 'id').then( ( [user] ) =>{

			if( !user ) {
				reply( {
		            error: true,
		            errMessage: 'the specified user was not found',
		        } );

		        return;
		    }

		    if ( user.password == password ){
		    	const token = jwt.sign({
		    		username,
		    		userid:user.id,

		    	},'vZiYpmTzqXMp8PpYXKwqc9ShQ1UhyAfy', {
		    		algorithm: 'HS256',
        			expiresIn: '1h',
		    	});

		    	 reply( {

			        token,
			        userid: user.id,
			    } );
		    } else {
		    	reply('incorrect password');
		    }

		}).catch((err) =>{
			reply('server side error');

		});

	}
});

server.route({
	method: 'GET',
	path: '/usertask/{id}',
	handler: function(request, reply) {
		const { id } = request.params
		const getOperation = knex('tasks').where({
			userId:id
		}).select('taskText', 'created_at', 'dueDate').then((result) => {
			if (!result || result.length === 0) {
		        reply({
		            error: true,
		            errMessage: 'no task has found',
		        });
			}
			reply({
				data:result,
			});

		}).catch((err) => {
			console.log(err);
			reply('server-side error');
		});
>>>>>>> 73d13d6d50c5df272a41f977a3ff611bda5e50a1
	}
});

server.start(err => {

    if (err) {

        // Fancy error handling here
        console.error( 'Error was handled!' );
        console.error( err );

    }

    console.log( `Server started at ${ server.info.uri }` );

});
