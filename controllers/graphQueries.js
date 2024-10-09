// const {
//   GraphQLSchema,
//   GraphQLObjectType,
//   GraphQLString,
//   GraphQLBoolean,
//   GraphQLNonNull
// } = require('graphql');
// // Define the GraphQL query handler
// const { graphql } = require('graphql');

// import { ApolloServer } from 'apollo-server';
// import { typeDefs } from './schema.js';
// import { startStandaloneServer } from '@apollo/server/standalone';

// // Define the Passphrase type
// const graphQuery = async (req, res) => {
//   try {

// const resolvers = {
//   Query:{
//     Channels(){
//       return [{"title":"sicko"}]
//      }
//   }
// }

// const server = new ApolloServer({
//   typeDefs,
//   // resolvers 
// })

// const {url} = await startStandaloneServer(server, {
//   listen: {port: 14000}
// })




//     // Execute the query with the schema and resolvers
//     const response = await graphql(schema, query, null, null, variables);
//     console.log('GraphQL Response:', response);
    
//     res.json(response);
//   } catch (error) {
//     console.error('Error executing query:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };

// module.exports = graphQuery;
