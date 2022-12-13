const app = require('../app.js')
const request = require('supertest');
const db = require('../db/connection.js');
const seed = require('../db/seeds/seed.js');
const testData = require('../db/data/test-data/index.js');


afterAll(() => {
  if (db.end) db.end();
});

beforeEach(() => seed(testData));

describe('GET non-existent route',()=>{
  test('404: non-existent route', ()=>{
      return request(app)
      .get('/api/category')
      .expect(404)
      .then(({body: {msg}})=>{
          expect(msg).toBe('path not found, soz!');
      })
  })
})

describe('GET / api/categories', () => {
  test("respond with a json object containing a key of `categories` with a value of an array of all the category objects", () => {
    return request(app)
      .get('/api/categories')
      .expect(200)
      .then(({ body }) => {
        const { categories } = body;
        expect(categories).toHaveLength(4);
        categories.forEach((category) => {
          expect(category).toMatchObject(({
            slug: expect.any(String),
            description: expect.any(String),
          })
          );
        });
      });
  });
});
describe('GET / api/reviews', () => {
  test("1. 200: resolves with reviews sorted by date in descending order", () => {
    return request(app)
      .get('/api/reviews')
      .expect(200)
      .then(({ body }) => {
        const { reviews } = body;
        expect(reviews).toHaveLength(13);
        expect(reviews).toBeSortedBy('created_at',{descending:true})
        reviews.forEach((review) => {
          expect(review).toMatchObject(({
          review_id: expect.any(Number),
          title: expect.any(String),
          category: expect.any(String),
          designer: expect.any(String),
          owner: expect.any(String),
          review_img_url: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          comment_count: expect.any(String)
          })
          );
        });
      });
  });
});



describe('GET / api/reviews/:review_id', () => {
  test("1. 200: responds with a single matching review ", () => {
    const REVIEW_ID = 2 
    return request(app)
      .get(`/api/reviews/${REVIEW_ID}`)
      .expect(200)
      .then(({ body }) => {
        const review  = body.review;
        expect(review).toMatchObject({
          review_id: 2,
          title: 'Jenga',
          designer: 'Leslie Scott',
          owner: 'philippaclaire9',
          review_img_url:'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
          review_body: 'Fiddly fun for all the family',
          category: 'dexterity',
          created_at: '2021-01-18T10:01:41.251Z',
          votes: 5
        });
      });
  });
  test("2. 404: responds with not found for non-existent review_id ", () => {
    return request(app)
      .get(`/api/reviews/20`)
      .expect(404)
      .then(({body: {msg} }) => {
        expect(msg).toBe('Not Found');
      });
  });
  test("3. 400: invalid review_id ", () => {
    return request(app)
      .get(`/api/reviews/a`)
      .expect(400)
      .then(({body: {msg} }) => {
      expect(msg).toBe('Bad Request')
      });
  });
});


describe('GET / api/reviews/:review_id/comments', () => {
  test("1. 200: responds with an array of comments for a specific review_id ", () => {
    const REVIEW_ID = 2 
    return request(app)
      .get(`/api/reviews/${REVIEW_ID}/comments`)
      .expect(200)
      .then((result) => {
        const comments  = result.body;
        expect(comments).toHaveLength(3);
        expect(comments).toBeSortedBy('created_at',{descending:true})
        comments.forEach((comment)=>{
           expect(comment).toMatchObject({
          review_id: 2,
          comment_id: expect.any(Number),
          votes: expect.any(Number),
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
        })
        });
      });
  });
  test("2. 200: responds with an empty array for an existent review_id that has no reviews", () => {
    const REVIEW_ID = 1 
    return request(app)
      .get(`/api/reviews/${REVIEW_ID}/comments`)
      .expect(200)
      .then((result) => {
        const comments  = result.body;
        expect(comments).toHaveLength(0);
      });
  });

  test("3. 404: responds with not found for non-existent review_id ", () => {
    return request(app)
      .get(`/api/reviews/14/comments`)
      .expect(404)
      .then(({body: {msg} }) => {
        expect(msg).toBe('Not Found');
      });
  });

  test("4. 400: invalid review_id ", () => {
    return request(app)
      .get(`/api/reviews/a/comments`)
      .expect(400)
      .then(({body: {msg} }) => {
      expect(msg).toBe('Bad Request')
      });
  });
});