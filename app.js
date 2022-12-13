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
} = require('./controllers/controller');

const app = express();



//1. Get /api/categories

app.get('/api/categories', getCategories);

app.get('/api/reviews', getReviews);

app.get('/api/reviews/:review_id', getReviewsById);

app.all('*', handle404paths);

app.use(handleCustomErrors);

app.use(handleSpecificErrors);

app.use(handle500s);



module.exports = app;