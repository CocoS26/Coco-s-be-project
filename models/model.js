const db = require('../db/connection.js');

selectCategories = () => {
    return db.query("SELECT * FROM categories;")
    .then((results)=>{
        return results.rows;
    })
};
   
  

module.exports = { selectCategories }
