const chaiModule = require('chai');
const chaiHttp = require('chai-http');

const assert = chaiModule.assert;
const expect = chaiModule.expect;
const should = chaiModule.should();

chaiModule.use(chaiHttp);

describe('Test POST Add Feedback to Recipe', function() {
    let response;
    let feedbackId;
    const recipeId = 1; 
    const feedbackData = {
        feedbacks: {
            userId: '1234567890',
            comment: 'This recipe is fantastic!',
            rating: 5
        }
    };

    before(function(done) {
        chaiModule.request('https://cookonthefly.azurewebsites.net/')
            .post(`/api/recipe/${recipeId}/addfeedback/`)
            .send(feedbackData)
            .end(function(err, res) {
                response = res;
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                feedbackId = res.body.feedbackId; // Assuming the feedbackId is returned in the response body
                done();
            });
    });

    it('API should return status OK (200)', function() {
        expect(response).to.have.status(200);
    });

    it('API should return a JSON object', function() {
        expect(response).to.be.json;
        expect(response.body).to.be.an('object');
    });

    it('API should return a success message', function() {
        expect(response.body).to.have.property('message').that.equals('Feedback added successfully');
    });

    after(function(done) {
        chaiModule.request('https://cookonthefly.azurewebsites.net/')
            .delete(`/api/recipe/${recipeId}/feedback/${feedbackId}/delete`)
            .end(function(err, res) {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('message').that.equals('Feedback deleted successfully');
                done();
            });
    });
});
