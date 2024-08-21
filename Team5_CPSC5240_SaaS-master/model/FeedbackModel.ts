import * as Mongoose from "mongoose";
import { IFeedbackModel } from "../Interfaces/IFeedbackModel";

class FeedbackModel
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
        const feedbackSchema = new Mongoose.Schema(
        {
                feedbackId: Number,
                userId: Number,
                comment: String,
                ratings: Number
            },
            { _id: false } // Set _id to false
        );
        
        this.schema = new Mongoose.Schema(
            {
                recipeId: Number,                   //Recipe ID
                feedbacks:[feedbackSchema]
            }, {collection: 'feedback'}
        );
    }

    public async createModel()
    {
        try
        {
            await Mongoose.connect(this.dbConnectionString);
            this.model = Mongoose.model<IFeedbackModel>("feedback", this.schema);
        }
        catch (e)
        {
            console.error(e);
        }
    }
    
    /**
     * This helper method queries the DB for highest feedbck ID of that recipe, and returns ID + 1,
     * to be used to create a new recipe.
     * 
     * input:
     *     None
     * output:
     *     @returns FeedbackId: number - new feedback ID.
     */
    private async getNewFeedbackId(recipeId: number)
    {
        //Query for highest ID in DB
        console.log("recipeId:", recipeId)
        let query = this.model.findOne({ recipeId: recipeId }).sort({ 'feedbacks.feedbackId': -1 });
        
        let result = await query.exec();
        console.log("result", result)
        //Return the highest recipeId + 1
        const feedbackId = result ? result.feedbacks.at(-1).feedbackId + 1: 1;

        return feedbackId
    }

    /**
    * This  method for adding feedbck to recipe
    * 
    * input:
    *    @param recipeId: the ID of the recipe to lookup in DB
    *    @param feedbacks: feedback data {comment, ratings}
    * Output:
    *    @return None
    */
    public async createFeedback(recipeId: number, feedbacks: any[]) {
        try {
            const id: number = await this.getNewFeedbackId(recipeId)
    
            // Add feedbackId to each feedback object
            feedbacks = feedbacks.map(feedback => ({ feedbackId: id, ...feedback }));
    
            console.log("New feedback details:");
            console.log(feedbacks);
    
            const recipe = await this.model.findOneAndUpdate(
                { recipeId },
                { $push: { feedbacks: { $each: feedbacks } } },
                { new: true }
            );
            
            console.log(`New feedback added for recipe ${recipeId}:`, feedbacks);
        } catch (error) {
            console.error("Error creating feedback:", error);
        }
    }
    
    
   /**
    * This  method for retrieving feedbck of the recipe
    * 
    * input:
    *    @param recipeId : the ID of the recipe to lookup in DB
    *    
    * Output:
    *    @return result : Json string of feedback list
    */
    public async getFeedbackForRecipe(recipeId: number) {
        const query = this.model.findOne({ recipeId: recipeId }).select('-_id');
        try {
            //Execute query
            const result =  await query.exec();
            //If no result returned, return 404
            if (result == null) {
                return [];
            }
            //If result found, send back JSON string of the result, using response handle
            else {
                //let feedbacks = result.feedbacks;
                return result;
            }

        
        } catch (error) {
            console.error("Error fetching feedback for recipe:", error);
            throw (error);
        }
    }
    
    /**
    * This  method for updating feedbck to recipe
    * 
    * input:
    *    @param recipeId:       the ID of the recipe to lookup in DB
    *    @param feedbackId:     the ID of the feedback corresponding to recipeID
    *                           to lookup in DB
    *    @param updatedFeedback: data to be updated in DB {comment, ratings}
    *    
    * Output:
    *    @return None
    */
    public async updateFeedback(recipeId: number, feedbackId: number, updatedFeedback: any){
        try {
            
            await this.model.updateOne(
                { recipeId},
                { 
                    $set: { 
                        "feedbacks.$[elem].userId": updatedFeedback.userId,
                        "feedbacks.$[elem].comment": updatedFeedback.comment,
                        "feedbacks.$[elem].ratings": updatedFeedback.ratings
                    } 
                },
                { arrayFilters: [{ "elem.feedbackId": feedbackId }] }

            );
            console.log(`Feedback ${feedbackId} updated for recipe ${recipeId}:`, updatedFeedback);
        } catch (error) {
            console.error("Error updating feedback:", error);   
        }
    }

   /**
    * This  method for deleting feedbck to recipe
    * 
    * input:
    *    @param recipeId   : the ID of the recipe to lookup in DB
    *    @param feedbackId : the ID of the feedback corresponding to recipeID
    *                        to lookup in DB
    *    
    * Output:
    *    @return None
    */
    public async deleteFeedback(recipeId: number, feedbackId: number){
        try {
            await this.model.updateOne(
                { recipeId },
                { $pull: { feedbacks: { feedbackId } } }
            );
            console.log(`Feedback ${feedbackId} deleted for recipe ${recipeId}`);
        } catch (error) {
            console.error("Error deleting feedback:", error);
        }
    }
    
    /**
    * This  method for calculating average ratings of recipe
    * 
    * input:
    *    @param recipeId:     the ID of the recipe to lookup in DB
    *    
    * Output:
    *    @return averageRating: average ratings of the recipe
    */
    public async getAverageRatingForRecipe(recipeId: number){
        try {
            const recipe = await this.model.findOne({ recipeId });
            const feedbacks = recipe.feedbacks;
            if (feedbacks.length === 0) {
                return 0; // No ratings yet
            }
            const totalRatings = feedbacks.reduce((sum, feedback) => sum + feedback.ratings, 0);
            const averageRating = totalRatings / feedbacks.length;
            return averageRating;
        } catch (error) {
            console.error("Error calculating average rating:", error);
            return 0;
        }
    }

    /**
    * This  method for retrieving most recent feedbacks of recipes
    * 
    * input:
    *    @param recipeId: the ID of the recipe to lookup in DB
    *    
    * Output:
    *    @return mostRecentFeedback: list of most recent feedbacks
    */
    public async getMostRecentFeedback(recipeId: number){
        try {
            const recipe = await this.model.findOne({ recipeId });
            const feedbacks = recipe.feedbacks;
            if (feedbacks.length === 0) {
                return null; // No feedback yet
            }
            const mostRecentFeedback = feedbacks[feedbacks.length - 1];
            return mostRecentFeedback;
        } catch (error) {
            console.error("Error fetching most recent feedback:", error);
            return null;
        }
    }

    /**
    * This  method for retrieving feedbacks added by users
    * 
    * input:
    *    @param userId: the ID of user
    *    
    * Output:
    *    @return userFeedbacks: list of all feedbacks entered by user
    */
    public async getFeedbackByUserId(userId: number){
        try {
            const recipes = await this.model.find({ "feedbacks.userId": userId }).exec();
            let userFeedbacks = [];
            recipes.forEach(recipe => {
                recipe.feedbacks.map(feedback => {
                    console.log("feedback", feedback)
                    if(String(feedback.userId) === String(userId)) {
                        let userFeedback = {
                            recipeId: recipe.recipeId,
                            comment: feedback.comment,
                            ratings: feedback.ratings
                        };
                        userFeedbacks.push(userFeedback);
                    }
                });
            });
            console.log("Feedbacks", userFeedbacks)
            return userFeedbacks;
        } catch (error) {
            console.error("Error fetching feedback by user ID:", error);
            return [];
        }
    }
    
    
    
}
export { FeedbackModel };

