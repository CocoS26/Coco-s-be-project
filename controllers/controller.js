const{selectCategories, selectReviews, selectReviewsById,updateReviews,selectUsers} = require ('../models/model.js');
const { checkIfReviewIdExists } = require('../models/models.users.js');

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
    const {category, sort_by, order} = req.query
    selectReviews(category,sort_by, order)
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
const getUsers = (req, res, next) =>{
    selectUsers()
    .then((users)=>{
        res.status(200).send({users})
    })
    .catch((err)=>{
        next((err))
    })
}




module.exports = {
    getCategories,
    getReviews,
    getReviewsById,
    patchReviews,
    getUsers,
}
