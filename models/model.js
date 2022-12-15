const db = require('../db/connection.js');


selectCategories = () => {
    return db
        .query("SELECT * FROM categories;")
        .then((results) => {
            return results.rows;
        })
};

selectReviews = (category, sort_by= 'created_at', order='desc') => {

    const validSortedByQueries = ['review_id', 'title', 'category', 'designer', 'owner', 'review_img_url', 'created_at' ] 
    const validCategories = [ 'euro game','social deduction','dexterity',"children's games"]
    const validOrderQueries = ['asc', 'desc']
    
    if (!validSortedByQueries.includes(sort_by)) {
        return Promise.reject({
            status: 400,
            msg: 'Bad Request',
          });
    }

    if(!validOrderQueries.includes(order)){
        return Promise.reject({ status: 400, msg: 'Bad Request' })
    }

    

let queryString = `
SELECT owner,title,reviews.review_id,category,review_img_url,reviews.created_at,reviews.votes,designer,
COUNT(comment_id) AS comment_count
FROM reviews 
LEFT JOIN comments ON
reviews.review_id = comments.review_id
`;
let queryValues = []
if (validCategories.includes(category)){
    queryString += ` WHERE category = $1`
    queryValues.push(category)
}else if (category &&!validCategories.includes(category) ){
    return Promise.reject({ status: 404, msg: 'Not Found' })
}
queryString += `
GROUP BY reviews.review_id
ORDER BY ${sort_by} ${order}
;`;


return db
.query(queryString, queryValues)
.then((result)=>{
    return result.rows
})
   
};

selectReviewsById = (REVIEW_ID) => {
    return db
        .query(`
        SELECT reviews.*,
        COUNT (comments.review_id) AS comment_count
        FROM reviews 
        LEFT OUTER JOIN comments ON reviews.review_id = comments.review_id
        WHERE reviews.review_id = $1
        GROUP BY reviews.review_id
        
        `, [REVIEW_ID])
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



    updateReviews = (REVIEW_ID, {inc_votes}) => {
        if (inc_votes === '' || REVIEW_ID === '') {
            return Promise.reject({ status: 400, msg: 'Bad Request' })
        }
        return db
        .query(`
        UPDATE reviews 
        SET votes = votes + $2
        WHERE review_id =$1 
        RETURNING * ;`, [REVIEW_ID,inc_votes])
        .then((results) => {
            return results.rows[0];
        })

       
};

 selectUsers = () => {
    return db
        .query("SELECT * FROM users;")
        .then((results) => {
            return results.rows;
        })
};

removeCommentsById = (COMMENT_ID) => {
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




    module.exports = {
        selectCategories,
        selectReviews,
        selectReviewsById,
        selectCommentsById,
        insertsCommentsById,
        updateReviews,
        selectUsers,
        removeCommentsById,
    }
