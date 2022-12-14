const express = require('express');


const cors = require('cors');

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
    patchReviews,
    getUsers,
    
} = require('./controllers/controller');

const {
    getCommentsById,
    postCommentsById,
    deleteCommentById,
} = require('./controllers/controllers.comments');

const {getEndpoints} = require('./endpoints.js')

const app = express();

app.use(cors());

app.use(express.json()); 

app.get('/', (req, res) => {
    res.send('Hello my friends.')
})

app.get('/api', getEndpoints);

app.get('/api/categories', getCategories);

app.get('/api/reviews', getReviews);

app.get('/api/reviews/:review_id', getReviewsById);

app.get('/api/reviews/:review_id/comments',getCommentsById);

app.post('/api/reviews/:review_id/comments', postCommentsById);

app.patch('/api/reviews/:review_id', patchReviews);

app.delete('/api/comments/:comment_id',deleteCommentById)

app.get('/api/users', getUsers);

app.all('*', handle404paths);

app.use(handleCustomErrors);

app.use(handleSpecificErrors);

app.use(handle500s);



module.exports = app;