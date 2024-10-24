const { db } = require("../routes/db.config");


async function findChannelByPassphrase(passphrase) {
    
console.log(passphrase)
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM channels WHERE host = ? OR view = ?", [passphrase, passphrase], (err, data) => {
      if (err) {
        console.log(err);
        reject(false); // Reject the promise with the error
      } else {
        if(data[0]){
        resolve(data[0]); 
        }else{
        resolve(false);
      }
    }
    });
  });
}



module.exports = findChannelByPassphrase