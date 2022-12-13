const express = require('express');

const {
    handle404paths,
    handle500s,
} = require('./error.handling.js');

const {
    getCategories, 
    getReviews,
} = require('./controllers/controller');

const app = express();

//1. Get /api/categories

app.get('/api/categories', getCategories);

app.get('/api/reviews', getReviews);

app.all('*', handle404paths);

app.use(handle500s);


module.exports = app;