const{selectCategories, selectReviews, selectReviewsById,selectCommentsById} = require ('../models/model.js');

const getCategories = (req, res, next) =>{
    selectCategories()
    .then((categories)=>{
        res.status(200).send({categories})
    })
    .catch((err)=>{
        next((err))
    })
}

const getReviews = (req, res, next) =>{
    selectReviews()
    .then((reviews)=>{
        res.status(200).send({reviews})
    })
    .catch((err)=>{
        next((err))
    })
}
const getReviewsById = (req, res, next) =>{
    selectReviewsById(req.params.review_id)
    .then((review)=>{
        res.status(200).send({review})
    })
    .catch((err)=>{
        next((err))
    })
}

const getCommentsById = (req, res, next) =>{
    selectCommentsById(req.params.review_id)
    
    .then((review)=>{
        res.status(200).send(review)
    })
    .catch((err)=>{
        next((err))
    })
}


module.exports = {
    getCategories,
    getReviews,
    getReviewsById,
    getCommentsById,
}
