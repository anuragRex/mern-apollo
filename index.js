const express = require('express');
const app = express();
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');
const crypto = require('crypto');


const db = {
    users : [
        { id : '1', email : 'alex@gmail.com', name : 'Alex', avtarUrl : 'https://navtar.com/alex'},
        { id : '2', email : 'max@gmail.com', name : 'Max', avtarUrl : 'https://navtar.com/max'}
    ],
    messages : [
        {id : '1', userId : '1', body : 'Heyyy', createdAt : Date.now()},
        {id : '2', userId : '2', body : 'Hello', createdAt : Date.now()},
        {id : '3', userId : '1', body : 'what\'s up', createdAt : Date.now()},
    ]
}

class User {
    constructor(user){
        Object.assign(this, user)
    }
    
    messages () {
        return db.messages.filter(message => message.userId === this.id);
    }
}


const schema = buildSchema(`
    type Query {
        users : [User!]!
        user(id : ID!) : User
        messages : [Message!]!
    }

    type Mutation {
        addUser(email : String!, name : String, ) : User
    }

    type User {
        id : ID!
        email : String!
        name : String
        avtarUrl : String
        messages : [Message!]!
    }

    type Message {
        id : ID!
        userId : ID!
        body : String!
        createdAt : String
    }
`);

const rootValue = {
    users : () => db.users.map(user => new User(user)),
    messages : () => db.messages,
    addUser : ({ name, email}) => {
        const user = {
            id : crypto.randomBytes(10).toString('hex'),
            name,
            email,
            avtarUrl : 'https://navtar.com/...'
        }

        db.users.push(user);
        return user;
    },
    user : args => db.users.find(el => el.id === args.id)
}


app.use('/graphql', graphqlHTTP({
    schema,
    rootValue,
    graphiql : true
}));

app.listen(4000, () => console.log('listening on 4000'));