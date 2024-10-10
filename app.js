const { config } = require("dotenv");
const sql = require('mysql2'); 
const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const typeDefs = require("./controllers/schema");
const cors = require("cors");
const { v4: uuidv4 } = require('uuid'); 
const SaveChannel = require("./controllers/saveChannel");
const findChannelByPassphrase = require("./controllers/findChannel");
const { createSecretSalt, GenerateRandomID, generateUserToken } = require("./controllers/saltAndToken");
const isHost = require("./controllers/isHost");
const { connectToDatabase } = require("./routes/db.config");

config();

try {
  // Initialize resolvers
  const resolvers = {
    Query: {
      Channels() {
        return {
          passphrase: [{ host: "localhost", view: "admin" }],
          channel: "1234",
          title: "sicko",
          pstn: [{ number: "123-456-7890", dtmf: "1", pin:"2"}]
        };
      },
      joinChannel: async (_, { passphrase }) => {
        try {
          const channel = await findChannelByPassphrase(passphrase);
          const userId = GenerateRandomID();

          if (!channel) {
            throw new Error('Channel not found');
          }

          return {
            token: channel.channel,
            channel: channel.channel,
            title: channel.title,
            uid: GenerateRandomID(),
            isHost: await isHost(passphrase),
            secret: channel.secret,
            rtmToken: channel.channel,
            screenShareUid: userId,
            screenShareToken: channel.screenShareRtcToken,
            chat: {
              groupId: channel.chatGroupId,
              userToken: generateUserToken(passphrase),
              isGroupOwner: channel.isGroupOwner,
            },
            uid: userId,
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
          return new Error('Failed to join channel: ' + error.message); // Return error to client
        }
      },
      getUser() {
        return {
          name: "owen",
          email: "bensonmichaelowen@gmail.com"
        };
      },
      share: async (_, { passphrase }) => {
        try {
          const channel = await findChannelByPassphrase(passphrase);
          if (!channel) {
            throw new Error('Channel not found');
          }
          return {
            passphrase: { host: channel.host, view: channel.view },
            channel: channel.channel,
            title: channel.title,
            pstn: { number: channel.pstn, dtmf: channel.dtmf }
          };
        } catch (error) {
          console.error("Error sharing channel:", error);
          return new Error('Failed to share channel: ' + error.message); // Return error to client
        }
      }
    },
    Mutation: {
      createChannel(_, { title, enablePSTN }) {
        try {
          const channelId = uuidv4();
          const hostId = uuidv4();
          const attendeeId = uuidv4();
          SaveChannel(title, enablePSTN, hostId, attendeeId, channelId);

          return {
            passphrase: { host: hostId, view: attendeeId, attendee: attendeeId },
            attendee: attendeeId,
            host: hostId,
            channel: channelId,
            title: title,
            pstn: enablePSTN ? [{ number: "123-456-7890", dtmf: "1", pin: "13" }] : [],
          };
        } catch (error) {
          console.error("Error creating channel:", error);
          return new Error('Failed to create channel: ' + error.message); // Return error to client
        }
      },
      updateUserName(_, { name }) {
        try {
          console.log(name);
          return { name: name, email: 'email@exmple.com' };
        } catch (error) {
          console.error("Error updating username:", error);
          return new Error('Failed to update username: ' + error.message); // Return error to client
        }
      }
    }
  };

  const server = new ApolloServer({
    typeDefs,
    resolvers
  });

  // Enable CORS for all origins
  const corsOptions = (origin, callback) => {
    const allowedOrigins = ['https://graph.asfischolar.com', 'http://localhost:9000', 'https://asfischolar.net', 'https://graph-endpoint.onrender.com'];
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  };

  async function startFunction() {
    const dbError = connectToDatabase();
    if (dbError) {
      console.error('Error connecting to the database:', dbError);
      throw new Error('Failed to connect to the database');
    }

    const { url } = await startStandaloneServer(server, {
      listen: { port: process.env.PORT || 14000, host: '0.0.0.0' },
      cors: corsOptions,
    });

    console.log(`Server listing on port ${process.env.PORT}`);
  }

  startFunction();

} catch (error) {
  console.error('Server startup error:', error);
  throw new Error('Server failed to start: ' + error.message); // Return error to client
}
