import * as Mongoose from "mongoose";
import { IRecipeModel } from "../Interfaces/IRecipeModel";
import {exec} from "node:child_process";

class RecipeModel
{
    public schema: any;
    public model: any;
    public dbConnectionString: string;

    //Constructor
    public constructor(DB_CONNECTION_STRING:string)
    {
        this.dbConnectionString = DB_CONNECTION_STRING;
        this.createSchema();
        this.createModel();
    }

    //Schema for the Recipes Model
    public createSchema():void
    {
        this.schema = new Mongoose.Schema(
            {
                recipeId: Number,               //Recipe ID
                name: String,                   //Recipe Name
                description: String,            //Recipe description and steps
                ingredients: [Number],          //List of ingredients IDs
                cuisine: String,                //Type of cuisine (e.g. Chinese, French, Mexican,...)
                dietaryRestrictions: [String],  //List of dietary restrictions (e.g. Vegan, Vegetarian, ...)
                createdByUserId: String,        //ID of user who created the recipe
                savedByUserId: [String],        //ID of user who saved the recipe
                images: [String],               //List of image URLs
                premium: Boolean,               //Available for premium users only?
                ratings: Number                //Average ratings
                // feedback: [Number]             //List of feedback IDs
            }, {collection: 'recipes', versionKey: false}
        );
    }

    //Create Model function, and connect to DB
    public async createModel()
    {
        try {
            await Mongoose.connect(this.dbConnectionString);
            this.model = Mongoose.model<IRecipeModel>("Recipe", this.schema);
        } catch (e) {
            console.error(e);
        }
    }

    /**
     * This method queries the DB for recipes based on the recipe ID, and sends back a response containing JSON string
     * for the matching recipe
     * input:
     *    @param response - response handle, to send back query results
     *    @param id - the ID of the recipe to lookup in DB
     * output:
     *    - None
     */
    public async getRecipeById(response:any, id:number)
    {
        //prepare the query parameters
        let query = this.model.findOne({recipeId: id}).select('-_id');
        try {
            //Execute query
            const result = await query.exec();

            //If no result returned, return 404
            if (result == null) {
                response.status(404).json({error: "Recipe " + id + " Not Found"});
            }
            //If result found, send back JSON string of the result, using response handle
            else {
                response.json(result) ;
            }
        } catch (e) {
            console.error(e);
            response.status(500).send('Server Error.');
        }
    }

    // get the recipe/s created by the user
    public async getRecipeCreatedById(response:any, id: string)
    {
        //prepare the query parameters
        let query = this.model.find({createdByUserId: id}).select('-_id');
        try {
            //Execute query
            const result = await query.exec();

            //If no result returned, return 404
            if (result == null) {
                response.status(404).json({error: "No Recipe found created by user with id: " + id});
            }
            //If result found, send back JSON string of the result, using response handle
            else {
                response.json(result) ;
            }
        } catch (e) {
            console.error(e);
            response.status(500).send('Server Error.');
        }
    }

    // get the recipe/s saved by the user
    public async getRecipeSavedById(response:any, id: string)
    {
        //prepare the query parameters
        let query = this.model.find({ savedByUserId: { $in: [id] }}).select('-_id');
        try {
            //Execute query
            const result = await query.exec();

            //If no result returned, return 404
            if (result == null) {
                response.status(404).json({error: "No Recipe found saved by user with id: " + id});
            }
            //If result found, send back JSON string of the result, using response handle
            else {
                response.json(result) ;
            }
        } catch (e) {
            console.error(e);
            response.status(500).send('Server Error.');
        }
    }

    /**
     * This method retrieves the list of ingredients IDs of a specific recipe
     * input:
     *      @param id - ID of the recipe fo which the ingredients ID list will be retrieved
     * output:
     *      @returns None
     */
    public async getRecipeIngredients(id:number)
    {
        //prepare the query parameters
        let query = this.model.findOne({recipeId: id}, "ingredients");
        try {
            //Execute query
            const result = await query.exec();

            //Convert result to JSON, extract ingredients list and return the list
            return result.toJSON().ingredients;
        } catch (e) {
            console.error(e);
        }
    }

    /**
     * This method queries the DB for all recipes, and sends back a response in JSON string format
     * input:
     *     @param response - response handle, to send back query results
     * output:
     *     @returns None
     */
    public async getAllRecipes(response:any)
    {
        //Prepare the query call
        let query = this.model.find().select('-_id');
        try {
            //execute the query
            const result = await query.exec();

            //If no results, returned, send error 404
            if (result == null) {

                response.status(404).json({error: "No recipes found."});
            }
            //Send results of query in JSON format
            else {
                response.json(result);
            }
        } catch (e) {
            console.error(e);
            response.status(500).send('Server Error.');
        }
    }

