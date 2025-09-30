require('dotenv').config();


exports.config = {
    port: process.env.PORT || 3000,
    tokenSecret: process.env.TOKEN_SECRET,
    connectionString: process.env.CONNECTION_STRING
}
