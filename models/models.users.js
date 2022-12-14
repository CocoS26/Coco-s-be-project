const db = require('../db/connection.js');

exports.checkIfReviewIdExists = (REVIEW_ID)=>{
    return db.query(`
    SELECT * FROM reviews
    `,)
    .then (({rowCount})=>{
        if (REVIEW_ID > rowCount ){
            return Promise.reject({ status: 404, msg: 'Not Found' })
        }
        else{
            return true
        }
    })
}

exports.checkIfUserExists = (username)=>{
    return db.query(`
    SELECT * FROM users WHERE username =$1
    `, [username])
    .then (({rowCount})=>{
        if (rowCount ===0 && username !==""){
            return Promise.reject({ status: 404, msg: 'Not Found' })
        }
        else{
            return true
        }
    })
}
