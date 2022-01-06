const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_SECRETE_KEY, {
  useNewUrlParser: true,
});
