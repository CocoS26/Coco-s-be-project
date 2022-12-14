const db = require('../db/connection.js');
const format = require('pg-format');

selectCategories = () => {
    return db
        .query("SELECT * FROM categories;")
        .then((results) => {
            return results.rows;
        })
};

selectReviews = () => {

    let queryString = `
SELECT owner,title,reviews.review_id,category,review_img_url,reviews.created_at,reviews.votes,designer,
COUNT(comment_id) AS comment_count
FROM reviews 
LEFT JOIN comments ON
reviews.review_id = comments.review_id
GROUP BY reviews.review_id
ORDER BY created_at desc
`;

    return db
        .query(queryString)
        .then((results) => {
            return results.rows;
        })
};

selectReviewsById = (REVIEW_ID) => {
    return db
        .query("SELECT * FROM reviews WHERE review_id = $1;", [REVIEW_ID])
        .then((result) => {
            if (result.rowCount === 0) {
                return Promise.reject({ msg: 'Not Found', status: 404 })
            }
            return result.rows[0];
        })
};

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
            if (result.rowCount === 0 && REVIEW_ID > 13) {
                return Promise.reject({ msg: 'Not Found', status: 404 })
            }
            return result.rows;
        })
};


    insertsCommentsById = (REVIEW_ID, { username, body }) => {


    validUsername = ['dav3rid', 'philippaclaire9', 'bainesface', 'mallionaire']

    if (username === '' || body === '') {
        
        return Promise.reject({ status: 400, msg: 'Bad Request' })
    }

    if (!validUsername.includes(username)) {
    return Promise.reject({
        status: 404,
        msg: `No sort_by found`,
    });
        
    }
  

    const created_at = new Date(1511354613389)
       
    const vote = 0
    return db
        .query(`
            INSERT INTO comments (body, author, review_id, votes, created_at)
            VALUES ($1,$2,$3,$4,$5)
            RETURNING *;
            `, 
            [body, username, REVIEW_ID, vote,created_at])

        .then((result) => {
            return result.rows[0]
        })
   
}







module.exports = {
    selectCategories,
    selectReviews,
    selectReviewsById,
    selectCommentsById,
    insertsCommentsById,
}
