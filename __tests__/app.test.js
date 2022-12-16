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

describe('GET /api', () => {
  test('200: responds with object of different endpoints', () => {
      return request(app)
      .get('/api')
      .expect(200)
      .then(({body}) => {
          expect(body).toBeInstanceOf(Object)
      })
  })
});

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

test("2. 200: resolves with reviews sorted by date in descending order by default", () => {
  return request(app)
    .get('/api/reviews')
    .expect(200)
    .then(({ body }) => {
      const { reviews } = body;
      expect(reviews).toBeSortedBy('created_at',{descending:true})
    });
});

test("3. 400: send a non-existent column to sort by", () => {
  return request(app)
    .get('/api/reviews?sort_by=vote; DROPTABLES')
    .expect(400)
    .then(({body:{msg}})=>{
        expect(msg).toBe('Bad Request');
    });
});
test("4. 200: accept category query", () => {
  return request(app)
    .get('/api/reviews?category=euro game')
    .expect(200)
      .then(({body:{reviews}})=>{
      expect(reviews).toHaveLength(1);
        })
});
test("5. 200 - accepts a valid sort by query", () => {
  return request(app)
    .get('/api/reviews?sort_by=title')
    .expect(200)
    .then(({ body }) => {
      const { reviews } = body;
      expect(reviews).toBeSortedBy('title',{descending:true})
    });
})
test("6. 200 - accepts a valid order query", () => {
  return request(app)
    .get('/api/reviews?order=asc')
    .expect(200)
    .then(({ body }) => {
      const { reviews } = body;
      expect(reviews).toBeSortedBy('created_at',{asc:false})
    });
})
test("7. 400 - invalid order query", () => {
  return request(app)
    .get('/api/reviews?order=ascending')
    .expect(400)
    .then(({body: {msg} }) => {
    expect(msg).toBe('Bad Request')
    });
})
test("8. 404 - non existent category", () => {
  return request(app)
    .get('/api/reviews?category=CocoS26')
    .expect(404)
    .then(({body: {msg} }) => {
    expect(msg).toBe('Not Found')
    });
})
test("9. 200 -  valid category query but no reviews attached to it, ", () => {
  return request(app)
    .get("/api/reviews?category=children's games")
    .expect(200)
      .then(({ body }) => {
        const review  = body.reviews;
        expect(review).toMatchObject([])
    });
})
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
  test("4. 200: includes comment_count ", () => {
    const REVIEW_ID = 2 
    return request(app)
    .get(`/api/reviews/${REVIEW_ID}`)
    .expect(200)
      .then(({ body }) => {
        const review  = body.review;
        expect(review).toMatchObject({
         comment_count: '3'
        });
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

describe('POST / api/reviews/:review_id/comments', () => {
  test('1. status:201, responds with comments newly added to the database', () => {
    const newComment = {
      username: "dav3rid",
      body: "This is a great game!"
    };
    const REVIEW_ID = 2
    return request(app)
    .post(`/api/reviews/${REVIEW_ID}/comments`)
      .send(newComment)
      .expect(201)
      .then(( result ) => {
        expect(result.body).toMatchObject({
          author: "dav3rid",
          body: "This is a great game!",
          review_id: 2,
          comment_id: 7,
          votes:0,
          created_at: "2017-11-22T12:43:33.389Z",
        })
        });
      });

  test('2. status:400, when a key is null', () => {
    const newComment = {
      username: "",
      body: ""
    }
    const REVIEW_ID = 2 
    return request(app)
      .post(`/api/reviews/${REVIEW_ID}/comments`)
      .send(newComment)
      .expect(400)
      .then((response) => {
        const msg = response.body.msg
        expect(msg).toBe('Bad Request')
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
    test("4. 201: extra keys in the request object should be ignored", () => {
      const REVIEW_ID = 2
      const newComment = {
        username: "dav3rid",
        body: "This is a great game!",
        age: 25
      };
      return request(app)
        .post(`/api/reviews/${REVIEW_ID}/comments`)
        .expect(201)
        .send(newComment)
        .then(( result ) => {
          expect(result.body).toMatchObject({
            author: "dav3rid",
            body: "This is a great game!",
            review_id: 2,
            comment_id: 7,
            votes:0,
            created_at: "2017-11-22T12:43:33.389Z",
          })
          });
    });
    test("5.extra keys in the request object should be ignored", () => {
      const REVIEW_ID = 2
      const newComment = {
        username: "dav3rid",
        body: "This is a great game!",
        age: 25
      };
      return request(app)
        .post(`/api/reviews/${REVIEW_ID}/comments`)
        .expect(201)
        .send(newComment)
        .then(( result ) => {
          expect(result.body).toMatchObject({
            author: "dav3rid",
            body: "This is a great game!",
            review_id: 2,
            comment_id: 7,
            votes:0,
            created_at: "2017-11-22T12:43:33.389Z",
          })
          });
    });
    test("6. 400: invalid review_id ", () => {
      const REVIEW_ID = "a"
      const newComment = {
        username: "dav3rid",
        body: "This is a great game!",
        age: 25
      };
      return request(app)
        .post(`/api/reviews/${REVIEW_ID}/comments`)
        .expect(400)
        .send(newComment)
        .then(({body: {msg} }) => {
        expect(msg).toBe('Bad Request')
        });
    });
    test("7. 404: responds with not found for non-existent username ", () => {
      const REVIEW_ID = 2
      const newComment = {
        username: "CocoS26",
        body: "This is a great game!",
        age: 22
      };
      return request(app)
        .post(`/api/reviews/${REVIEW_ID}/comments`)
        .expect(404)
        .send(newComment)
        .then(({body: {msg} }) => {
          
          expect(msg).toBe('Not Found');
        });
    });
  });



    describe('PATCH  /api/reviews/:review_id', () => {
      test('1. status:200, updates a review by incresing the votes property for a specific review_id', () => {
        const REVIEW_ID = 2
        const reviewUpdates = {
          inc_votes: 1
        }
        return request(app)
        .patch(`/api/reviews/${REVIEW_ID}`)
          .send(reviewUpdates)
          .expect(200)
          .then(( result ) => {
            expect(result.body).toMatchObject({
              votes:6,
              title: 'Jenga',
              designer: 'Leslie Scott',
              owner: 'philippaclaire9',
              review_img_url:
                'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
              review_body: 'Fiddly fun for all the family',
              category: 'dexterity',
              created_at: '2021-01-18T10:01:41.251Z',
            })
            });
          });
     
      test('2. status:400, when a key is null', () => {
        const REVIEW_ID = 2
        const reviewUpdates = {
          inc_votes: ''
        }
        return request(app)
        .patch(`/api/reviews/${REVIEW_ID}`)
        .send(reviewUpdates)
          .expect(400)
          .then((response) => {
            const msg = response.body.msg
            expect(msg).toBe('Bad Request')
        });
      });
      test('3. status:400, when a key is invalid', () => {
        const REVIEW_ID = 2
        const reviewUpdates = {
          inc_votes: "great"
        }
        return request(app)
        .patch(`/api/reviews/${REVIEW_ID}`)
        .send(reviewUpdates)
          .expect(400)
          .then((response) => {
            const msg = response.body.msg
            expect(msg).toBe('Bad Request')
        });
      });
      test("4. 404: responds with not found for non-existent review_id ", () => {
        const REVIEW_ID = 14
        const reviewUpdates = {
          inc_votes: 1
        }
        return request(app)
        .patch(`/api/reviews/${REVIEW_ID}`)
        .send(reviewUpdates)
          .expect(404)
          .then(({body: {msg} }) => {
            expect(msg).toBe('Not Found');
          });
      });
      test("5. 200: extra keys in the request object should be ignored", () => {
        const REVIEW_ID = 2
        const reviewUpdates = {
          inc_votes: 1,
          username: 'CocoS26'
        }
        return request(app)
        .patch(`/api/reviews/${REVIEW_ID}`)
          .send(reviewUpdates)
          .expect(200)
          .then(( result ) => {
            expect(result.body).toMatchObject({
              votes:6,
              title: 'Jenga',
              designer: 'Leslie Scott',
              owner: 'philippaclaire9',
              review_img_url:
                'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
              review_body: 'Fiddly fun for all the family',
              category: 'dexterity',
              created_at: '2021-01-18T10:01:41.251Z',
            })
            });
      })
      test('6. status:200, updates a review by decreasing the votes property for a specific review_id', () => {
        const REVIEW_ID = 2
        const reviewUpdates = {
          inc_votes: -6
        }
        return request(app)
        .patch(`/api/reviews/${REVIEW_ID}`)
          .send(reviewUpdates)
          .expect(200)
          .then(( result ) => {
            expect(result.body).toMatchObject({
              votes: -1,
              title: 'Jenga',
              designer: 'Leslie Scott',
              owner: 'philippaclaire9',
              review_img_url:
                'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
              review_body: 'Fiddly fun for all the family',
              category: 'dexterity',
              created_at: '2021-01-18T10:01:41.251Z',
            })
            });
          });
          test('7. status:400, when review_id is invalid', () => {
            const REVIEW_ID = "banana"
            const reviewUpdates = {
              inc_votes: 2
            }
            return request(app)
            .patch(`/api/reviews/${REVIEW_ID}`)
            .send(reviewUpdates)
              .expect(400)
              .then((response) => {
                const msg = response.body.msg
                expect(msg).toBe('Bad Request')
            });
          });
        });

describe('GET / api/users', () => {
  test("respond with a json object containing a key of `users` with a value of an array of all the users objects", () => {
    return request(app)
      .get('/api/users')
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        expect(users).toHaveLength(4);
        users.forEach((user) => {
          expect(user).toMatchObject(({
          username: expect.any(String),
          name: expect.any(String),
          avatar_url: expect.any(String)
          })
          );
        });
      });
  });
});


describe('DELETE /api/comments/:comment_id', () => {
  test("1. responds with an empty response body", () => {
    const COMMENT_ID = 2
    return request(app)
    .delete(`/api/comments/${COMMENT_ID}`)
    .expect(204);
  });
  test("2. returns 404 not found when when comment_id does not exist",() => {

    return request(app)
    .delete(`/api/comments/779`)
    .expect(404)
    .then(({body: {msg} }) => {
      expect(msg).toBe('Not Found');
    });
     

});
test("3. returns 400 Bad Request when comment_id is invalid",() => {
  return request(app)
  .delete(`/api/comments/banana`)
  .expect(400)
  .then((response) => {
    const msg = response.body.msg
    expect(msg).toBe('Bad Request')
});
   

});
})

