const mongoose = require("mongoose");
require("dotenv").config();

const connect = () => {
    mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => console.log("DB connected successfully!"))
        .catch((error) => {
            console.log("DB connection issue");
            console.log(error);
            process.exit(1); // Exit the process if the connection fails
        });
};

module.exports = {connect};
