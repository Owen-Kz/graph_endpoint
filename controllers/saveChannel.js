const { db } = require("../routes/db.config.js"); // Use require instead of import
const { createSecretSalt, GenerateRandomID, generateUserToken } = require("./saltAndToken.js"); // Use require instead of import


export function SaveChannel(title, pstn, host, attendee, channel){
    const secretSalt = createSecretSalt()
    const rtcToken = generateUserToken(channel)
    const rtmToken = generateUserToken(channel)
    db.query("INSERT INTO channels SET ?", [{title:title,channel_secret:channel, pstn:pstn, host:host, view:attendee, channel:channel,
    secret: secretSalt,
    mainUserRTCToken: rtcToken,
    mainUserRtmToken: rtmToken,
    whiteboardRoomUUid:channel,
    whiteboardRoomToken:channel,
    screenShareRtcToken:rtcToken,
    screenShareRtmToken:rtmToken,
    screenShareUid: GenerateRandomID(),
    }], async (err, inserted) =>{
        if(err){
            console.log(err)
            return false
        }else{
            return true
        }
    })
}