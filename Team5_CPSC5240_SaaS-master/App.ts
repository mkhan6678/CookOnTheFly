import * as express from 'express';
import * as url from 'url';
import * as bodyParser from 'body-parser';
import {MongoClient} from 'mongodb'
import {FeedbackModel} from './model/FeedbackModel';
import {RecipeModel} from './model/RecipeModel';
import {IngredientsModel} from './model/IngredientsModel';
import * as crypto from 'crypto';
import * as passport from 'passport';
import GooglePassportObj from './GooglePassport';
import * as session from 'express-session';
import * as cookieParser from 'cookie-parser';

declare global {
    namespace Express {
        interface User {
            id: string,
            displayName: string,
            emails: object
        }
    }
}

// Creates and configures an Express.js web server.
class App {
    // ref to Express instance
    public expressApp: express.Application;
    public Recipes: RecipeModel;
    public Feedbacks: FeedbackModel;
    public Ingredients: IngredientsModel;
    public googlePassportObj: GooglePassportObj;

    //Run configuration methods on the Express instance.
    constructor(mongoDBConnection: string) {
        this.expressApp = express();
        this.googlePassportObj = new GooglePassportObj();
        this.middleware();
        this.routes();
        this.Recipes = new RecipeModel(mongoDBConnection);
        this.Ingredients = new IngredientsModel(mongoDBConnection);
        this.Feedbacks = new FeedbackModel(mongoDBConnection);
    }

    // Configure Express middleware.
    private middleware(): void {
        this.expressApp.use(bodyParser.json());
        this.expressApp.use(bodyParser.urlencoded({extended: false}));
        this.expressApp.use((req, res, next) => {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            next();
        });
        this.expressApp.use(session({secret: 'keyboard cat'}));
        this.expressApp.use(cookieParser());
        this.expressApp.use(passport.initialize());
        this.expressApp.use(passport.session());
    }

    private validateAuth(req, res, next): void {
        // console.log(JSON.stringify(req.user))
        if (req.isAuthenticated()) {
            console.log("user is authenticated");
            // console.log(JSON.stringify(req.user));
            return next();
        }
        console.log("user is not authenticated");
        res.redirect('/auth/google');
        // res.status(200).send(false);
    }