    /**
     * This method queries the DB for recipes based on the ingredients, and sends back a response containing JSON string
     * for the matching recipes. Recipes returned are the ones whose entire ingredients list is a subset of the input
     * ingredients
     * input:
     *      @param response - response handle, to send back query results
     *      @param ingredients - list of ingredients IDs of the recipes to lookup in DB
     * output:
     *      @returns None
     */
    public async getRecipeByIngredients(response:any, ingredients:[number])
    {
        try {
            /*
            Set up the query call. This call will use the aggregate mongoose function. To find recipes whose entire
            ingredients list is a subset of input list, we compare the list of ingredients in recipe against the input
            list, to see if there are any ingredients in recipe list that are not in the input list. If size of the diff
            > 0, then not subset and thus recipe is excluded.
             */
            let query = this.model.aggregate(
                [
                    {
                        //Project only recipe high-level details: name: cuisine, ingredients
                        $project: {
                            recipeId:1,
                            name:1,
                            cuisine:1,
                            _id: 0,
                            ingredients: 1,
                            images: 1,
                            ratings: 1,
                            isSubset: {
                                $eq: [
                                    {$size: { $setDifference: ["$ingredients", ingredients]}},
                                    0
                                ]
                            }
                        }
                    },
                    //Check if the recipe's ingredients are subset of input list
                    {
                        $match: {isSubset: true}
                    },
                    // project away the isSubset attribute
                    {
                        $project: {
                            isSubset: 0,
                            ingredients: 0
                        }
                    }
                ]
            );

            //Execute query and send result back
            const result = await query.exec();

            //If no results, returned, send error 404
            if (result == null || result.length == 0) {
                response.status(404).json({error: "No recipes found."});
            }
            //Send results of query in JSON format
            else {
                response.json(result);
            }
        } catch (e) {
            console.error(e);
            response.status(500).send('Server Error.');
        }
    }

    /**
     * This helper method queries the DB for highest recipe ID, and returns ID + 1, to be used to create a new recipe.
     * input:
     *     None
     * output:
     *     @returns recipeId: number - New recipe ID.
     */
    private async getNewRecipeId()
    {
        //Query for highest ID in DB
        let query = this.model.findOne().sort({recipeId: -1}).select('recipeId');
        let result = await query.exec();

        //Return the highest recipeId + 1
        return result['recipeId'] + 1;
    }

    /**
     * This method adds a new recipe to the database.
     * input:
     *      @param response - response handle to send back add results
     *      @param recipeDetails - JSON object containing the details of recipe to be added.
     * output:
     *      @returns None
     */
    public async addNewRecipe(response:any, recipeDetails: object)
    {
        try {
            //Get a new ID for the new recipe
            const id: number = await this.getNewRecipeId();
            console.log("New recipe ID: " + id);

            //Append ID to the recipe object
            let recipeDetailsJsonObj: any = recipeDetails;
            recipeDetailsJsonObj.recipeId = id;
            console.log("New recipe details:");
            console.log(recipeDetailsJsonObj);

            //Save new object
            const result = await this.model(recipeDetailsJsonObj).save();

            //If result is returned, then send success
            if (result) {
                response.status(200).send({recipeId: id, message: "Recipe added successfully"});
            }
            //if result is null, then failed to add recipe
            else {
                response.status(400).send("Failed to create recipe.");
            }
        } catch (e) {
            console.error(e);
            response.status(500).send("Server Error.");
        }

    }

    /**
     * This method update a new recipe to the database.
     * input:
     *      @param response - response handle to send back add results
     *      @param recipeDetails - JSON object containing the details of recipe to be added.
     * output:
     *      @returns None
     */
    public async updateRecipe(response:any, recipeDetails: object)
    {
        try {
            //Get Recipe ID to the recipe object
            let recipeDetailsJsonObj: any = recipeDetails;
            const recipeId = recipeDetailsJsonObj.recipeId;
            console.log("Update recipe details:");
            console.log(recipeDetailsJsonObj);

            //Save new object
            const result = await this.model.updateOne({'recipeId': recipeId}, {$set: recipeDetailsJsonObj}).exec();

            //If result is returned, then send success
            if (result.n > 0) {
                response.status(200).send({recipeId: recipeId, message: "Recipe updated successfully"});
            }
            //if result is null, then failed to add recipe
            else {
                response.status(400).send("Failed to update recipe.");
            }
        } catch (e) {
            console.error(e);
            response.status(500).send("Server Error.");
        }

    }

    /**
     * This method deletes a recipe from the DB using the recipe ID.
     * input:
     *      @param response - response handle, to send back query results.
     *      @param recipeId - ID of recipe to be deleted.
     * output:
     *      @returns None
     */
    public async deleteRecipeById(response: any, recipeId: number)
    {
        try {
            let query: any = this.model.findOneAndDelete({recipeId: recipeId});
            const result = await query.exec();
            console.log(result);
            if (result != null) {
                response.status(200).send("Recipe deleted successfully");
                return;
            }
            response.status(404).send("Recipe " + recipeId + " does not exist");
        } catch (e) {
            console.error(e);
            response.status(500).send("Server Error");
        }
    }
}
export { RecipeModel };