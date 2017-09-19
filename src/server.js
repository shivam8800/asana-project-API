import Hapi from 'hapi';

const server = new Hapi.Server();

server.connection({
	port: 8000
});

server.route({
	method: 'GET',
	path: '/hello/{userName}',
	handler: ( request, reply) =>{
	reply('Hello World '+ request.params.userName + '!');
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
