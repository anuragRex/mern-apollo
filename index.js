const { graphql, buildSchema } = require('graphql');

// Sample Database
const db = {
    users : [
        { id : '1', email : 'alex@gmail.com', name : 'Alex' },
        { id : '2', email : 'max@gmail.com', name : 'Max' }
    ]
}

const schema = buildSchema(`
    type Query {
        users : [User!]!
    }

    type User {
        id : ID!
        email : String!
        name : String
        avtarUrl : String
    }
`);

const rootValue = {
    //message : () => 'GraphQL works'
    users : () => db.users
}

graphql(
    schema,
    //query,
    `
        {
            users { 
                email
            }
        }
    
    `,
    rootValue
).then(
    //console.log
    res => console.dir(res, {depth : null})
).catch(
    console.error
)