import knex from './knex';
import jwt from 'jsonwebtoken';
import GUID from 'node-uuid'


// The idea here is simple: export an array which can be then iterated over and each route can be attached. 
const routes = [
    {
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
    },
    {
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
        }
    },
    {
        path: '/tasks',
        method: 'POST',
        config: {
            auth:{
                strategy: 'token',
            }
        },
        handler: (request, reply) => {

            // console.log(request.auth);
            const { task } = request.payload;
            // console.log(task);
            
            const guid = GUID.v4();
            // console.log(guid);

            const insertOperation = knex('tasks').insert({
                userId:request.auth.credentials.userid,
                taskText:request.payload.taskText,
                dueDate:request.payload.dueDate,
            }).then((res) =>{
                reply({
                    data:request.payload,
                    message:"inserted successfully!"
                });
            }).catch((err) =>{
                console.log(err);
                reply("server side error");
            });
        }
    },
    {
        path:'/task/{id}',
        method:'PUT',
        config: {
            auth: {
                strategy: 'token',
            },
            pre: [
                {
                    method: (request, reply) => {
                        const {id} = request.params;
                        const getOperation = knex('tasks').where({
                            id:id,
                        }).select('taskText').then(([result]) =>{
                            if (!result) {
                                reply({
                                    error: true,
                                    errMessage: `the bird with id ${id} was not found`
                                }).takeover();
                            }
                            return reply.continue();
                        });
                    }
                }
            ],
        },
        handler: (request, reply) =>{
            // console.log(request.payload);
            // console.log(request.params);
            const insertOperation = knex('tasks').where({
            
                id:request.params.id,
            
            }).update({

                userId:request.params,
                taskText:request.payload.taskText,
                dueDate:request.payload.dueDate
            
            }).then((res) => {
            
                reply({
                    data:request.payload,
                    message:"successfully updated bird!"
                });
            
            }).catch((err) =>{
                reply("server side error!");
            });

        }
    }
]
export default routes;