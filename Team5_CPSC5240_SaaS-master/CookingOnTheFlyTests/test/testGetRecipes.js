const chaiModule = require('chai');
const chaiHttp = require('chai-http');
const async = require('async');

const assert = chaiModule.assert;
const expect = chaiModule.expect;
const should = chaiModule.should();

const http = require('https');
chaiModule.use(chaiHttp);

describe('Test Recipes lists results', function() {
    let requestResult;
    let response;

    before(function (done) {
        chaiModule.request('https://cookonthefly.azurewebsites.net/')
            .get("/api/recipe")
            .end(function (err, res) {
                requestResult = res.body;
                response = res;
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                done();
            });
    });

    it('API should return status OK (200)', function() {
        expect(response).to.have.headers;
        expect(response).to.have.status(200);
    });

    it('API Should return a List', function () {
        expect(response).to.be.json;
        expect(response.body).to.be.an('array');
    });

    it('API Should return an array of 5 objects', function () {
        expect(response.body).to.have.lengthOf(5);
    });

    it('First returned entry in array has expected properties/keys', function() {
        expect(requestResult[0]).to.be.an('object');
        expect(requestResult[0]).to.have.all.keys([ 'name','recipeId','savedByUserId', 'description', 'ingredients', 'cuisine',
        'dietaryRestrictions', 'createdByUserId', 'images', 'premium', 'ratings']);
    });
    it('All returned items in list contain the expected keys and of correct data type', function () {
        expect(response.body).to.satisfy(function (body) {
            for (let i = 0; i < body.length; i++) {
                expect(body[i]).to.be.an('object');
                expect(body[i]).to.have.all.keys(['recipeId', 'name', 'description', 'ingredients', 'cuisine',
                    'dietaryRestrictions', 'createdByUserId', 'savedByUserId', 'images', 'premium', 'ratings']);
                expect(body[i].recipeId).to.be.a('number');
                expect(body[i].name).to.be.a('string');
                expect(body[i].description).to.be.a('string');
                expect(body[i].ingredients).to.be.an('array');
                expect(body[i].cuisine).to.be.a('string');
                expect(body[i].dietaryRestrictions).to.be.an('array');
                expect(body[i].createdByUserId).to.be.a('string');
                expect(body[i].savedByUserId).to.be.an('array');
                expect(body[i].images).to.be.an('array');
                expect(body[i].premium).to.be.a('boolean');
                expect(body[i].ratings).to.be.a('number');
            }
            return true;
        });
    });
});