import Mongoose = require("mongoose");

interface IIngredientsModel extends Mongoose.Document {
    ingredientId: number;
    name: string;
    category: string;
}
export {IIngredientsModel};
