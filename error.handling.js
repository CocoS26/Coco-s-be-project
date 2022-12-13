const { selectCategories } = require("./models/model");

const handle404paths = (req, res, next) => {
    res.status(404).send({ msg: 'path not found, soz!' });
};

const handle500s = (err, req, res, next) =>{
    console.log(err);
    res
    .status(500)
    .send({msg:'internal server error'});
};


module.exports = {
    handle404paths,
    handle500s,
}