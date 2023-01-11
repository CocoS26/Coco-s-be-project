const db = require('../db/connection.js');

selectCommentsById = (REVIEW_ID) => {
    let queryString = `
    SELECT * 
    FROM comments 
    WHERE review_id = $1
    ORDER BY created_at desc
    `;

    
    return db
        .query(queryString, [REVIEW_ID])
        .then((result) => {
            if (result.rowCount === 0) {
                return Promise.reject({ msg: 'Not Found', status: 404 })
            }
            return result.rows;
        })
};

insertsCommentsById = (REVIEW_ID, { username, body }) => {
    if (username === '' || body === '') {
        return Promise.reject({ status: 400, msg: 'Bad Request' })
    }


    const created_at = new Date(1511354613389)
    const vote = 0
    return db
        .query(`
            INSERT INTO comments (body, author, review_id, votes, created_at)
            VALUES ($1,$2,$3,$4,$5)
            RETURNING *;
            `,
            [body, username, REVIEW_ID, vote, created_at])
        .then((result) => {
            return result.rows[0]
        })
}


removeCommentById = (COMMENT_ID) => {
    return db
    .query (`
    DELETE FROM comments 
    WHERE comment_id = $1;`, [COMMENT_ID])
    .then((result) => {
        if (result.rowCount === 0) {
            return Promise.reject({ msg: 'Not Found', status: 404 })
        }
        return result.rows[0];
    })
};


module.exports ={
    selectCommentsById,
    insertsCommentsById,
    removeCommentById,
}