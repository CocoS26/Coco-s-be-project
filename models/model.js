const db = require('../db/connection.js');

selectCategories = () => {
    return db
    .query("SELECT * FROM categories;")
    .then((results)=>{
        return results.rows;
    })
};


selectReviews = (sort_by = 'created_at', order = 'desc') => {

let queryString = `
SELECT reviews.*, COUNT(comment_id) AS comment_count
FROM reviews 
LEFT JOIN comments ON
reviews.review_id = comments.review_id
GROUP BY reviews.review_id
`;

queryString += `ORDER BY ${sort_by} ${order};`;

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
