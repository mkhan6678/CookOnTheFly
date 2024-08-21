const chaiModule = require('chai');
const chaiHttp = require('chai-http');
const async = require('async');

const assert = chaiModule.assert;
const expect = chaiModule.expect;
const should = chaiModule.should();

const http = require('http');
chaiModule.use(chaiHttp);

describe('Test GET Single Recipe result', function() {
    let requestResult;
    let response;

    before(function (done) {
        chaiModule.request('https://cookonthefly.azurewebsites.net/')
            .get("/api/recipe/1")
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

    it('API Should return an single JSON object', function () {
        expect(response).to.be.json;
        expect(response.body).to.be.an('object');
    });

    it('API returns object that has expected propertirecipeIdes/keys', function() {
        expect(requestResult).to.have.all.keys([ 'name','recipeId','savedByUserId', 'description', 'ingredients', 'cuisine',
            'dietaryRestrictions', 'createdByUserId', 'images', 'premium', 'ratings']);
    });
    it('API returns object that contains the expected keys and of correct data type', function () {
        expect(response).to.have.status(200);
        expect(response.body).to.be.an('object');
        expect(requestResult.recipeId).to.be.a('number');
        expect(requestResult.name).to.be.a('string');
        expect(requestResult.description).to.be.a('string');
        expect(requestResult.ingredients).to.be.an('array');
        expect(requestResult.cuisine).to.be.a('string');
        expect(requestResult.dietaryRestrictions).to.be.an('array');
        expect(requestResult.createdByUserId).to.be.a('string');
        expect(requestResult.images).to.be.an('array');
        expect(requestResult.premium).to.be.a('boolean');
        expect(requestResult.recipeId).to.be.a('number');
    });
    it('API returns the object with matching ID', function() {
        expect(requestResult.recipeId).to.equal(1)
    })
});