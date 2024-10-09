const { db } = require("../routes/db.config.js");
export async function isHost(passphrase) {


    return new Promise((resolve, reject) => {
      db.query("SELECT * FROM channels WHERE host = ?", [passphrase], (err, data) => {
        if (err) {
          console.log(err);
          reject(err); // Reject the promise with the error
        } else {
            if(err){
                console.log(err)
                return false
            }else if(data[0]){
                console.log("IsHost")
                resolve(true); 
            }else{
                resolve(false); 
            }
          // Resolve the promise with the first row of the result
        }
      });
    });
}