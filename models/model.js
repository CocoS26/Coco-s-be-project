const db = require('../db/connection.js');

selectCategories = () => {
    return db
    .query("SELECT * FROM categories;")
    .then((results)=>{
        return results.rows;
    })
};


selectReviews = (sort_by = 'created_at', order = 'desc') => {
    
// const validSortedByQueries = ['created_at'];
// const validOrderQueries = ['asc', 'desc'];

// if (!validSortedByQueries.includes(sort_by)) {
//     return Promise.reject({
//         status: 404,
//         msg: `No sort_by found`,
//       });
// }

// if(!validOrderQueries.includes(order)){
//     return Promise.reject({ status: 400, msg: 'Bad Request' })
// }

let queryString = `
SELECT owner,title,reviews.review_id,category,review_img_url,reviews.created_at,reviews.votes,designer,
COUNT(comment_id) AS comment_count
FROM reviews 
LEFT JOIN comments ON
reviews.review_id = comments.review_id
GROUP BY reviews.review_id
ORDER BY ${sort_by} ${order}
`;

return db
.query(queryString)
.then((results)=>{
    return results.rows;
})
};
  

module.exports = { 
    selectCategories,
    selectReviews 
}
