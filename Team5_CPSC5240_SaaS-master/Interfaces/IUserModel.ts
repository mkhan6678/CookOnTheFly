import mongoose = require("mongoose");

interface IUserModel extends mongoose.Document {
  userId: number;
  name: string;
  email: string;
  password: string;
  phone: string;
}

export { IUserModel };