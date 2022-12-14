const{selectCategories, selectReviews, selectReviewsById,selectCommentsById, insertsCommentsById,updateReviews} = require ('../models/model.js');
const { checkIfUserExists, checkIfReviewIdExists } = require('../models/models.users.js');

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
    checkIfReviewIdExists(req.params.review_id)
    .then(()=>{
        return selectCommentsById(req.params.review_id)
    })
    .then((review)=>{
        res.status(200).send(review)
    })
    .catch((err)=>{
        next((err))
    })
}
const postCommentsById = (req, res, next) =>{
    checkIfUserExists(req.body.username)
    .then(()=>{
        return insertsCommentsById(req.params.review_id,req.body)
    })
    .then((review)=>{
        res.status(201).send(review)
    })
    .catch((err)=>{
        next((err))
    })
}

const patchReviews  = (req, res, next) =>{
    checkIfReviewIdExists(req.params.review_id)
    .then(()=>{
    return updateReviews(req.params.review_id,req.body)
    })
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
    postCommentsById,
    patchReviews,
}
