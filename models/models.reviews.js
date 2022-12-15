exports.checkIfValidSortedByQueries = (username)=>{
    return db.query(`
    SELECT * FROM users
    `,)
    .then (({result})=>{
        console.log(result)
        if (rowCount ===0 && username !==""){
            return Promise.reject({ status: 404, msg: 'Not Found' })
        }
        else{
            return true
        }
    })
}