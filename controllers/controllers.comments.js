const {selectCommentsById, insertsCommentsById,removeCommentById} = require ('../models/models.comments.js');
const { checkIfUserExists, checkIfReviewIdExists } = require('../models/models.users.js');
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



const deleteCommentById = (req, res, next) => {
    removeCommentById(req.params.comment_id)
    .then(()=> {
      res.sendStatus(204)
    })
    .catch((err)=>{
        next((err))
    })
  };


module.exports = {
    getCommentsById,
    postCommentsById,
    deleteCommentById,
}
