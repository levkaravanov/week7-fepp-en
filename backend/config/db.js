const mongoose = require("mongoose");
const config = require("../utils/config");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    // After successful connection, ensure indexes are in sync with the schema
    try {
      const User = require("../models/userModel");
      await User.syncIndexes();
      // In case a stale unique index exists on username, drop it explicitly
      const indexes = await User.collection.indexes();
      const hasStaleUsernameIndex = indexes.some((idx) => idx.name === "username_1");
      if (hasStaleUsernameIndex) {
        await User.collection.dropIndex("username_1");
        console.log("Dropped stale index username_1 from users collection");
      }
    } catch (idxErr) {
      console.log("Index sync/drop skipped:", idxErr.message);
    }
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

module.exports = connectDB;
