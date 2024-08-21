import Mongoose = require("mongoose");

interface IRecipeModel extends Mongoose.Document {
    recipeId: number;               //Recipe ID
    name: string;                   //Recipe Name
    description: string;            //Recipe description and steps
    ingredients: number[];          //List of ingredients IDs
    cuisine: string;                //Type of cuisine (e.g. Chinese, French, Mexican,...)
    dietaryRestrictions: string[];  //List of dietary restrictions (e.g. Vegan, Vegetarian, ...)
    createdByUserId: String;        //ID of user who created the recipe
    savedByUserId: string[],        //ID of user who saved the recipe
    images: string[];               //List of image URLs
    premium: boolean;               //Available for premium users only?
    ratings: number;                //Average ratings
    // feedback: number[];             //List of feedback IDs
}
export {IRecipeModel};