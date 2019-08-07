/* 
* GraphQL with APOLLO-SERVER way
*/

const { ApolloServer, gql } = require('apollo-server');
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

const typeDefs = gql`
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
`;

const resolvers = {
    Query : {
        users : () => db.users,
        messages : () => db.messages,
        user : (root, { id }) => db.users.find(el => el.id === id)
    },
    
    Mutation : {
        addUser : (root, { name, email}) => {
            const user = {
                id : crypto.randomBytes(10).toString('hex'),
                name,
                email,
                avtarUrl : 'https://navtar.com/...'
            }
    
            db.users.push(user);
            return user;
        }
    },
    User : {
        messages : root => db.messages.filter(message => message.userId === root.id) // here root will be a user
    }
};

// spinning up a server
/* const server = new ApolloServer({
    typeDefs,
    resolvers
}); */

// Mocking the response
const server = new ApolloServer({ typeDefs, mocks : true });

server.listen()
    .then(({ url }) => console.log(url))
    .catch(ex => console.log(ex));