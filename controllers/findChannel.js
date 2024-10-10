const { db } = require("../routes/db.config");


async function findChannelByPassphrase(passphrase) {

  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM channels WHERE host = ? OR view = ?", [passphrase, passphrase], (err, data) => {
      if (err) {
        console.log(err);
        reject(err); // Reject the promise with the error
      } else {
        resolve(data[0]); // Resolve the promise with the first row of the result
      }
    });
  });
}



module.exports = findChannelByPassphrase