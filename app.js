const { config } = require('dotenv');
const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const { typeDefs } = require('./controllers/schema.js');
const cors = require('cors');
const { SaveChannel } = require('./controllers/saveChannel.js');
const { v4: uuidv4 } = require('uuid'); 
const { findChannelByPassphrase } = require('./controllers/findChannel.js');
const { createSecretSalt, GenerateRandomID, generateUserToken } = require('./controllers/saltAndToken.js');
const { isHost } = require('./controllers/isHost.js');

config();
  try {

    const resolvers = {
      Query: {
        Channels() {
          return {
            passphrase: [{ host: "localhost", view: "admin" }], // Example data
            channel: "1234",
            title: "sicko",
            pstn: [{ number: "123-456-7890", dtmf: "1", pin:"2"}], // Example data
          };
        },
        joinChannel: async (_, { passphrase }) => {
          try {
            const channel = await findChannelByPassphrase(passphrase); // Replace with real logic
            const userId = GenerateRandomID()

            if (!channel) {
              throw new Error('Channel not found');
            }
            return {
              token: channel.channel,
              channel: channel.channel,
              title: channel.title,
              uid: GenerateRandomID(),
              isHost: await isHost(passphrase),  // Determine if the user is host based on your logic
              secret: channel.secret,
              rtmToken: channel.channel,
              screenShareUid: userId,
              screenShareToken: channel.screenShareRtcToken,
              chat: {
                groupId: channel.chatGroupId,
                userToken: generateUserToken(passphrase), // Replace with your logic
                isGroupOwner: channel.isGroupOwner,
              }, 
              uid:userId,
              secretSalt: channel.secret,
              mainUser: {
                rtc: channel.mainUserRTCToken,
                rtm: channel.mainUserRtmToken,
                uid: channel.mainUserUid,
              },
              pstn: {
                number: "52535",
                dtmf: "43",
                pin:"1"
              },
       
              meetingTitle: channel.title,
              attendee: channel.view,
              host: channel.host,
              roomId: {
                attendee: channel.view,
                host: channel.host,
              },
              whiteboard: {
                room_uuid: channel.whiteboardRoomUuid,
                room_token: channel.whiteboardRoomToken,
              },
              screenShare: {
                rtc: channel.screenShareRtcToken,
                rtm: channel.screenShareRtmToken,
                uid: channel.screenShareUid,
              },
              roomInfo: {
                isJoinDataFetched: false,
                isInWaitingRoom: false,
                waitingRoomStatus: "",
                isWhiteBoardOn: true,
                sttLanguage: null,
                isSTTActive: false,
                data: {
                  isHost: await isHost(passphrase),
                  meetingTitle: channel.title,
                  roomId: {
                    attendee: channel.view,
                  },
                  isSeparateHostLink: true,
                },
                roomPreference: {
                  disableShareTile: false,
                },
              },
            };
          } catch (error) {
            console.error("Error joining channel:", error);
            throw new Error('Failed to join channel');
          }
        },
        getUser() {
          return {
            name: "owen",
            email :"bensonmichaelowen@gmail.com"
          }
        },

        share: async (_, {passphrase}) => {
          console.log("ShareChannel")

          const channel = await findChannelByPassphrase(passphrase); // Replace with real logic
          if (!channel) {
            throw new Error('Channel not found');
          }
          return {
            passphrase:  {   
              host:channel.host,
              view: channel.view
              },
             channel: channel.channel,  
             title: channel.title,   
             pstn: {     
              number: channel.pstn,  
              dtmf:channel.dtmf,   
            },
            }
            }
      },
      Mutation: {
        createChannel(_, { title, enablePSTN }) {
          const channelId = uuidv4()
          const hostId = uuidv4()
          const attendeeId = uuidv4()
          SaveChannel(title, enablePSTN, hostId, attendeeId, channelId)
          // Logic to handle creating the channel would go here
          return {
            passphrase: { // Wrap passphrase in an array
              host: `${hostId}`,
              view: `${attendeeId}`,
              attendee: `${attendeeId}`
            },
            attendee: attendeeId,
            host: hostId,
            channel: `${channelId}`,  // You might want to generate or assign a real channel ID
            title: title,      // Use the title passed from the mutation
            pstn: enablePSTN ? [  // Return PSTN info conditionally based on enablePSTN
              {
                number: "123-456-7890",
                dtmf: "1",
                pin:"13"
              },
            ] : [],
          };
        },
        updateUserName(_, {name}) {
          console.log(name);   
        return {
          name: name,
          email: 'email@exmple.com',
        };
      },
   
    }
    }
    

const server = new ApolloServer({
  typeDefs,
  resolvers 
})

  // Enable CORS for all origins
  const corsOptions = (origin, callback) => {
    const allowedOrigins = ['https://graph.asfischolar.com', 'http://localhost:9000', 'https://asfischolar.net', 'https://graph-endpoint.onrender.com']; // Add other origins as needed
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true); // Allow request
    } else {
      callback(new Error('Not allowed by CORS')); // Reject request
    }
  };
  

async function StartServerFUNCTION(){
  const { url } = await startStandaloneServer(server, {
    listen: { port: process.env.PORT || 14000, host: '0.0.0.0' },
    cors: corsOptions, // Add CORS options here
  });
}

StartServerFUNCTION()

console.log("Server Listing on port", process.env.PORT)




    // // Execute the query with the schema and resolvers
    // const response = await graphql(schema, query, null, null, variables);
    // console.log('GraphQL Response:', response);
    
    // res.json(response);
  } catch (error) {
    console.error('Error executing query:', error);
    
  }

