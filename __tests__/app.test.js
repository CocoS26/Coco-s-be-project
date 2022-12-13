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

        expect(categories).toBeInstanceOf(Array);
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
  test("1. 200: resolve with reviews", () => {
    return request(app)
      .get('/api/reviews')
      .expect(200)
      .then(({ body }) => {
        const { reviews } = body;
        expect(reviews).toBeInstanceOf(Array);
        expect(reviews).toHaveLength(13);
        reviews.forEach((review) => {
          expect(review).toMatchObject(({
          review_id: expect.any(Number),
          title: expect.any(String),
          category: expect.any(String),
          designer: expect.any(String),
          owner: expect.any(String),
          review_body: expect.any(String),
          review_img_url: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          comment_count: expect.any(String)
          })
          );
        });
      });
  });
  test('2. 200: accepts sort_by query: should return created_at descending by default',()=>{
    return request(app)
    .get('/api/reviews?sort_by = created_at', order = 'desc')
    .expect(200)
    .then(({body:{reviews}})=>{
        expect(reviews).toBeSortedBy('created_at',{descending:true})
    });
});

});
