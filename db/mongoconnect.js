
const mongoose = require('mongoose');
const {config}=require('../config/secret')

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect(config.connectionString);
  console.log("mongo connect started");
}