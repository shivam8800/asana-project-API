import knex from './knex';
import jwt from 'jsonwebtoken';


// The idea here is simple: export an array which can be then iterated over and each route can be attached. 
const routes = [
    // for authenticate and get token for a particular user
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

    // create new user
    {
        path:'/createuser',
        method:'POST',
        handler: ( request, reply ) =>{
            const insertOperation = knex('users').insert({
                name:request.payload.name,
                username:request.payload.username,
                email:request.payload.email,
                password:request.payload.password,
                isAdmin:request.payload.isAdmin,
            }).then((res) => {
                reply({
                    data:res,
                    message: "successfully inserted !"
                });
            }).catch((err) => {
                reply("server-side error!");
            });
        }
    },
    // update the details of users
    {
      path:'/updateuser/{userid}',
      method:'PUT',
      config: {
            auth: {
                strategy: 'token',
            },
            pre: [
                {
                    method: (request, reply) => {
                        const {userid} = request.params;
                        // console.log(userid);
                        const getOperation = knex('users').where({
                            id:userid,
                        }).select('name').then(([result]) =>{
                            if (!result) {
                                reply({
                                    error: true,
                                    errMessage: `the user with id ${id} was not found`
                                }).takeover();
                            }
                            return reply.continue();
                        });
                    }
                }
            ],
        },
      handler: (request, reply) =>{
        const {userid} = request.params;
        // console.log(userid);
        // console.log(request.params);
        // console.log(request.payload);

        const insertOperation = knex('users').where({
            
                id:userid,
            
            }).update({

                name:request.payload.name,
                username:request.payload.username,
                email:request.payload.email,
                password:request.payload.password,
                isAdmin:request.payload.isAdmin,
            
            }).then((res) => {
            
                reply({
                    data:request.payload,
                    message:"successfully updated bird!"
                });
            
            }).catch((err) =>{
                reply("server side error!");
            });
      }  
    },
    // delete a user
    {
        method: 'DELETE',
        path: '/deleteuser/{id}',
        config: {
            auth: {
                strategy: 'token',
            },
            pre: [
                {
                    method: (request, reply) => {
                        const {id} = request.params;
                        // console.log(userid);
                        const getOperation = knex('users').where({
                            id:id,
                        }).select('name').then(([result]) =>{
                            if (!result) {
                                reply({
                                    error: true,
                                    errMessage: `the user with id ${id} was not found`
                                }).takeover();
                            }
                            return reply.continue();
                        });
                    }
                }
            ],
        },
      
        handler: function (request, reply) {
            const {id}=request.params;

            const deleteOperation = knex('users').where({
                
                    id:id,
                
                }).delete({
                    id:id
                     
                }).then((res) => {
                
                    reply({
                        message:"successfully deleted user!"
                    });
                
                }).catch((err) =>{
                    reply("server side error!");
                });

        }
    },
    // get all tasks of particular user 
    {
        method: 'GET',
        path: '/getusertasks/{id}',
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
    // post a task
    {
        path: '/createtask',
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
            
            // const guid = GUID.v4();
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
    // for update task
    {
        path:'/updatetask/{id}',
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
                                    errMessage: `the task with id ${id} was not found`
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
    },
    // delete particular task of a user
    {
        method: 'DELETE',
        path: '/deletetask/{userid}',
        config: {
            auth: {
                strategy: 'token',
            },
            pre: [
                {
                    method: (request, reply) => {
                        const {userid} = request.params;
                        const getOperation = knex('tasks').where({
                            id:userid,
                        }).select('taskText').then(([result]) =>{
                            if (!result) {
                                reply({
                                    error: true,
                                    errMessage: `the task with id ${id} was not found`
                                }).takeover();
                            }
                            return reply.continue();
                        });
                    }
                }
            ],
        },
        handler: function (request, reply) {
            const {userid}=request.params;

            const deleteOperation = knex('tasks').where({
                
                    id:userid,
                
                }).delete({
                    id:userid
                     
                }).then((res) => {
                
                    reply({
                        message:"successfully deleted task!"
                    });
                
                }).catch((err) =>{
                    reply("server side error!");
                });

        }
    },
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>all routes replated to collaborator table >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    // task assign to others
    {
        method:'POST',
        path:'/post/task/assignto/others/{taskid}',
        config: {
            auth:{
                strategy: 'token',
            }
        },
        handler: function(request, reply){
            var status;
            // console.log(request.payload.username);
            // for check assigned user in database
            const getOperation = knex('users').where({
                username:request.payload.username,
            }).select('id').then((result) => {
                if (!result || result.length === 0) {
                    reply({
                        status:"assigned user has not found!"
                    })
                }
                // console.log(result[0].id);
                // for insert data in database
                const insertOperation = knex('collaborator').insert({
                    userId1:request.auth.credentials.userid,
                    taskId1:request.params.taskid,
                    assignto:result[0].id,
                }).then((res) =>{
                    reply({
                        data:res,
                        message:"inserted successfully!"
                    });
                }).catch((err) =>{
                    reply("server side error");
                });

            });
        }
    },
    // get task which would assgin to others    
    {
        method:'GET',
        path:'/get/task/atoutboxof/jisne/task/assgin/kiyahai/{userid}',
        config:{
            auth:{
                strategy:'token'
            }
        },
        handler: (request, reply) =>{
            // console.log(request.params);
            const getOperation = knex('collaborator').join('tasks', "collaborator.userId1", '=', 'tasks.id').where({
                userId1:request.params.userid,
            }).select('tasks.userId', 'tasks.taskText','tasks.created_at','tasks.dueDate').then((result) =>{
                if(!result){
                    errMessage: `invalid userid`
                }
                reply({
                    data:result
                });
            }).catch((err) =>{
                reply("server-side error!");
            })
        }
    },
    // get task which would reciev by second user  
    {
        method:'GET',
        path:'/get/task/atinboxof/jisko/task/assgin/kiyahai/{userid}',
        config:{
            auth:{
                strategy:'token'
            }
        },
        handler: (request, reply) =>{
            // console.log(request.params);
            const getOperation = knex('collaborator').join('tasks', "collaborator.userId1", '=', 'tasks.id').where({
                assignto:request.params.userid,
            }).select('tasks.userId', 'tasks.taskText','tasks.created_at','tasks.dueDate').then((result) =>{
                if(!result){
                    errMessage: `invalid userid`
                }
                reply({
                    data:result
                });
            }).catch((err) =>{
                reply("server-side error!");
            })
        }
    },
    {
        method:'PUT',
        path:'/update/task/assignto/others/{taskid}',
        config: {
            auth:{
                strategy: 'token',
            },
            pre: [
                {
                    method: (request, reply) => {
                        // console.log(request.params.taskid);
                        const getOperation = knex('collaborator').where({
                            taskId1:request.params.taskid,
                        }).select('taskId1').then(([result]) =>{
                            if (!result) {
                                reply({
                                    error: true,
                                    errMessage: `the task with id ${id} was not found`
                                }).takeover();
                            }
                            else {
                                const checkRightToEdit = knex('collaborator').where({
                                    userId1:request.auth.credentials.userid,
                                }).select('taskId1').then((result) =>{
                                    if (!result) {
                                        reply({
                                            error: true,
                                            errMessage: 'the user has no right to edit task because he did not assign task!'
                                        }).takeover();
                                    }
                                    else{
                                        return reply.continue();
                                    }
                                });
                            }
                        });
                    }
                }
            ],
        },
        handler: function(request, reply){
            const insertOperation = knex('tasks').where({
            
                id:request.params.taskid,
            
            }).update({
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
    },
    // delete particular task of a user
    {
        method: 'DELETE',
        path: '/delete/task/assignto/others/{taskid}',
        config: {
            auth:{
                strategy: 'token',
            },
            pre: [
                {
                    method: (request, reply) => {
                        // console.log(request.params.taskid);
                        const getOperation = knex('collaborator').where({
                            taskId1:request.params.taskid,
                        }).select('taskId1').then(([result]) =>{
                            if (!result) {
                                reply({
                                    error: true,
                                    errMessage: `the task with id ${id} was not found`
                                }).takeover();
                            }
                            else {
                                const checkRightToEdit = knex('collaborator').where({
                                    userId1:request.auth.credentials.userid,
                                }).select('taskId1').then((result) =>{
                                    if (!result) {
                                        reply({
                                            error: true,
                                            errMessage: 'the user has no right to edit task because he did not assign task!'
                                        }).takeover();
                                    }
                                    else{
                                        return reply.continue();
                                    }
                                });
                            }
                        });
                    }
                }
            ],
        },
        handler: function (request, reply) {
            // const {userid}=request.params;

            const deleteOperation = knex('collaborator').where({
                
                    taskId1:request.params.taskid,
                
                }).delete({
                    taskId1:request.params.taskid
                     
                }).then((res) => {
                
                    reply({
                        message:"successfully deleted task!"
                    });
                
                }).catch((err) =>{
                    console.log(err);
                    reply("server side error!");
                });

        }
    },


    // .>>>>>>>>>>>>>>>>>>>>>>>>>> kisi bhi task ke uper comment ko create karne ke liye 
    {
        method: 'POST',
        path: '/createCommentOnTask/{userid}',
        config: {
            auth: {
                strategy: 'token',
            },
            pre:[
            {
                method: ( request, reply ) =>{
                    const { userid } = request.params
                    const getOperation = knex('tasks').where({
                        userid,
                    }).select('taskText').then((result) =>{
                        if (!result) {
                            reply({
                                error: true,
                                errMessage: 'there is no found any text'
                            }).takeover();
                        }
                        return reply.continue();
                    });
                }
            }
            ],
        },
        handler: function( request, reply ){
            const {userid} = request.params;
            // console.log(request.params.userid);
            const getOperation = knex('tasks').where({
                id:userid,
            }).select('userid').then((result) =>{
                if(!result || result.length === 0){
                    reply({
                        errMessage: 'there has no any user task',
                    })
                }
                const insertOperation = knex('tasksComments').insert({
                    taskId:request.params.userid,
                    commentText: request.payload.commentText,
                }).then((res) =>{
                    reply({
                        data: res,
                        message: 'inserted comment successfully'
                    });
                }).catch((err) =>{
                    console.log(err);
                    reply('server-side error');
                });
            });
        }   
    },

    // >>>>>>>>>>>>>>>>>>>>>>.......comment ko uski id se get karne ke liye
    {
        method: 'GET',
        path: '/getusercomment/{id}',
        handler: function(request, reply) {
            const { id } = request.params
            const getOperation = knex('tasksComments').where({
                taskId:id
            }).select('taskId', 'commentText', 'created_at').then((result) => {
                if (!result || result.length === 0) {
                    reply({
                        error: true,
                        errMessage: 'no comment has found',
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
    // >>>>>>>>>>>>>>>>>>>>>comment ko update karne ke liye
    {
        method: 'PUT',
        path: '/updateComment/{id}',
        config: {
            auth: {
                strategy: 'token',
            },
            pre: [
            {
                method: ( request, reply ) =>{
                    const {id} = request.params;
                    const getOperation = knex('tasksComments').where({
                        id:id,
                    }).select('commentText').then((result) =>{
                        if(!result) {
                            reply({
                                error: true,
                                errMessage: 'the task comment with id was not found'
                            }).takeover();
                        }
                        return reply.continue();
                    });
                }
            }
            ],
        },
        handler: ( request, reply ) =>{
            const insertOperation = knex('tasksComments').where({
                id: request.params.id,
            }).update({
                commentText: request.payload.commentText,
            }).then((res) =>{
                reply({
                    data: request.payload,
                    message: ('apka comment update ho gaya hai')
                });
    
            }).catch((err) =>{
                console.log(err);
                reply('server-side error');
            });
        } 
    },


    // >>>>>>>>>>>>>>>>> user ke comment ko delete karne ke liye task id se
    {
        method: 'DELETE',
        path: '/deleteUserComment/{taskid}',
        config: {
            auth: {
                strategy: 'token',
            },
            pre: [
                {
                    method: (request, reply) => {
                        const {taskid} = request.params;
                        const getOperation = knex('tasksComments').where({
                            id:taskid,
                        }).select('commentText').then(([result]) =>{
                            if (!result) {
                                reply({
                                    error: true,
                                    errMessage: 'yaha is id se koi bhi comment nahi hai'
                                }).takeover();
                            }
                            return reply.continue();
                        });
                    }
                }
            ],
        },
        handler: (request, reply) =>{
            const {taskid} = request.params;
            const deleteOperation = knex('tasksComments').where({
                id:taskid,
            }).delete({
                id:taskid
            }).then((res) =>{
                reply({
                    message: "apka comment delete ho gaya hai!"
                });
            }).catch((err) =>{
                console.log(err);
                reply('server-side error');
            });
        }
    },

// >>>>>>>>> comment ke uper comment karne ke liye yah code likah hai

    {
        method: 'POST',
        path: '/createNestedCommentOnComment/{taskid}',
        config: {
            auth: {
                strategy: 'token',
            },
            pre:[
            {
                method: ( request, reply ) =>{
                    const { taskid } = request.params
                    const getOperation = knex('tasksComments').where({
                        id:taskid,
                    }).select('commentText').then((result) =>{
                        if (!result) {
                            reply({
                                error: true,
                                errMessage: 'there is no found any text'
                            }).takeover();
                        }
                        return reply.continue();
                    });
                }
            }
            ],
        },
        handler: function( request, reply ){
            const {taskid} = request.params;
            const getOperation = knex('tasksComments').where({
                id:taskid,
            }).select('taskid').then((result) =>{
                if(!result || result.length === 0){
                    reply({
                        errMessage: 'there has no any comment text',
                    })
                }
                const insertOperation = knex('nestedComment').insert({
                    taskCommentId:request.params.taskid,
                    nestedcommentText: request.payload.nestedcommentText,
                }).then((res) =>{
                    reply({
                        data: res,
                        message: 'inserted nestedcomment successfully'
                    });
                }).catch((err) =>{
                    console.log(err);
                    reply('server-side error');
                });
            });
        }   
    },


    // >>>>>>>>>>>>>>>>>>>>>>> task id se user ke comment ko get karne ke liye
    {
        method: 'GET',
        path: '/getuserNestedcomment/{id}',
        handler: function(request, reply) {
            const { id } = request.params
            const getOperation = knex('nestedComment').where({
                taskCommentId:id
            }).select('taskCommentId', 'nestedcommentText', 'created_at').then((result) => {
                if (!result || result.length === 0) {
                    reply({
                        error: true,
                        errMessage: 'no nestedComment has found',
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


    // >>>>>>>>>>>>>>>>>>>>>> yah nested comment ko update karne ke liye hai 
    {
        method: 'PUT',
        path: '/updateNestedComment/{id}',
        config: {
            auth: {
                strategy: 'token',
            },
            pre: [
            {
                method: ( request, reply ) =>{
                    const {id} = request.params
                    const getOperation = knex('nestedComment').where({
                        id:id,
                    }).select('nestedcommentText').then((result) =>{
                        if(!result) {
                            reply({
                                error: true,
                                errMessage: 'the task nested comment with id was not found'
                            }).takeover();
                        }
                        return reply.continue();
                    });
                }
            }
            ],
        },
        handler: ( request, reply ) =>{
            console.log(request.params.id);
            const insertOperation = knex('nestedComment').where({
                id:request.params.id,
            }).update({
                nestedcommentText: request.payload.nestedcommentText,
            }).then((res) =>{
                reply({
                    data: request.payload,
                    message: ('apka nested comment update ho gaya hai')
                });
    
            }).catch((err) =>{
                console.log(err);
                reply('server-side error');
            });
        } 
    },
    // user k nested comment ko delete karne k liye ye code likha hia
    {
        method: 'DELETE',
        path: '/deleteUserNestedComment/{id}',
        config: {
            auth: {
                strategy: 'token',
            },
            pre: [
                {
                    method: (request, reply) => {
                        const {id} = request.params;
                        const getOperation = knex('nestedComment').where({
                            id:id,
                        }).select('nestedcommentText').then(([result]) =>{
                            if (!result) {
                                reply({
                                    error: true,
                                    errMessage: 'yaha is id se koi bhi nestedcomment nahi hai'
                                }).takeover();
                            }
                            return reply.continue();
                        });
                    }
                }
            ],
        },
        handler: (request, reply) =>{
            const {id} = request.params;
            const deleteOperation = knex('nestedComment').where({
                id:id,
            }).delete({
                id:id
            }).then((res) =>{
                reply({
                    message: "apka nestedcomment delete ho gaya hai!"
                });
            }).catch((err) =>{
                console.log(err);
                reply('server-side error');
            });
        }
    },



]
export default routes;