// const PassphraseType = new GraphQLObjectType({
//     name: 'Passphrase',
//     fields: {
//       host: { type: GraphQLString },
//       view: { type: GraphQLString },
//     },
//   });
  
//   // Define the PSTN type
//   const PSTNType = new GraphQLObjectType({
//     name: 'PSTN',
//     fields: {
//       number: { type: GraphQLString },
//       dtmf: { type: GraphQLString },
//     },
//   });
  
//   // Define the Channel type
//   const ChannelType = new GraphQLObjectType({
//     name: 'Channel',
//     fields: {
//       passphrase: { type: PassphraseType },
//       channel: { type: GraphQLString },
//       title: { type: GraphQLString },
//       pstn: { type: PSTNType },
//     },
//   });
  
//   // Define the Mutation type
//   const MutationType = new GraphQLObjectType({
//     name: 'Mutation',
//     fields: {
//       createChannel: {
//         type: ChannelType,
//         args: {
//           title: { type: new GraphQLNonNull(GraphQLString) },
//           enablePSTN: { type: new GraphQLNonNull(GraphQLBoolean) },
//         },
//         resolve: (parent, args) => {
//           // Define the resolver for createChannel mutation
//           const { title, enablePSTN } = args;
  
//           return {
//             passphrase: {
//               host: `${title}_host_passphrase`,
//               view: `${title}_view_passphrase`,
//             },
//             channel: `${title}_channel`,
//             title,
//             pstn: enablePSTN
//               ? {
//                   number: '123456789',
//                   dtmf: 'example_dtmf',
//                 }
//               : null,
//           };
//         },
//       },
//     },
//   });
  
//   const resolvers = {
//     Query: {
//       createChannel() {
//         console.log("channels")
//       }
//     }
//   }
//   // Create the schema
//   const schema = new GraphQLSchema({
//     mutation: MutationType,
//   });
  
  
  
  
//     const query = req.body.query;
//     const variables = req.body.variables;
  
//     console.log('Received Query:', query);
//     console.log('Received Variables:', variables);