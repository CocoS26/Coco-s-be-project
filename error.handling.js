const { selectCategories, selectReviews,selectReviewsById } = require("./models/model");

const handle404paths = (req, res, next) => {
    res.status(404).send({ msg: 'path not found, soz!' });
};

const handleCustomErrors = (err, req, res, next) => {
    if (err.msg!==undefined) {
        res.status(err.status).send({ msg:err.msg });
    }else {
        next(err);
    }
  }
const handleSpecificErrors = (err, req, res, next) => {
    if (err.code ==='22P02') {
        res.status(400).send({ msg: 'Bad Request'});
    }else {
        next(err);
    }
  }


const handle500s = (err, req, res, next) =>{
    console.log(err);
    res
    .status(500)
    .send({msg:'internal server error'});
};


module.exports = {
    handle404paths,
    handleCustomErrors,
    handleSpecificErrors,
    handle500s,
}