    // Configure API endpoints.
    private routes(): void {
        let router = express.Router();

        router.get('/auth/google',
            passport.authenticate('google', {scope: ['profile', 'email']}));

        router.get('/auth/google/callback',
            passport.authenticate('google',
                {failureRedirect: '/'}
            ),
            (req, res) => {
                console.log("successfully authenticated user and returned to callback page.");
                const googleUserId = req.user.id;
                console.log(googleUserId);
                // res.redirect('http://localhost:4200/#/saved-recipe');
                res.redirect('/#/')
            });

        router.get('/auth/google/logout', (req, res)  => {
            req.logout((err: Error) => {
                if (err) {
                    // handle the error
                    console.error('Error logging out:', err);
                    return res.status(500).send('Error logging out');
                }
                // if no error, redirect to home page
                res.redirect('/');
            });
        });

        

        router.get('/api/user/isLoggedIn', (req, res) => {
            if (req.isAuthenticated()) {
                console.log("user is logged in. User ID: ", req.user.id);
                res.status(200).send(true);
            }
            else {
                console.log("user is not logged in");
                res.status(200).send(false);
            }
        })

        router.get('/api', async (req, res) => {
            try {
                res.send('Welcome to Cooking on the Fly');
            } catch (error) {
                console.log(error);
            }
        });

        router.get('/api/user/info', this.validateAuth, (req, res) => {
            if (req.isAuthenticated()) {
                console.log(req.user.displayName);
                console.log(req.user.emails)
              res.status(200).send({
                  username: req.user.displayName,
                  email: req.user.emails[0].value,
                  id: req.user.id
              });
            } else {
              res.status(200).send({});
            }
          });
          

        //==============================================================================================================
        //Users routers
        //==============================================================================================================


        //==============================================================================================================
        //Recipes routers
        //==============================================================================================================

        /**
         * GET API to retrieve recipes in the DB that saved by the user id */
        router.get('/api/saved-recipe', this.validateAuth, async (req, res) => {
            try {
                // console.log(req.user.id)
                const id = req.user.id;
                console.log('Query recipe/s saved by id: ' + id);
                await this.Recipes.getRecipeSavedById(res, id);

            } catch (error) {
                console.log(error);
            }
        });

        /**
         * GET API to retrieve a single recipe by ID
         */
        router.get('/api/recipe/:id', async (req, res) => {
            try {
                //Get the ID of recipe from the request parameters
                let id = req.params.id;
                console.log('Query single list with id: ' + id);

                //Call the getRecipesById function to query the DB
                await this.Recipes.getRecipeById(res, id);
            } catch (error) {
                console.log(error);
            }
        });

        /**
         * GET API to retrieve recipes in the DB that created by the user id */
        router.get('/api/created-recipe', this.validateAuth, async (req, res) => {
            try {

                const id = req.user.id;
                console.log('Query recipe/s created by id: ' + id);
                await this.Recipes.getRecipeCreatedById(res, id);

            } catch (error) {
                console.log(error);
            }
        });



        /**
         * GET API to retrieve recipes in the DB with matching ingredients or all recipes, if no ingredients are provided
         */

        router.get('/api/recipe', async (req, res) => {
            try {
                //Extract list of ingredients from request query
                let ingredientsParam = req.query.ingredients;

                //if list of ingredients provided in request query, then search by ingredients
                if (ingredientsParam) {
                    if (typeof ingredientsParam === 'string') {
                        console.log('Query All recipes with ingredients', ingredientsParam);

                        //Convert query into list of numbers, then make call to query DB
                        ingredientsParam = ingredientsParam.split(',').map(Number)
                        await this.Recipes.getRecipeByIngredients(res, ingredientsParam)
                    }
                }
                //if no query found in request, then return all recipes
                else {
                    console.log('Query All recipes');

                    //Call the getAllRecipes function to query the DB
                    await this.Recipes.getAllRecipes(res);
                }
            } catch (error) {
                console.log(error);
            }
        });

        /**
         * POST api to add a new recipe to the DB. Request Body must include all details except for ID
         */
        router.post('/api/recipe/', async (req, res) => {
            try {
                //Extract recipe details from request body
                let recipeDetailsJsonObj: any = req.body;
                console.log("Request to add recipe: ");
                console.log(recipeDetailsJsonObj);

                //Call model to add new recipe
                await this.Recipes.addNewRecipe(res, recipeDetailsJsonObj);
            } catch (error) {
                console.log('Recipe Creation Failed')
                console.error(error);
            }
        });

        /**
         * PUT api to add a new recipe to the DB. Request Body must include all details except for ID
         */
        router.put('/api/recipe/:id', async (req, res) => {
            try {
                //Extract recipe details from request body
                let recipeDetailsJsonObj: any = req.body;
                const recipeId = req.params.id;
                recipeDetailsJsonObj.recipeId = recipeId;
                console.log("Request to add recipe: ");
                console.log(recipeDetailsJsonObj);

                //Call model to add new recipe
                await this.Recipes.updateRecipe(res, recipeDetailsJsonObj);
            } catch (error) {
                console.log('Recipe Creation Failed')
                console.error(error);
            }
        });

        /**
         * DELETE api to delete a single recipe from the DB
         */
        router.delete('/api/recipe/:id', async (req, res) => {
            try {
                //Extract recipeId from the request params
                let recipeId: number = req.params.id;
                console.log("Request to delete recipe: " + recipeId);

                //Call model to delete recipe from DB
                await this.Recipes.deleteRecipeById(res, recipeId);

            } catch (e) {
                res.status(500).send('Server Error')
            }
        });

        /**
         * Get api to retrieve ingredients and feedback for a recipe
         */
        router.get('/api/recipe/:id/feedbackandingredients', async (req, res) => {
            try {
                //Extract recipeId from the request params
                let recipeId: number = parseInt(req.params.id);
                console.log("Request feedback and ingredients for recipe id: " + recipeId);

                //Get ingredients IDs for recipe for the Recipes model
                const ingredientIds = await this.Recipes.getRecipeIngredients(recipeId);
                console.log(ingredientIds);

                //Get the list of ingredients for the recipe
                const ingredients = await this.Ingredients.getListIngredientByIds(ingredientIds);

                //Get the list of feedback for the recipe
                const feedback = await this.Feedbacks.getFeedbackForRecipe(recipeId);

                //Merge the 2 objects
                const feedbackAndIngredients = {ingredients, feedback};
                console.log(feedbackAndIngredients);
                res.json(feedbackAndIngredients);
            } catch (error) {
                console.error(error);
            }
        });
        //==============================================================================================================
        //Ingredients routers
        //==============================================================================================================

        /**
         * GET api to get all ingredients in DB
         */
        router.get('/api/ingredient', async (req, res) => {

            try {
                //Call Model to query DB for all ingredients
                await this.Ingredients.getAllIngredients(res);
            } catch (error) {
                console.error("Error");
            }
        });

        /**
         * Get API to find ingredients by ID
         */
        router.get('/api/ingredient/:id', async (req, res) => {
            let id: number;
            id = req.params.id;

            try {
                //Call model to get ingredient by ID
                await this.Ingredients.getIngredientById(res, id);
            } catch (error) {
                console.log("Error");
            }

        });

        /**
         * Put API to update a specific ingredient
         */

        router.put('/api/ingredient/updateIngredient/:ingredientId', async (req, res) => {

            // const {ingredientId, name, category} = req.params;
            try {
                let ingredientDetails = req.body;
                ingredientDetails.ingredientId = req.params.ingredientId;
                await this.Ingredients.updateIngredient(res, ingredientDetails);

            } catch (error) {
                console.log("Error");
            }

        });


        /**
         * Post API to add new ingredient to DB
         */
        router.post('/api/ingredient/addIngredient/', async (req, res) => {

            const ingredientDetails = req.body;
            try {
                await this.Ingredients.addIngredient(res, ingredientDetails);


            } catch (error) {
                console.log("Error");
            }

        });

        //=============================================================================================================
        //Feedback routers
        //==============================================================================================================
        /**
         * Post API to add feedback to a specific recipe
         */
        router.post('/api/recipe/:id/addfeedback/', async (req, res) => {

            try {
                //Extract the feedback to be added from Body
                console.log("request body", req.body)
                let recipeId = req.params.id;
                const {feedbacks} = req.body;
                console.log("recipeId", recipeId)
                console.log("feedbacks", feedbacks)
                await this.Feedbacks.createFeedback(recipeId, feedbacks);
                res.json({message: 'Feedback added successfully'});
            } catch (error) {
                console.error('Error adding feedback:', error);
                res.status(500).json({error: 'Internal server error'});
            }

        });

        /**
         * Get API to get all feedback for a recipe
         */
        router.get('/api/recipe/:id/feedbacks/all', async (req, res) => {

            try {
                //Get Recipe ID from params
                //console.log("request body", req.body)
                let recipeId = req.params.id;
                console.log("recipeId", recipeId)
                //console.log("feedbacks", feedbacks)

                //Call model to query DB
                const result = await this.Feedbacks.getFeedbackForRecipe(recipeId);
                res.json(result);
            } catch (error) {
                console.error('Error reading feedback:', error);
                res.status(500).json({error: 'Internal server error'});
            }

        });

        /**
         * Put API to update a feedback for a recipe
         */
        router.put('/api/recipe/:recipeId/feedback/:feedbackId/update', async (req, res) => {
            try {

                //Extract params and payload from incoming request
                let recipeId = req.params.recipeId;
                let feedbackId = req.params.feedbackId
                const updatedData = req.body
                updatedData.feedbackId = feedbackId

                //Call model to update DB
                await this.Feedbacks.updateFeedback(recipeId, feedbackId, updatedData);

                res.json({message: 'Feedback updated successfully'});

            } catch (error) {
                console.log("Error")
                res.status(500).json({error: "Server Error"});
            }

        });

        /**
         * Delete API to delete a feedback for a recipe
         */
        router.delete('/api/recipe/:recipeId/feedback/:feedbackId/delete', async (req, res) => {
            try {
                let recipeId = req.params.recipeId;
                let feedbackId = req.params.feedbackId
                await this.Feedbacks.deleteFeedback(recipeId, feedbackId);

                res.json({message: 'Feedback deleted successfully'});

            } catch (error) {
                console.log("Error")
            }

        });

        /**
         * Get API to get ratings for a recipe
         */
        router.get('/api/recipe/:recipeId/avgratings', async (req, res) => {
            try {
                let recipeId = req.params.recipeId;

                const avgRating = await this.Feedbacks.getAverageRatingForRecipe(recipeId);

                res.json({avgRating});

            } catch (error) {
                console.log("Error")
            }

        });

        /**
         * Get API to get all feedback by a specific user
         */
        router.get('/api/user/:id/feedbacks', async (req, res) => {
            try {
                let userId = req.params.id;

                const feedbacks = await this.Feedbacks.getFeedbackByUserId(userId);

                res.json({userId, feedbacks});

            } catch (error) {
                console.log("Error")
            }

        });


        this.expressApp.use('/', express.static(__dirname + '/dist/cook_on_the_fly_cli/browser'));
        this.expressApp.use('/', router);
        // this.expressApp.use('/auth', router);
    }
}


export {App};

