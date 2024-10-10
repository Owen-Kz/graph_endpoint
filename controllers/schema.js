const typeDefs = `#graphql

type PassphraseType {
  host: String,
  view: String
}

type PSTN {
  number: String,
  dtmf: String
  pin: String

}
type roomId{
  attendee: String
  host: String
}


type JoinChannelResponse {
  token: String
  channel: String
  title: String
  rtmToken: String
  uid: String
  screenShareUid: String
  screenShareToken: String
  isHost: Boolean
  secret: String
  chat: ChatInfo
  meetingTitle: String
  attendee: String
  host: String,
  secretSalt: String
  roomId:roomId
  mainUser: MainUserInfo
  whiteboard: WhiteboardInfo
  screenShare: ScreenShareInfo
  
}
type shareResponse {
  passphrase: PassphraseType
  channel: String
  title: String
  pstn:PSTN
  secretSalt: String
  mainUser: MainUserInfo
  whiteboard: WhiteboardInfo
  screenShare: ScreenShareInfo
}

type ChatInfo {
  groupId: String
  userToken: String
  isGroupOwner: Boolean
}

type MainUserInfo {
  rtc: String
  rtm: String
  uid: String
}

type WhiteboardInfo {
  room_uuid: String
  room_token: String
}

type ScreenShareInfo {
  rtc: String
  rtm: String
  uid: String
}



type Channel {
  passphrase: PassphraseType
  channel: String!
  title: String!
  attendee:String
  host: String
  pstn: PSTN
  secret: String
  chat: ChatInfo
  screenShare:ScreenShareInfo,
  whiteboard:WhiteboardInfo

}
type User{
  name: String! 
  email: String
}

type Query {
  Channels: Channel
  joinChannel(passphrase: String!): JoinChannelResponse
  share(passphrase: String!): shareResponse
  getUser : User
}

type Mutation {
  createChannel(title: String!, enablePSTN: Boolean): Channel,
  updateUserName(name:String!) : User

}




input createChannelInput {
  title: String!
  passphrase: PassphraseInput
  channel: String!
  pstn: PSTNInput
}

input PSTNInput {
  number: String
  dtmf: String
}

input PassphraseInput{
  host: String
  view: String
}
`;



module.exports = typeDefs