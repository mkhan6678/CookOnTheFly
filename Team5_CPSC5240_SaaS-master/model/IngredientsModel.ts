import * as Mongoose from "mongoose";
import { IIngredientsModel } from "../Interfaces/IingredientsModel";


class IngredientsModel {
    public schema:any;
    public model:any;
    public dbConnectionString:string;

    public constructor(DB_CONNECTION_STRING:string) {
        this.dbConnectionString = DB_CONNECTION_STRING;
        this.createSchema();
        this.createModel();
    }

    public createSchema() {
        this.schema = new Mongoose.Schema(
            {
                ingredientId: Number,
                name: String,
                category: String
            }, {collection: 'ingredients'}
        );    
    }

    public async createModel() {
        try {
            await Mongoose.connect(this.dbConnectionString);
            this.model = Mongoose.model<IngredientsModel>("ingredients", this.schema);
        }
        catch (e) {
            console.error(e);
        }
    }


    /**
     * This helper method queries the DB for highest ingredient ID, and returns ID + 1, to be used to create a new id.
     * input:
     *     None
     * output:
     *     @returns ingredientId: number - New recipe ID.
     */
    private async getNewIngredientId()
    {
        //Query for highest ID in DB
        let query = this.model.findOne().sort({ingredientId: -1}).select('ingredientId');
        let result = await query.exec();

        //Return the highest recipeId + 1
        return result['ingredientId'] + 1;
    }


    /**
    * This  method for retrieving all ingredieents
    * 
    * input:
    *    @param response : response to return to routes
    * Output:
    *    @return response: list of ingredients of recipes
    */
    public async getAllIngredients(response:any) {

        let query = this.model.find({}).select('-_id');
        
        try {
            const ingredients = await query.exec();
            response.json(ingredients);
        }
        catch(error) {
            console.error("Error viewing all ingredients:", error);
            response.status(500).json({error: "Server Error"})
        }
    }


    /**
    * This  method for retrieving name of ingredients of its ID
    * 
    * input:
    *    @param id : id of ingredient id
    * Output:
    *    @return response: list of ingredients of recipes
    */

    public async getIngredientById(response:any, id:number) {


        if (!id) {
            return response.status(400).json({ error: "no id were send" });
            }
        
        try {
            const ingredients = await this.model.findOne({'ingredientId':id}).select('-_id').exec();
            response.json(ingredients);
        }
        catch(error) {
            console.error("Error viewing all ingredients:", error);        }
    }

    /**
    * This  method for retrieving list of all ingredients by its ID
    * 
    * input:
    *    @param ingredientIds : list of ids of ingredients
    * Output:
    *    @return response: list of ingredients names
    */
    public async getListIngredientByIds(ingredientIds:number[]) {

        if (ingredientIds.length == 0) {
            return [];
            }
        
        try {
            
            const ingredients = await this.model.find( {"ingredientId": {$in: ingredientIds}}).select('-_id');
            return ingredients;
        }
        catch(error) {
            console.error("Error returning the ingredients names:", error);
        }
    }

    /**
    * This  method for adding  ingredients details 
    * 
    * input:
    *    @param ingredientDetails : ingredients information
    * Output:
    *    @return response: status code and message
    */
    public async addIngredient(response:any, ingredientDetails) {
        
        //const {ingredientId, name, category} = request.params;

        if (!ingredientDetails) {
            response.status(400).json({ error: "All fields are required" });
            }

       try {
            let ingredientDetailsObj = ingredientDetails;
            const id = await this.getNewIngredientId();
            ingredientDetailsObj.ingredientId = id;

            const result = await this.model(ingredientDetailsObj).save();

           //If result is returned, then send success
           if (result) {
               response.status(200).send({ingredientId: id, message: "Ingredient added successfully"});
           }
           //if result is null, then failed to add recipe
           else {
               response.status(400).send("Failed to create ingredient.");
           }
        }

        catch(error) {
            console.error("Error adding new ingredient:", error);
            response.status(500).send({error: "Server error."})
            }
    }

    
    /**
    * This  method for updating  ingredients details 
    * 
    * input:
    *    @param ingredientDetails: updated ingredients information
    * Output:
    *    @return response: status code and message
    */
    public async updateIngredient(response: any, ingredientDetails){

        if (!ingredientDetails) {
            return response.status(400).json({ error: "All fields are required" });
        }

        const ingredientId = ingredientDetails.ingredientId;

        try{
            const result = await this.model.updateOne({ingredientId}, {$set: ingredientDetails});

            if(result.n <= 0){
                response.status(402).send({ingredientId: ingredientId, message: "Ingredient not found"});
                console.log("The ingredient not found: ", ingredientDetails);
            } else {
                response.status(200).send({ingredientId: ingredientId, message: "Ingredient updated successfully"});
                console.log("The ingredient has been updated: ", ingredientDetails);
            }
        }
        catch(error){
            console.error("Error updating ingredient:", error);
            }
        }
        
    
    
} export {IngredientsModel};