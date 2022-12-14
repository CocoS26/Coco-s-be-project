const express = require('express');

const {
    handle404paths,
    handleCustomErrors,
    handleSpecificErrors,
    handle500s,
} = require('./error.handling.js');

const {
    getCategories, 
    getReviews,
    getReviewsById,
    getCommentsById,
    postCommentsById,
    patchReviews
} = require('./controllers/controller');

const app = express();

app.use(express.json()); 

app.get('/api/categories', getCategories);

app.get('/api/reviews', getReviews);

app.get('/api/reviews/:review_id', getReviewsById);

app.get('/api/reviews/:review_id/comments',getCommentsById);

app.post('/api/reviews/:review_id/comments', postCommentsById);

//app.patch('/api/reviews/:review_id', patchReviews);

app.all('*', handle404paths);

app.use(handleCustomErrors);

app.use(handleSpecificErrors);

app.use(handle500s);



module.exports = app;