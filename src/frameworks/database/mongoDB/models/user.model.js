var mongoose = require('mongoose');

const Schema = mongoose.Schema;
const UserSchema = new Schema({
  username: {
    type: String
  },
  password: {
    type: String
  },
  role: {
    type: String,
    default: 'test_user'
  },
  createdAt: {
    type: Date
  },
  monthlyBudget: {
    type: Number,
    default: 1000
  },
  dailyCaloryLimit: {
    type: Number,
    default: 2100
  },
  weeklyAverage: {
    type: Number,
    default: 0
  }
});

const UserModel = mongoose.model('User', UserSchema);

UserModel.ensureIndexes((err) => {
  if (err) {
    return err;
  }
  return true;
});

module.exports = UserModel;