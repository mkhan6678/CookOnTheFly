import Mongoose = require("mongoose");

interface IFeedbackModel extends Mongoose.Document {
    recipeId: number;                //Recipe ID
    feedbacks:[{
        reviewId: number;                //Review ID
        userId: number;                  //user ID
        comment: string;                 //Feedback and comments
        ratings: number;                 //Rating number
    }]
}
export {IFeedbackModel};  