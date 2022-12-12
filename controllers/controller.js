const{selectCategories} = require ('../models/model.js');

const getCategories = (req, res) =>{
    selectCategories()
    .then((categories)=>{
        res.status(200).send({categories})
    })
}

module.exports = {getCategories}
